import { isFunction } from '../utils'
import { computed, DefineComponent, PropType, readonly } from 'vue'
import { defineComponent, h } from 'vue'
import { FormInjectKey, useFormData } from '../composables'
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

/**
 * 这个 对象保存了目前支持的各种 Field 类型，
 * 可以根据需求，参考其中的组件，封装实现新的 Field类型，
 * 这是一件很容易得事情
 */
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
    /**
     * inject 获取 表单数据时，需要的 key
     */
    injectKey: {
      type: Symbol as PropType<FormInjectKey>,
      required: true,
    },
    /**
     * 对于 object/array 类型的 Field，由于其嵌套关系，
     * 使用 a.b.c 的方式作为 field path 来获取对应的值
     */
    dotKey: {
      type: String,
      default: '',
    },
  },
  setup: (props, { slots }) => {
    const model = useFormData(props.injectKey)
    const show = computed(() => {
      const showField =
        typeof props.schema.showField === 'undefined' ? true : props.schema.showField
      return isFunction(showField) ? showField(readonly(model)) : showField
    })
    /**
     * 这里是通过 vue 的 h() 渲染函数， 根据配置中的 field.type 获取 Field类型，
     * 选择对应的组件进行渲染
     */
    return () =>
      h(
        components[props.schema.type],
        {
          schema: props.schema,
          injectKey: props.injectKey,
          dotKey: props.dotKey,
          show: show.value,
        },
        slots
      )
  },
})
