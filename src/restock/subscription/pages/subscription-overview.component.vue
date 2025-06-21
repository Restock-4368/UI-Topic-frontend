<script>
import { mockUser } from '../../../shared/mocks/user.mock.js';
import SubscriptionCardsComponent from '../components/subscription-cards/subscription-cards.component.vue';
import {SubscriptionService} from '../services/subscription.service.js';
export default {
  name: 'subscription-overview',
  components: {
    SubscriptionCardsComponent
  },
  data() {
    return {
      subscriptions: [], //subscripciones
      user: mockUser,

    }
  },
  methods: {
   getAllSubscriptions() {
      this.subscriptionService.getAll()
        .then(response => {
          console.log('Subscriptions fetched successfully:', response);
          this.subscriptions = response.data.filter(
            s => s.rol_id === String(this.user.role_id.id)
          );
          console.log('Filtered subscriptions:', this.subscriptions);
        })
        .catch(error => {
          console.error('Error fetching subscriptions:', error);
        });
    }
  },
  created() {
    this.subscriptionService = new SubscriptionService();
    this.getAllSubscriptions();
  }
}
</script>

<template>
  <div class="plans-container px-4">
    <div class="plans-header mb-4">
      <h2>{{ $t('subscription.title1') }}</h2>
      <h3>{{ $t('subscription.title2') }}</h3>
    </div>

    <!-- componente hijo -->
    <SubscriptionCardsComponent :subscriptions="subscriptions" />
  </div>
</template>

<style>
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
