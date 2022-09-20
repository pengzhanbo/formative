import type { DefineComponent, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { FormInjectKey } from '../composables'
import type { FieldItem, FieldType } from '../types'
import _Array from './Array'
import _Checkbox from './Checkbox'
import _Number from './Number'
import _Object from './Object'
import _Radio from './Radio'
import _Select from './Select'
import _Switch from './Switch'
import _Text from './Text'
import _TextView from './TextView'

const components: Record<Exclude<FieldType, 'group'>, DefineComponent<any, any, any>> = {
  array: _Array,
  object: _Object,
  text: _Text,
  switch: _Switch,
  radio: _Radio,
  select: _Select,
  checkbox: _Checkbox,
  number: _Number,
  textView: _TextView,
}

export default defineComponent({
  name: 'Field',
  props: {
    schema: {
      type: Object as PropType<FieldItem>,
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
  },
  setup: (props, { slots }) => {
    return () =>
      h(
        components[props.schema.type],
        {
          schema: props.schema,
          injectKey: props.injectKey,
          dotKey: props.dotKey,
        },
        slots
      )
  },
})
