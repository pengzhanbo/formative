import { NCheckbox, NCheckboxGroup, NFormItem, NSpace } from 'naive-ui'
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import type { FormInjectKey } from '../composables'
import { useDotKey, useDotPath, useFormData } from '../composables'
import type { CheckboxField } from '../types'
import { isObject } from '../utils'
import Description from './Description'

export default defineComponent({
  name: 'CheckboxField',
  props: {
    schema: {
      type: Object as PropType<CheckboxField>,
      required: true,
    },
    injectKey: {
      type: Symbol as PropType<FormInjectKey>,
      required: true,
    },
    dotKey: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup: (props, { slots }) => {
    const model = useFormData(props.injectKey)
    const dotKey = useDotKey(props)
    const checkbox = useDotPath(model, dotKey)

    const options = computed(() => {
      return props.schema.options.map((option) => {
        if (isObject(option)) {
          return option
        } else {
          return { label: option as string, value: option }
        }
      })
    })

    const option = computed(() => {
      const { min, max, onUpdateValue } = props.schema
      return { min, max, onUpdateValue }
    })

    const checkAll = ref(false)
    const isIndeterminate = ref(false)

    const checkAllHandle = () => {
      checkbox.value = checkAll.value ? options.value.map(({ value }) => value) : []
    }

    watch(
      () => checkbox.value,
      (value) => {
        isIndeterminate.value = !!value && value.length > 0 && value.length < options.value.length
        checkAll.value = checkbox.value.length === options.value.length
      },
      { immediate: true }
    )

    return () => (
      <NFormItem
        label={props.schema.label}
        path={dotKey.value}
        v-show={props.show}
        rule={props.schema.rule}
      >
        <p class="fm-content">
          <NCheckbox
            label="全选"
            onUpdateChecked={checkAllHandle}
            indeterminate={isIndeterminate.value}
            v-model={[checkAll.value, 'checked']}
            value="all"
          />
          <NCheckboxGroup v-model={[checkbox.value, 'value']} {...option.value}>
            <NSpace itemStyle="display: 'flex'" align="center">
              {options.value.map(({ label, value }) => (
                <NCheckbox label={label} value={value} />
              ))}
            </NSpace>
          </NCheckboxGroup>
          <Description description={props.schema.description} />
          {slots.default?.()}
        </p>
      </NFormItem>
    )
  },
})
