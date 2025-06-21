<script>
export default {
  name: 'sale-detail',
  props: {
    sale: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dishes: [],             // Aquí deberías llenar esto con un API si deseas
      additionalSupplies: []  
    };
  },
  methods: {
    closeComponent() {
      this.$emit('close');
    }
  },
  created() {
    this.dishes = this.sale.dishes || [];
    this.additionalSupplies = this.sale.additionalSupplies || [];
  }
};
</script>

<template>
  <!-- Modal backdrop -->
  <div class="modal-overlay" @click="closeComponent">
    <!-- Modal content -->
    <div class="modal-content modal-scrollable" @click.stop>
      
      <!-- Close button -->
      <button class="close-button" @click="closeComponent">
        <i class="pi pi-times" style="font-size: 1.5rem; color: #808D99; "></i>
      </button>

      <!-- Title -->
      <h2 class="title">{{ $t('sales_restaurant.sale_details.title') }} "{{ sale.code }}"</h2>

      <div class="content">
        <p class="sub-text">{{ $t('sales_restaurant.sale_details.name_customer') }}: {{ sale.diner_name || '' }}</p>
        <p class="sub-text">{{ $t('sales_restaurant.sale_details.number_dishes') }}: {{ sale.recipeCount || 0 }}</p>
        <p class="sub-text">{{ $t('sales_restaurant.sale_details.number_additional_supplies') }}: {{ sale.additionalSupplyCount || 0 }}</p>

        <hr />

        <!-- Dishes table -->
        <div class="dishes">
          <h3 class="subtitle2">{{ $t('sales_restaurant.sale_details.dishes') }}</h3>
          <table v-if="this.dishes.length >0" class="custom-table">
            <thead>
              <tr>
                <th>{{ $t('sales_restaurant.sale_details.name') }}</th>
                <th>{{ $t('sales_restaurant.sale_details.unit_price') }}</th>
                <th>{{ $t('sales_restaurant.sale_details.quantity') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dish,index) in dishes" :key="index">
                <td>{{ dish.name }}</td>
                <td>S/ {{ dish.unitPrice }}</td>
                <td>{{ dish.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <p class="no-dishes" v-if="this.dishes.length == 0">No dishes selected</p>
        </div>

        <!-- Additional supplies table -->
        <div class="additionalSupplies">
          <h3 class="subtitle2">{{ $t('sales_restaurant.sale_details.additional_supplies') }}</h3>
          <table v-if="this.additionalSupplies.length >0" class="custom-table">
            <thead>
              <tr>
                <th>{{ $t('sales_restaurant.sale_details.name') }}</th>
                <th>{{ $t('sales_restaurant.sale_details.unit_price') }}</th>
                <th>{{ $t('sales_restaurant.sale_details.quantity') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="supply in additionalSupplies" :key="supply.id">
                <td>{{ supply.name }}</td>
                <td>S/ {{ supply.unitPrice }}</td>
                <td>{{ supply.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <p class="no-additionalSupplies" v-if="this.additionalSupplies.length == 0">No additional Supplies selected</p>

        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.no-dishes, .no-additionalSupplies {
  color: #808D99;
}
.subtitle2 {
  font-weight: 400;
} 
.custom-table {
          border: 1px solid #ccc;

  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.custom-table th,
.custom-table td {
  padding: 8px 12px;
  text-align: left;
  font-family: Inter;
  font-size: 14px;
}

.custom-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    /* fondo oscuro opaco */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    min-height: 80vh;
    max-height: 80vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.content {
    margin-top: 1rem;
    margin-bottom: 2rem;
}

.dishes {
    margin-top: 1rem;
}

.additionalSupplies {
    margin-top: 2.6rem;
}

.close-button {
    background-color: white;
    position: absolute;
    top: 20px;
    right: 23px;
    z-index: 2;
}

.title {
    text-align: center;
    padding-top: px;
    font-weight: 800;
}

.sub-text {
    font-family: Inter;
    font-weight: 400;
    font-size: 18px;
    color: black;
    margin-bottom: 1rem;
}

.no-dishes-additonalsupplies-selected {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    padding-left: 8rem;
    padding-right: 8rem;
    text-align: center;
    font-family: Poppins;
    font-size: 20px;
    font-weight: 400;
    color: #808D99;
}

.modal-scrollable {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    padding-top: 18px;
    box-sizing: border-box;
}


.full-width {
    width: 100%;
    margin-bottom: 16px;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin-bottom: 1rem;
    margin-top: 2rem;
}

.button-cancel {
    border-radius: 6px;
    background-color: #D9534F;
    color: white;
}

.button-register {
    border-radius: 6px;
    background-color: #4F8A5B;
    color: white;
}

mat-table {
    background-color: white;
}

.quantity {
    margin-top: 1.2rem;
}

.actions {
    display: flex;
    justify-content: center;
    align-items: center;
}

.mat-elevation-z2 {
    margin-bottom: 1.5rem;
}
</style>