import { NTooltip } from 'naive-ui'
import { defineComponent } from 'vue'
import InfoIcon from './icons/InfoIcon.vue'

export default defineComponent({
  name: 'DescriptionTips',
  props: {
    description: {
      type: String,
      default: '',
    },
  },
  setup: (props) => {
    return () =>
      props.description ? (
        <NTooltip trigger="hover">
          {{
            trigger: () => <InfoIcon style={{ fontSize: '1rem', marginLeft: '0.5rem' }} />,
            default: () => props.description,
          }}
        </NTooltip>
      ) : null
  },
})
