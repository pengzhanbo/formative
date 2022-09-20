import { NCard } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'
import JsonPretty from 'vue-json-pretty'
import type { FormativeConfig } from '../src'
import Formative from '../src'

import 'vue-json-pretty/lib/styles.css'

export default defineComponent({
  name: 'App',
  setup: () => {
    const formConfig: FormativeConfig = {
      labelAlign: 'right',
      labelPlacement: 'left',
      schema: [
        {
          field: 'text',
          type: 'text',
          label: '文本',
          description: '文本提示',
        },
        {
          field: 'switch',
          type: 'switch',
          label: '开关',
        },
        {
          field: 'radio',
          type: 'radio',
          label: '单选',
          button: true,
          options: ['Mark', 'John'],
        },
        {
          field: 'checkbox',
          type: 'checkbox',
          label: '多选',
          options: ['Mark', 'John', 'Judy']
        },
        {
          field: 'number',
          type: 'number',
          label: '数字'
        },
        {
          type: 'array',
          field: 'array',
          label: '数组',
          items: {
            type: 'text',
            label: '文本1',
          },
        },
        {
          type: 'object',
          field: 'object',
          label: '对象',
          schema: [{ type: 'text', field: 'text', label: '文本2' }],
        },
        {
          type: 'group',
          label: '分组',
          schema: [
            {
              type: 'text',
              label: '文本',
              field: 'text1',
            },
          ],
        },
      ],
    }
    const formData = ref({
      text: '',
      switch: false,
      radio: 'John',
      array: ['1'],
      object: { text: '2' },
      text1: '',
    })
    watch(
      () => formData.value,
      (v) => console.log(v),
      { deep: true }
    )
    return () => (
      <div class="fm-flex">
        <NCard>
          <JsonPretty data={formConfig as any}></JsonPretty>
        </NCard>
        <NCard>
          <Formative config={formConfig} v-model={formData.value}></Formative>
          <div class="fm-border-t-1 fm-pt-4">
            <h2 class="fm-text-xl">formData: </h2>
            <JsonPretty data={formData.value as any}></JsonPretty>
          </div>
        </NCard>
      </div>
    )
  },
})
