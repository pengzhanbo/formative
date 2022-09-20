import { NFormItem, NSwitch } from 'naive-ui'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { FormInjectKey } from '../composables'
import { useDotKey, useDotPath, useFormData } from '../composables'
import type { SwitchField } from '../types'
import Description from './Description'

export default defineComponent({
  name: 'SwitchField',
  props: {
    schema: {
      type: Object as PropType<SwitchField>,
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
    const switchValue = useDotPath(model, dotKey)

    const option = computed(() => {
      const schema = props.schema
      const { type: _t, default: _d, description: _de, field: _f, label: _l, ...option } = schema
      return option
    })

    return () => (
      <NFormItem
        label={props.schema.label}
        path={dotKey.value}
        v-show={props.show}
        rule={props.schema.rule}
      >
        <p class="fm-content">
          <NSwitch v-model={[switchValue.value, 'value']} {...option.value} />
          <Description description={props.schema.description} />
          {slots.default?.()}
        </p>
      </NFormItem>
    )
  },
})
