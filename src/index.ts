import type { App } from 'vue'
import Formative from './components/Formative'

import './style.scss'

export * from './types'

export { Formative }

const install = (app: App) => {
  if ((install as any).installed) return
  app.component(Formative.name, Formative)
  ;(install as any).installed = true
}

Formative.install = install

export default Formative
