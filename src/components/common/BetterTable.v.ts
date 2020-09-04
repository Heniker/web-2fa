import * as v from '@vue/composition-api'
import { VDataTable } from 'vuetify/lib'

interface PropsI {
  group: number[]
}

export default v.defineComponent({
  props: ['group'],
  extends: VDataTable,

  setup(props: PropsI) {
    return {
      groups: props.group,
    }
  },
})
