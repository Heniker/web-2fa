<template>
  <v-data-table v-bind="$props">
    <template v-for="(_, slotName) in $scopedSlots" #[slotName]="slotData">
      <slot :name="slotName" v-bind="slotData" />
    </template>

    <template #[`group.header`]="data">
      <td v-for="(item, i) in groups" :key="i" :colspan="item">
        <slot :name="`group-${i}`" v-bind="data"><span></span></slot>
      </td>
      <td class="group-toggle-button">
        <span class="align-center">
          <v-btn elevation="0" icon @click="data.toggle">
            <v-icon small>
              {{ data.isOpen ? 'mdi-minus' : 'mdi-plus' }}
            </v-icon>
          </v-btn>
        </span>
      </td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { VDataTable } from 'vuetify/lib'

interface PropsI {
  group: number[]
}

export default defineComponent({
  props: ['group'],
  extends: VDataTable,

  setup(props: PropsI) {
    return {
      groups: props.group,
    }
  },
})
</script>

<style scoped>
* >>> .group-toggle-button {
  display: inline-flex;
  align-items: center;
  margin-left: -50px;
  border: none !important;
  padding: 0 !important;
}
</style>
