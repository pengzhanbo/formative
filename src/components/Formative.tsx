import { NForm } from 'naive-ui'
import type { PropType } from 'vue'
import { computed, defineComponent, ref, watch } from 'vue'
import { useFormDataProvide } from '../composables'
import type { FieldItem, FormativeConfig, FormativeSchema } from '../types'
import { cloneJson, hasOwn, isArray } from '../utils'
import Field from './Field'
import Group from './Group'

export default defineComponent({
  name: 'Formative',
  props: {
    modelValue: {
      type: (Object as PropType<Record<string, any>>) || undefined,
      default: undefined,
    },
    config: {
      type: Object as PropType<FormativeConfig>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup: (props, { emit }) => {
    const formOption = computed(() => {
      const { schema: _, ...option } = props.config
      return option
    })

    const schema = computed(() => props.config.schema)
    const initialValue = getInitialValue(schema.value, cloneJson(props.modelValue || {}))
    const formModel = ref(initialValue)

    watch(
      () => props.modelValue,
      (v) => {
        if (v && v !== formModel.value) {
          formModel.value = cloneJson(v)
        }
      }
    )

    watch(
      () => formModel.value,
      (v) => emit('update:modelValue', v),
      { deep: true }
    )

    const injectKey = useFormDataProvide(formModel)

    return () => (
      <NForm {...formOption.value} model={formModel.value} class="fm-formative">
        {schema.value.map((field) =>
          field.type === 'group' ? (
            <Group injectKey={injectKey} schema={field} />
          ) : (
            <Field injectKey={injectKey} schema={field} />
          )
        )}
      </NForm>
    )
  },
})

function getInitialValue<T extends object>(
  schema: FormativeSchema,
  result: T = Object.create(null)
): T {
  schema.forEach((item) => {
    if (item.type === 'group') {
      getInitialValue(item.schema, result)
    } else {
      result[item.field] = result[item.field] || getDefaultValue(item)
    }
  })
  return result
}

function getDefaultValue(field: FieldItem): unknown {
  switch (field.type) {
    case 'text':
    case 'textView':
    case 'radio':
      return field.default || ''
    case 'number':
      return field.default || field.min || 0
    case 'switch':
      return hasOwn(field, 'default') ? field.default : false
    case 'checkbox':
      return field.default || []
    case 'select':
      const multiple = hasOwn(field, 'multiple') ? field.multiple : false
      if (multiple) {
        return field.default ? (isArray(field.default) ? field.default : [field.default]) : []
      } else {
        if (field.default) return field.default
        if (!field.options?.length) return ''
        if ((field.options[0] as any).options)
          return (field.options[0] as any).options[0].value || ''
        return (field.options[0] as any).value || ''
      }
    case 'array':
      if (field.default) return field.default
      if (isArray(field.items)) {
        return field.items.map((item) => (item as any).default)
      } else {
        return new Array(field.minlength || 0).fill((field.items as any).default)
      }
    case 'object':
      const obj = field.default || {}
      field.schema.forEach((prop) => {
        obj[prop.field] = obj[prop.field] || getDefaultValue(prop)
      })
      return obj
    default:
      return undefined
  }
}
