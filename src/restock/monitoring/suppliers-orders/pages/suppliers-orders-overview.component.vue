<script>
import NewOrders from "../components/new-orders.component.vue";
import {TabPanel as PvTabPanel} from "primevue";

export default {
  name: "suppliers-orders-overview",
  components: {PvTabPanel, NewOrders},
  data() {
    return {
      tabs: [
        { title: 'New Orders', value: 0, content: 'Este es el resumen del pedido.' },
        { title: 'Your Orders', value: 1, content: 'Aquí van los detalles del pedido.' },
        { title: 'Orders Historial', value: 2, content: 'Historial de cambios del pedido.' }
      ]
    };
  }
}
</script>

<template>

  <pv-tabs value="0">
    <pv-tab-list>
      <pv-tab v-for="tab in tabs" :key="tab.title" :value="tab.value">
        {{ tab.title }}
      </pv-tab>
    </pv-tab-list>
    <pv-tab-panels>
      <pv-tab-panel :value="0">
        <new-orders></new-orders>
      </pv-tab-panel>
      <pv-tab-panel>
        {{ tabs[1].content }}
      </pv-tab-panel>
      <pv-tab-panel>
        {{ tabs[2].content }}
      </pv-tab-panel>
    </pv-tab-panels>
  </pv-tabs>

</template>

<style scoped>

</style>