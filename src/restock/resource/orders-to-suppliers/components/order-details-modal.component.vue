<script> import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Divider from 'primevue/divider';

export default {
  name: 'OrderDetailsModal',
  components: {'pv-dialog': Dialog, 'pv-button': Button, 'pv-card': Card, 'pv-divider': Divider},
  props: {visible: Boolean, order: Object, providerProfiles: Array},
  emits: ['close'],
  computed: {
    providerProfile() {
      return this.providerProfiles.find(p => p.id === this.order?.supplier_id);
    }, hasOrderBatches() {
      return Array.isArray(this.order?.orderBatches) && this.order.orderBatches.length > 0;
    }, formattedDate() {
      return this.order?.date ? new Date(this.order.date).toLocaleDateString() : '';
    }, formattedEstimatedDate() {
      return this.order?.estimated_ship_date ? new Date(this.order.estimated_ship_date).toLocaleDateString() : '';
    }, formattedEstimatedTime() {
      return this.order?.estimated_ship_time ? new Date(this.order.estimated_ship_time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }) : '';
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}; </script>
<template>
  <pv-dialog :visible="visible" modal header="Order Details" :style="{ width: '700px' }" @hide="close">
    <template #default>
      <div v-if="order"><h3>Order Information</h3>
        <div class="info-grid"><p><strong>State:</strong> {{ order.state?.name || 'N/A' }}</p>
          <p><strong>Situation:</strong> {{ order.situation?.name || 'N/A' }}</p>
          <p><strong>Order Creation Date:</strong> {{ formattedDate }}</p>
          <p><strong>Estimated Shipping Date:</strong> {{ formattedEstimatedDate }}</p>
          <p><strong>Estimated Shipping Hour:</strong> {{ formattedEstimatedTime }}</p>
          <p><strong>Total Price:</strong> S/. {{ Number(order.total_price).toFixed(2) }}</p>
          <p><strong>Requested Products:</strong> {{ order.requested_products_count || 'N/A' }}</p></div>
        <pv-divider/>

        <h3>Supplier</h3>
        <div v-if="providerProfile">
          <p><strong>Name:</strong> {{ providerProfile.name }} {{ providerProfile.lastName }}</p>
          <p><strong>Phone:</strong> {{ providerProfile.phone || 'N/A' }}</p>
          <p><strong>Address:</strong> {{ providerProfile.business_address || 'N/A' }}</p>
        </div>
        <div v-else>
          <p>No provider info found.</p>
        </div>

        <pv-divider/>

        <h3>Supplies</h3>
        <div v-if="hasOrderBatches">
          <div v-for="batch in order.orderBatches" :key="batch.id" class="supply-card">
            <h4>{{ batch.batch?.supply?.name || 'Unnamed Supply' }}</h4>
            <p><strong>Description:</strong> {{ batch.batch?.supply?.description || 'No description' }}</p>
            <p><strong>Category:</strong> {{ batch.batch?.supply?.category?.name || 'N/A' }}</p>
            <p><strong>Unit:</strong> {{ batch.batch?.supply?.unit_measurement?.name || 'N/A' }}</p>
            <p><strong>Price:</strong> S/. {{ Number(batch.batch?.supply?.price || 0).toFixed(2) }}</p>
            <p><strong>Requested Quantity:</strong> {{ batch.quantity }}</p>
            <p><strong>Accepted:</strong> {{ batch.accepted ? 'Yes' : 'No' }}</p>
            <pv-divider/>
          </div>
        </div>
        <div v-else>
          <p>No supplies found for this order.</p>
        </div>
      </div>
    </template>
    <template #footer>
      <pv-button label="Close" icon="pi pi-times" @click="close"/>
    </template>
  </pv-dialog>
</template>
<style scoped> .info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.supply-card {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #ccc;
} </style>