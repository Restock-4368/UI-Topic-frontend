<script>
import { UserService } from '../../../iam/services/user.service';
import { ProfileService } from '../../../profiles/services/profile.service';
import { OrderToSupplierSituationService } from '../../../resource/orders-to-suppliers/services/order-to-supplier-situation.service';
import { OrderToSupplierService } from '../../../resource/orders-to-suppliers/services/order-to-supplier.service';

export default {
  name: 'NotificationSuppliersTable',
  data() {
    return {
        notificationsData: [],
        user: {
            "id": 1,
            "email": "pepe@gmail.com",
            "password": "password123",
            "role_id": 1, //1: supplier, 2: restaurant
            "subscription_id": 1,
            "start_date": "2023-01-01",
            "subscription_payment_details_id": 1
        }
    }
  },
 methods: {
  async getAllOrdersOfSupplierID() {
    try {
      const orders = await this.orderToSupplierService.getByQuery("supplier_id", this.user.id);
      const enrichedOrders = await Promise.all(
        orders.data.map(async order => {
          try {
            const userArr = await this.userService.getByQuery("id", order.admin_restaurant_id);
            const user = userArr.data[0];
            if (!user) return null;

            const [situation, profile] = await Promise.all([
              this.orderToSupplierSituationService.getByQuery("id", order.order_to_supplier_situation_id),
              this.profileService.getByQuery("user_id", user.id)
            ]);

          const orderDate = new Date(order.date ?? '');
const now = new Date();
const diffMs = now.getTime() - orderDate.getTime();
const diffMins = Math.floor(diffMs / (1000 * 60));

let elapsedTime = '';

if (diffMins < 60) {
  elapsedTime = `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
} else if (diffMins < 1440) { // menos de 24 horas
  const hours = Math.floor(diffMins / 60);
  elapsedTime = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
} else if (diffMins < 43200) { // menos de 30 días
  const days = Math.floor(diffMins / 1440);
  elapsedTime = `${days} day${days !== 1 ? 's' : ''} ago`;
} else if (diffMins < 525600) { // menos de 12 meses
  const months = Math.floor(diffMins / 43200);
  elapsedTime = `${months} month${months !== 1 ? 's' : ''} ago`;
} else {
  const years = Math.floor(diffMins / 525600);
  elapsedTime = `${years} year${years !== 1 ? 's' : ''} ago`;
}
            return {
              id: order.id,
              date: order.date,
              elapsedTime,
              total_price: order.total_price,
              situation: situation.data[0]?.name || 'Unknown',
              restaurant: profile.data[0]?.business_name || 'Unknown'
            };
          } catch (innerError) {
            console.warn(`❌ Error enriqueciendo orden ID ${order.id}`, innerError);
            return null;
          }
        })
      );

      this.notificationsData = enrichedOrders.filter(order => order !== null);

    } catch (error) {
      console.error('❌ Error al obtener órdenes del proveedor:', error);
    }
  }
},
  created() {
    this.orderToSupplierService = new OrderToSupplierService();
    this.orderToSupplierSituationService = new OrderToSupplierSituationService();
    this.profileService = new ProfileService();
    this.userService = new UserService();
    this.getAllOrdersOfSupplierID();
  }
}
</script>

<template> 
  <div class="table-container">
    <div class="header">
      <h2>{{ $t('notifications_suppliers.title') }}</h2>
    </div>

    <table class="custom-table">
      <thead>
        <tr>
          <th>{{ $t('notifications_suppliers.restaurant') }}</th>
          <th>{{ $t('notifications_suppliers.evaluate') }}</th>
          <th>{{ $t('notifications_suppliers.situation') }}</th>
          <th>{{ $t('notifications_suppliers.last-update') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(alert, index) in notificationsData" :key="index">
          <td>{{ alert.restaurant }}</td>
          <td><i class="pi pi-book" /></td>
          <td><button class="status-button">{{ alert.situation }}</button></td>
          <td>{{ alert.elapsedTime }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<style scoped>
.table-container {
  padding: 2rem;
  padding-top: 0;
  border-radius: 10px;
}

.header h2 {
  margin-bottom: 1rem;
  color: #333;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.custom-table th {
  background-color: #e0e0e0;
  color: #333;
  font-weight: 600;
  padding: 14px;
  text-align: center;
}

.custom-table td {
  background-color: #fafafa;
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  color: #555;
}

.custom-table tr:hover {
  background-color: #f9f9f9;
}

.custom-table i {
  font-size: 1.3rem;
  color: #4F8A5B;
}

.status-button {
  padding: 6px 12px;
  background-color: #4F8A5B;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: default;
  font-size: 14px;
}
</style>
