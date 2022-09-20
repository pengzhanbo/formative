/**
 * 通过 provide/inject API ，共享 formData
 */
import type { InjectionKey, Ref, WritableComputedRef } from 'vue'
import { inject, provide } from 'vue'

export type FormData = Ref<Record<string, any>> | WritableComputedRef<Record<string, any>>

export type FormInjectKey = InjectionKey<FormData>

/**
 * 注入 formData
 * @param formData
 * @returns
 */
export const useFormDataProvide = (formData: FormData): FormInjectKey => {
  const key: FormInjectKey = Symbol('formData')
  provide(key, formData)

  return key
}

/**
 * 获取 formData 数据
 * @param key
 * @returns
 */
export const useFormData = (key: FormInjectKey): FormData => inject<FormData>(key)!
