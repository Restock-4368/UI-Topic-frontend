<script>
import SubscriptionCardsComponent from '../components/subscription-cards/subscription-cards.component.vue';

export default {
  name: 'subscription-overview',
  components: {
    SubscriptionCardsComponent
  },
  data() {
    return {
      subscriptions: [
        {
          "id": "1",
          "name": "Monthly plan",
          "duration": 1,
          "price": "59.99",
          "status": true,
          "popular": false,
          "features": [
            "Automated inventory management",
            "Ordering and purchasing control",
            "Reporting and analytics ",
            "Critical stock notifications",
            "Integration with suppliers"
          ],
          "rol_id": "1"
        },
        {
          "id": "2",
          "name": "Anual plan",
          "duration": 12,
          "price": "39.99",
          "status": true,
          "popular": true,
          "features": [
            "Gestión de inventario automatizado",
            "Control de pedidos y compras",
            "Reporte y analítica",
            "Notificaciones de stock crítico",
            "Integración con proveedores"
          ],
          "rol_id": "1"
        },
        {
          "id": "3",
          "name": "Semiannual Plan",
          "duration": 6,
          "price": "49.99",
          "status": true,
          "popular": false,
          "features": [
            "Automated inventory management",
            "Ordering and purchasing control",
            "Reporting and analytics",
            "Critical stock notifications",
            "Integration with suppliers"
          ],
          "rol_id": "1"
        }
      ],
    }
  },
  created() {
    console.log(" subscriptions: ", this.subscriptions);
  }
}
</script>

<template>
  <div class="plans-container px-4">
    <div class="plans-header mb-4">
      <h2>FLEXIBLE PLANS TO TAKE YOUR RESTAURANT MANAGEMENT</h2>
      <h3>TO THE NEXT LEVEL</h3>
    </div>

    <!-- componente hijo -->
    <SubscriptionCardsComponent :subscriptions="subscriptions" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400&display=swap');

.plans-container {
  text-align: center;
}

.plans-header h2,
.plans-header h3 {
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  font-size: 34px;
  text-transform: uppercase;
  margin: 0 20px 0 20px;
}

.plans-header h3 {
  margin-top: 7px;
}

.principal-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  object-fit: cover;
  margin-bottom: 32px;
}

@media (max-width: 1405px) {
  .plans-header h2,
  .plans-header h3 {
    font-size: 30px;
  }
}
</style>
