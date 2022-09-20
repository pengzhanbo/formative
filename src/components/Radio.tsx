import { NFormItem, NRadio, NRadioButton, NRadioGroup, NSpace } from 'naive-ui'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { FormInjectKey } from '../composables'
import { useDotKey, useDotPath, useFormData } from '../composables'
import type { RadioField } from '../types'
import { isObject } from '../utils'
import Description from './Description'

export default defineComponent({
  name: 'RadioField',
  props: {
    schema: {
      type: Object as PropType<RadioField>,
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
    const radio = useDotPath(model, dotKey)

    const options = computed(() => {
      return props.schema.options.map((option) => {
        if (isObject(option)) {
          return option
        } else {
          return { label: option as string, value: option }
        }
      })
    })

    return () => (
      <NFormItem
        label={props.schema.label}
        path={dotKey.value}
        v-show={props.show}
        rule={props.schema.rule}
      >
        <p class="fm-content">
          <NRadioGroup v-model={[radio.value, 'value']} name={props.schema.field}>
            {props.schema.button ? (
              options.value.map(({ label, value }) => <NRadioButton label={label} value={value} />)
            ) : (
              <NSpace>
                {options.value.map(({ label, value }) => (
                  <NRadio label={label} value={value} />
                ))}
              </NSpace>
            )}
          </NRadioGroup>
          <Description description={props.schema.description} />
          {slots.default?.()}
        </p>
      </NFormItem>
    )
  },
})
