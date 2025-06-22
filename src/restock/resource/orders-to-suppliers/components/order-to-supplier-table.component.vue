<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

export default {
  name: 'OrderToSupplierTable',
  components: {
    'pv-data-table': DataTable,
    'pv-column': Column,
    'pv-button': Button
  },
  props: {
    orders: Array,
    batches: Array,
    suppliers: Array,
    states: Array,
    situations: Array
  },
  emits: ['viewDetails', 'leaveFeedback'],
  computed: {
    enrichedOrders() {
      return this.orders.map(order => {
        const enriched = {
          stateName: order.state?.name || 'Unknown',
          situationName: order.situation?.name || 'Unknown',
          supplierName: order.supplier?.name || order.supplier?.email || 'Unknown',
          dateFormatted: new Date(order.date).toLocaleDateString()

        };
        return Object.assign({}, order, enriched);
      });
    }
  },
  methods: {
    view(order) {
      this.$emit('viewDetails', order);
    },
    feedback(order) {
      this.$emit('leaveFeedback', order);
    }
  }
};
</script>

<template>
  <div>
    <pv-data-table :value="enrichedOrders" paginator :rows="5" :rows-per-page-options="[5, 10, 15]">
      <pv-column field="situationName" header="Situation"/>
      <pv-column field="stateName" header="State"/>
      <pv-column field="dateFormatted" header="Date"/>
      <pv-column field="supplierName" header="Supplier"/>
      <pv-column field="requested_products_count" header="Requested Products"/>
      <pv-column field="total_price" header="Total Price" :body="data => `S/. ${Number(data.total_price).toFixed(2)}`"/>

      <pv-column header="Actions" :style="{ width: '150px' }">
        <template #body="slotProps">
          <div class="actions">
            <pv-button icon="pi pi-eye" class="p-button-text p-button-sm" @click="view(slotProps.data)"/>
            <pv-button
                icon="pi pi-comment"
                class="p-button-text p-button-sm"
                v-if="slotProps.data.state?.name === 'Delivered'"
                @click="feedback(slotProps.data)"
            />
          </div>
        </template>
      </pv-column>

    </pv-data-table>

    <div v-if="!enrichedOrders.length" class="empty-state">
      <i class="pi pi-truck" style="font-size: 2rem; color: #ccc; margin-bottom: 0.5rem"/>
      <p>
        You currently have no orders registered.
        Create a new order to start managing your purchases and supplies from this section.
      </p>
    </div>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #888;
}
</style>
