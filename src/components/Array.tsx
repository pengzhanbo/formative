import { NButton, NFormItem } from 'naive-ui'
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { FormInjectKey } from '../composables'
import { useDotKey, useDotPath, useFormData } from '../composables'
import type { ArrayField, ArrayFieldItem } from '../types'
import { cloneJson, isArray, isObject } from '../utils'
import Description from './Description'
import Field from './Field'
import AddIcon from './icons/AddIcon.vue'
import DeleteIcon from './icons/DeleteIcon.vue'

export default defineComponent({
  name: 'ArrayField',
  props: {
    schema: {
      type: Object as PropType<ArrayField>,
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
  setup: (props) => {
    const model = useFormData(props.injectKey)
    const dotKey = useDotKey(props)
    const array = useDotPath(model, dotKey)

    const maxLength = computed(() => props.schema.maxlength || Infinity)
    const minLength = computed(() => props.schema.minlength || 0)
    const canAdd = computed(() => array.value.length < maxLength.value)
    const canDelete = computed(() => array.value.length > minLength.value)

    const addItem = () => {
      if (isArray(props.schema.items)) return
      if (array.value.length < maxLength.value) {
        array.value.push(
          isObject(props.schema.items.default)
            ? cloneJson(props.schema.items.default)
            : props.schema.items.default
        )
      }
    }

    const deleteItem = (index: number) => {
      if (isArray(props.schema.items)) return
      if (array.value.length > minLength.value) {
        array.value.splice(index, 1)
      }
    }

    return () => (
      <div class="fm-array-wrapper">
        <div class="fm-flex-1">
          <p class="fm-array-title">
            <span>{props.schema.label}</span>
            <Description description={props.schema.description} />
          </p>
          {/**
           * 如果配置中的 items 是一个 固定长度的数组，
           * 那么则对每个元素 根据其 field 类型动态渲染，（允许每个元素类型不同）
           * 如果不是，则表示 声明的是数组中的每个元素的类型，（每个元素的类型相同）
           */}
          {isArray(props.schema.items) ? (
            props.schema.items.map((item, index) => (
              <Field
                schema={{ ...item, field: `${index}` }}
                injectKey={props.injectKey}
                dotKey={dotKey.value}
              />
            ))
          ) : (
            <>
              {array.value.map((_, index) => (
                <Field
                  schema={{ ...(props.schema.items as ArrayFieldItem), field: `${index}` }}
                  injectKey={props.injectKey}
                  dotKey={dotKey.value}
                >
                  <NButton
                    class="fm-ml-4"
                    size="small"
                    type="error"
                    circle
                    disabled={!canDelete.value}
                    onClick={() => deleteItem(index)}
                  >
                    {{
                      icon: () => <DeleteIcon />,
                    }}
                  </NButton>
                </Field>
              ))}
              <NFormItem>
                <NButton size="small" type="primary" disabled={!canAdd.value} onClick={addItem}>
                  {{
                    icon: () => <AddIcon></AddIcon>,
                    default: () => '添加',
                  }}
                </NButton>
              </NFormItem>
            </>
          )}
        </div>
      </div>
    )
  },
})
