import type { FormItemRule, SelectGroupOption, SelectOption } from 'naive-ui'

export interface FormativeConfig {
  inline?: boolean
  labelWidth?: number | 'auto' | string
  labelAlign?: 'left' | 'right'
  labelPlacement?: 'top' | 'left'
  showLabel?: boolean
  showRequireMark?: boolean
  showFeedback?: boolean
  size?: 'small' | 'medium' | 'large'
  validateMessage?: string
  schema: FormativeSchema
}

export type FormativeSchema = (FieldItem | GroupField)[]

export type FieldType =
  | 'group'
  | 'object'
  | 'array'
  | 'text'
  | 'textView'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'select'
  | 'number'

export type FieldItem =
  | TextField
  | TextViewField
  | RadioField
  | CheckboxField
  | SwitchField
  | SelectField
  | NumberField
  | ObjectField
  | ArrayField

export type ArrayFieldItem =
  | Omit<TextField, 'field'>
  | Omit<TextViewField, 'field'>
  | Omit<RadioField, 'field'>
  | Omit<CheckboxField, 'field'>
  | Omit<SwitchField, 'field'>
  | Omit<SelectField, 'field'>
  | Omit<NumberField, 'field'>
  | Omit<ObjectField, 'field'>
  | Omit<ArrayField, 'field'>

type FieldOptions = (string | number | { label: string; value: string | number })[]

export interface BasicField {
  type: FieldType
  field: string
  label: string
  description?: string
  rule?: FormItemRule | FormItemRule[]
}

export interface GroupField {
  type: 'group'
  label: string
  description?: string
  schema: FieldItem[]
  spread?: boolean
  forgetSpread?: boolean
  showField?: boolean | ((fields: Record<string, any>) => boolean)
}

export interface TextField extends BasicField {
  type: 'text'
  default?: string
  maxlength?: number
  minlength?: number
  inputType?: 'text' | 'password' | 'textarea'
  autofocus?: boolean
  autosize?: boolean
  clearable?: boolean
  disable?: boolean
  loading?: boolean
  pair?: boolean
  passivelyActivated?: boolean
  placeholder?: string | [string, string]
  readonly?: boolean
  round?: boolean
  rows?: number
  separator?: string
  showCount?: boolean
  showPasswordOn?: 'click' | 'mousedown'
  allowInput?: (value: string) => boolean
  onInput?: (value: string | [string, string]) => void
  onChange?: (value: string | [string, string]) => void
  onBlur?: () => void
  onClear?: () => void
  onFocus?: () => void
  onUpdateValue?: (value: string | [string, string]) => void
}

export interface TextViewField extends BasicField {
  type: 'textView'
  default?: string
}

export interface RadioField extends BasicField {
  type: 'radio'
  default?: number | string | boolean
  options: FieldOptions
  button?: boolean
  onUpdateValue?: (value: string | number | boolean) => void
}

export interface CheckboxField extends BasicField {
  type: 'checkbox'
  default?: (number | string)[]
  min?: number
  max?: number
  options: FieldOptions
  onUpdateValue?: (
    value: string | number | (string | number)[],
    meta: { actionType: 'check' | 'uncheck'; value: string | number }
  ) => void
}

export interface SwitchField extends BasicField {
  type: 'switch'
  default?: boolean
  checkedValue?: string | number | boolean
  unCheckedValue?: string | number | boolean
  disabled?: boolean
  loading?: boolean
  round?: boolean
  rubberBand?: boolean
  onUpdateValue?: (value: boolean) => void
}

export interface SelectField extends BasicField {
  type: 'select'
  default?: number | string | (number | string)[] | null
  consistentMenuWidth?: boolean
  clearable?: boolean
  filterable?: boolean
  maxTagCount?: number
  multiple?: boolean
  options?: (SelectOption | SelectGroupOption)[]
  placeholder?: string
  placement?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end'
  filter: (pattern: string, option: object) => boolean
  onBlur: () => void
  onClear: () => void
  onCreate: (label: string) => SelectOption
  onFocus: () => void
  onScroll: (ev: Event) => void
  onSearch: (value: string) => void
  onUpdateValue: (
    value: any[] | string | number | null,
    option: SelectOption | SelectOption[] | null
  ) => void
}

export interface NumberField extends BasicField {
  type: 'number'
  default?: number
  autofocus?: boolean
  buttonPlacement?: 'both' | 'right'
  clearable?: boolean
  disabled?: boolean
  keyboard?: { ArrowUp?: boolean; ArrowDown?: boolean }
  loading?: boolean
  min?: number
  max?: number
  placeholder?: string
  precision?: number
  readonly?: boolean
  showButton?: boolean
  step?: number
  parse?: (value: string) => number | null
  format?: (value: number | null) => string
  onBlur?: () => void
  onClear?: () => void
  onFocus?: () => void
  onUpdateValue?: (value: number | null) => void
}

export interface ObjectField extends BasicField {
  type: 'object'
  default?: Record<string, any>
  schema: FieldItem[]
}

export interface ArrayField extends BasicField {
  type: 'array'
  default?: unknown[]
  maxlength?: number
  minlength?: number
  items: ArrayFieldItem | ArrayFieldItem[]
}
