<script>
import BaseModal from "../../../../shared/components/base-modal.component.vue";
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import {OrderToSupplierService} from "../services/order-to-supplier.service.js";
import {OrderToSupplierSupplyService} from "../services/order-to-supplier-supply.service.js";

export default {
  name: 'ConfirmOrderToSupplierModal',
  components: {BaseModal, 'pv-input-number': InputNumber, 'pv-button': Button},
  props: {
    modelValue: Boolean,
    supply: Object,
    selectedSuppliers: Array,
  },
  emits: ['update:modelValue', 'close', 'submitted'],
  data() {
    return {
      supplierQuantities: {}, // { supplierId: quantity }
    };
  },
  computed: {
    totalPrice() {
      return this.selectedSuppliers.reduce((sum, s) => {
        const qty = this.supplierQuantities[s.id] || 0;
        return sum + (qty * s.price);
      }, 0);
    },
    totalItems() {
      return Object.values(this.supplierQuantities).reduce((a, b) => a + b, 0);
    }
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },
    async submitOrder() {
      try {
        const orderService = new OrderToSupplierService();
        const supplyService = new OrderToSupplierSupplyService();

        const now = new Date();
        const description = `Order of ${this.supply.name}`;

        for (const supplier of this.selectedSuppliers) {
          const quantity = this.supplierQuantities[supplier.id];
          if (!quantity || quantity <= 0) continue;

          // 1. Crear orden base
          const orderPayload = {
            date: now.toISOString(),
            estimated_ship_date: now.toISOString(),
            estimated_ship_time: now.toISOString(),
            description,
            admin_restaurant_id: 4, // dinámico luego
            supplier_id: supplier.id,
            order_to_supplier_state_id: 1,      // On Hold
            order_to_supplier_situation_id: 1,  // Pending
            requested_products_count: quantity,
            total_price: quantity * supplier.price,
            partially_accepted: false
          };
          const orderRes = await orderService.create(orderPayload);
          const orderId = orderRes.data.id;

          // 2. Crear relación supply
          await supplyService.create({
            order_to_supplier_id: orderId,
            supply_id: this.supply.id,
            quantity,
            accepted: false
          });
        }

        this.$toast.add({
          severity: 'success',
          summary: 'Order created!',
          detail: 'Your order has been successfully submitted.',
          life: 3000
        });

        this.$emit('submitted');
        this.close();
      } catch (err) {
        console.error("Error submitting order:", err);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'There was a problem creating the order.',
          life: 3000
        });
      }
    }
  }
};
</script>

<template>
  <base-modal :model-value="modelValue" title="Confirm Order Details" @close="close">
    <template #default>
      <p><strong>Supply:</strong> {{ supply?.name }}</p>
      <p><strong>Description:</strong></p><p class="supply-description">{{ supply?.description }}</p>

      <div v-for="supplier in selectedSuppliers" :key="supplier.id" class="supplier-block">
        <p><strong>{{ supplier.name }}</strong> (Stock: {{ supplier.stock }}, Price: S/{{ supplier.price }})</p>
        <pv-input-number
            v-model="supplierQuantities[supplier.id]"
            :max="supplier.stock"
            :min="0"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            inputClass="quantity-input"
        />

      </div>
      <hr/>
      <p><strong>Total Units:</strong> {{ totalItems }}</p>
      <p><strong>Total Price:</strong> S/ {{ totalPrice.toFixed(2) }}</p>
    </template>

    <template #footer>
      <pv-button label="Cancel" class="btn-close" @click="close"/>
      <pv-button label="Submit Order" class="btn-confirm" @click="submitOrder"/>
    </template>
  </base-modal>
</template>

<style scoped>
.supplier-block {
  margin-bottom: 1rem;
}

.quantity-input {
  width: 120px;
}

.btn-close {
  background-color: #ccc;
}

.btn-confirm {
  background-color: #4F8A5B;
  color: white;
}

.p-inputnumber .p-inputtext {
  text-align: center;
  font-size: 1rem;
  height: 2rem;
  width: 5rem;
}

</style>
