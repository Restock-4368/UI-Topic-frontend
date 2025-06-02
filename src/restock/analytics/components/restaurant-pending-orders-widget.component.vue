<script> export default {
  name: 'RestaurantPendingOrdersWidget', data() {
    return {
      orders: [],
      displayedColumns: ['supplier', 'supply', 'quantity', 'unit', 'finalPrice', 'state'],
      mobileColumns: ['supplier', 'state', 'finalPrice'],
      isMobile: false
    };
  }, computed: {
    columnsToShow() {
      return this.isMobile ? this.mobileColumns : this.displayedColumns;
    }, approvedOrders() {
      return this.orders.filter(order => order.situation === 'approved');
    }
  }, mounted() {
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport);
    this.loadMockOrders();
  }, beforeUnmount() {
    window.removeEventListener('resize', this.checkViewport);
  }, methods: {
    checkViewport() {
      this.isMobile = window.innerWidth <= 768;
    }, loadMockOrders() {
      this.orders = [{
        supplier: 'Alimentos S.A.',
        supply: 'Atún',
        quantity: 15,
        unit: 'kg',
        finalPrice: 124.50,
        state: 'On hold',
        situation: 'approved'
      }, {
        supplier: 'Bebidas SRL',
        supply: 'Papa amarilla',
        quantity: 30,
        unit: 'kg',
        finalPrice: 50.30,
        state: 'Preparing',
        situation: 'approved'
      }, {
        supplier: 'Alimentos y Bebidas',
        supply: 'Arroz',
        quantity: 24,
        unit: 'kg',
        finalPrice: 67,
        state: 'On the way',
        situation: 'approved'
      }, {
        supplier: 'Bebidas SRL',
        supply: 'Papa amarilla',
        quantity: 30,
        unit: 'kg',
        finalPrice: 50.30,
        state: 'Delivered',
        situation: 'approved'
      },{
        supplier: 'Bebidas SRL',
        supply: 'Papa amarilla',
        quantity: 30,
        unit: 'kg',
        finalPrice: 50.30,
        state: 'Delivered',
        situation: 'declined'
      }];
    }
  }
}
</script>
<template>

  <div><h3 class="widget-title">Pending Orders</h3>
    <div class="widget-container">
      <div class="scroll-wrapper" :style="{ overflowY: approvedOrders.length > 3 ? 'auto' : 'visible' }">
        <pv-data-table :value="approvedOrders" responsiveLayout="scroll" class="orders-table">
          <pv-column v-if="columnsToShow.includes('supplier')" field="supplier" header="Supplier"/>
          <pv-column v-if="columnsToShow.includes('supply')" field="supply" header="Supply"/>
          <pv-column v-if="columnsToShow.includes('quantity')" field="quantity" header="Quantity"/>
          <pv-column v-if="columnsToShow.includes('unit')" field="unit" header="Unit"/>
          <pv-column v-if="columnsToShow.includes('finalPrice')" header="Final price">
            <template #body="slotProps"><span>S/ {{ slotProps.data.finalPrice.toFixed(2) }}</span></template>
          </pv-column>
          <pv-column v-if="columnsToShow.includes('state')" field="state" header="Status"/>
        </pv-data-table>
      </div>
    </div>
  </div>
</template>
<style >
.widget-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 10px;
}

.widget-container {
  background: #fff;
  padding: 20px 24px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  min-height: 300px;
  overflow: hidden;
}

.scroll-wrapper {
  max-height: 300px;
  overflow-y: auto;
}

.p-datatable thead th {
  font-size: 13px;
  font-weight: 600;
  color: #757575 !important;
  padding: 10px;
  border-bottom: 1px solid #E0E0E0;
  justify-content: center;
}

.p-datatable tbody td {
  font-size: 13px;
  color: #333;
  padding: 10px;
  border-bottom: 1px solid #E0E0E0 !important;
} </style>