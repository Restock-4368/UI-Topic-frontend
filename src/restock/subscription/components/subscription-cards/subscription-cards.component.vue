<script>
export default {
  name: 'subscription-cards',
  props: {
    subscriptions: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    console.log(" subscriptions: ", this.subscriptions);
  }
};
</script>

<template>
  <div class="flex flex-wrap justify-content-center gap-5 mt-6 plans-grid">
    <pv-card
      v-for="subscription in subscriptions"
      :key="subscription.name"
      class="plan-card"
      :pt="{ root: { class: subscription.popular ? 'highlight-card' : '' } }"
    >
      <template #header>
        <div v-if="subscription.popular" class="popular-label">POPULAR</div>
        <div class="mat-card-header flex flex-column align-items-center justify-content-center">
          <div class="mat-card-title text-3xl text-green-700 font-normal">
            {{ subscription.name }}
          </div>
          <div class="mat-card-subtitle text-xl text-900 font-normal mt-3">
            S/. {{ subscription.price }} / month
          </div>
        </div>
      </template>

      <template #content>
        <div class="content">
          <ul class="features-list mt-5">
            <li v-for="feature in subscription.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
        </div>
      
      </template>

      <template #footer>
        <pv-button label="SUBSCRIBE" class="subscribe-button" />
      </template>
    </pv-card>
  </div>
</template>

<style scoped>
.plans-grid {
  margin-top: 60px;
}

/* CARD */
.plan-card {
  text-align: center;
  background-color: white;
  position: relative;
  overflow: hidden;
  width: 30%;
  height: 450px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* HEADER STYLES */
.mat-card-header {
  padding: 1.3rem 0 0 0;
}

.mat-card-title {
  font-size: 34px;
  font-weight: 400;
  color: #4F8A5B;
}

.mat-card-subtitle {
  font-size: 23px;
  font-weight: 400;
  color: #333;
}

/* FEATURES LIST */
.features-list {
  padding: 0;
  list-style: none;
  text-align: left;
}

.features-list li {
  margin-top: 0.5rem;
  list-style: none;
  position: relative;
  padding-left: 24px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: #000;
}

.features-list li::before {
  content: '✔';
  position: absolute;
  left: 0;
  color: #4F8A5B;
  font-weight: bold;
}

/* SUBSCRIBE BUTTON */
.subscribe-button {
  background-color: #4F8A5B !important;
  color: white !important;
  margin-top: 2rem;
  width: 100%;
  height: 50%;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 500;
  margin: 1rem 0rem 2rem 0rem;
  transition: background-color 500ms ease, color 500ms ease;
}

.subscribe-button:hover {
  background-color: rgb(26, 104, 60) !important;
}

/* POPULAR LABEL */
.popular-label {
  position: absolute;
  top: 12px;
  right: -40px;
  background-color: #4F8A5B;
  color: white;
  font-size: 11px;
  padding: 4px 40px;
  transform: rotate(45deg);
  font-weight: bold;
  z-index: 2;
}

/* HIGHLIGHTED CARD */
.highlight-card {
  background-color: #F4F4F4;
  margin-top: -30px;
  z-index: 1;
  position: relative;
}

/* RESPONSIVE */
@media (max-width: 1405px) {
  .plans-grid {
    flex-direction: column;
    align-items: center;
  }

  .plan-card {
    width: 70%;
    height: auto;
    margin-bottom: 2rem;
  }

  .highlight-card {
    margin-top: 0;
  }

  .features-list li {
    font-size: 17px;
    padding-left: 28px;
    line-height: 1.6;
  }

  .subscribe-button {
    height: 60px;
    font-size: 16px;
  }

  .content {
    display: flex;
    justify-items: center;
    justify-content: center;
  }
}
</style>