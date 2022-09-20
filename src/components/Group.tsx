import type { PropType } from 'vue'
import { computed, defineComponent, readonly, ref } from 'vue'
import type { FormInjectKey } from '../composables'
import { useFormData } from '../composables'
import type { GroupField } from '../types'
import { isBoolean, isFunction } from '../utils'
import Description from './Description'
import Field from './Field'
import ArrowIcon from './icons/ArrowIcon.vue'

export default defineComponent({
  name: 'FormativeGroup',
  props: {
    schema: {
      type: Object as PropType<GroupField>,
      required: true,
    },
    injectKey: {
      type: Symbol as PropType<FormInjectKey>,
      required: true,
    },
  },
  setup: (props) => {
    const model = useFormData(props.injectKey)
    const spread = ref(
      props.schema.forgetSpread ? true : isBoolean(props.schema.spread) ? props.schema.spread : true
    )
    const handleClick = () => {
      if (props.schema.forgetSpread) return
      spread.value = !spread.value
    }
    const show = computed(() => {
      const showField =
        typeof props.schema.showField === 'undefined' ? true : props.schema.showField
      return isFunction(showField) ? showField(readonly(model)) : showField
    })
    return () => (
      <div class="fm-group-wrapper" v-show={show.value}>
        <label class="fm-group-label" onClick={handleClick}>
          <Description description={props.schema.description} />
          <span>{props.schema.label}</span>
          <ArrowIcon class={{ 'fm-group-icon': true, 'open': spread.value }} />
        </label>
        <div v-show={spread.value}>
          {props.schema.schema.map((schema) => (
            <Field schema={schema} injectKey={props.injectKey} />
          ))}
        </div>
      </div>
    )
  },
})
