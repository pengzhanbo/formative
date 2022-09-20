import { NFormItem } from 'naive-ui'
import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import type { FormInjectKey } from '../composables'
import { useDotKey, useDotPath, useFormData } from '../composables'
import type { TextField } from '../types'
import Description from './Description'

export default defineComponent({
  name: 'TextField',
  props: {
    schema: {
      type: Object as PropType<TextField>,
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
    const text = useDotPath(model, dotKey)

    return () => (
      <NFormItem label={props.schema.label} path={dotKey.value} v-show={props.show} rule={props.schema.rule}>
        <p class="fm-content">
          <p class="fm-font-bold">{text.value}</p>
          <Description description={props.schema.description} />
          {slots.default?.()}
        </p>
      </NFormItem>
    )
  },
})
