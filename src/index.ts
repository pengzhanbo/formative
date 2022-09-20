/**
 * 在阅读本代码时，建议从 ./components/Formative.tsx 文件开始阅读，
 */
import type { App } from 'vue'
import Formative from './components/Formative'
import { FormativeConfig } from './types'

import './style.scss'

export * from './types'

export { Formative }

export const defineFormativeConfig = (config: FormativeConfig): FormativeConfig => config

/**
 * 作为 vue plugin ，允许通过 app.use() 注册为全局组件
 */
const install = (app: App) => {
  if ((install as any).installed) return
  app.component(Formative.name, Formative)
  ;(install as any).installed = true
}

Formative.install = install

export default Formative
