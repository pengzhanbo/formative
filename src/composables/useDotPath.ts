import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { FieldItem } from '../types'
import { isEmpty } from '../utils'
import type { FormData } from './useFormData'

function setDotPath(model: Record<string, any>, dotKey: string, value?: any): void {
  const dotList = dotKey.split('.')
  const key = dotList.pop()!
  while (dotList.length) {
    const dot = dotList.shift()!
    model = model[dot]
  }
  model[key] = value
}
function getDotPath(model: Record<string, any>, dotKey: string): any {
  const dotList = dotKey.split('.')
  while (dotList.length) {
    const dot = dotList.shift()!
    model = model[dot]
  }
  return model
}

export const useDotPath = <T = any>(model: FormData, dotKey: ComputedRef<string>) => {
  const binding = computed<T>({
    set(data) {
      setDotPath(model.value, dotKey.value, data)
    },
    get() {
      return getDotPath(model.value, dotKey.value)
    },
  })

  return binding
}

export const useDotKey = (props: { dotKey: string; schema: FieldItem }) => {
  return computed(() => {
    const dotKey = props.dotKey
    return !isEmpty(dotKey) ? `${dotKey}.${props.schema.field}` : props.schema.field
  })
}
