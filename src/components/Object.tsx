import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { FormInjectKey } from '../composables'
import { useDotKey } from '../composables'
import type { ObjectField } from '../types'
import Description from './Description'
import Field from './Field'

export default defineComponent({
  name: 'ObjectField',
  props: {
    schema: {
      type: Object as PropType<ObjectField>,
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
  setup(props, { slots }) {
    const dotKey = useDotKey(props)
    return () => (
      <div class="fm-object-wrapper" v-show={props.show}>
        <div class="fm-flex-1">
          <p class="fm-object-title">
            <span>{props.schema.label}</span>
            <Description description={props.schema.description} />
          </p>
          {props.schema.schema.map((prop) => (
            <Field schema={prop} injectKey={props.injectKey} dotKey={dotKey.value} />
          ))}
        </div>
        {slots.default?.()}
      </div>
    )
  },
})
