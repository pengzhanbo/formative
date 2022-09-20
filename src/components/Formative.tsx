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
    /**
     * 获取表单数据的初始数据，如果有传入 modelValue 那么表示用户预设了 表单数据
     * 但是还需要校验字段是否齐全，并且补全所有字段以及对应的默认值
     */
    const initialValue = getInitialValue(schema.value, cloneJson(props.modelValue || {}))
    const formModel = ref(initialValue)

    /**
     * 如果外层绑定的 表单数据被覆盖,
     * 那么组件内的 数据需要重新更新
     */
    watch(
      () => props.modelValue,
      (v) => {
        if (v && v !== formModel.value) {
          formModel.value = getInitialValue(schema.value, cloneJson(v))
        }
      }
    )

    /**
     * 内层的表单数据更新，通过 emit发送到外层
     * 这也是实现 v-model 指令的关键
     */
    watch(
      () => formModel.value,
      (v) => emit('update:modelValue', v),
      { deep: true }
    )

    /**
     * 通过 provide() 向表单内的注入 表单数据
     * 内部的 field组件通过 inject 直接获取数据
     */
    const injectKey = useFormDataProvide(formModel)

    /**
     * 当你大体看完这个组件的内容，那么应该前往
     * ./Field.tsx 文件
     * 这个文件是实现 表单生成的关键组件
     *
     * 而 ./Group.tsx 组件，其目的是能够对 表单的字段在渲染上能够进行 分组，
     * 使得字段能够根据某个维度进行分组划分显示，即对 多个Field 再包上一层，
     * 所以并不是关键
     */
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

function getInitialValue(
  schema: FormativeSchema,
  result = Object.create(null)
) {
  schema.forEach((item) => {
    if (item.type === 'group') {
      getInitialValue(item.schema, result)
    } else {
      const { field } = item
      result[field] = hasOwn(result, field) ? result[field] : getDefaultValue(item)
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
