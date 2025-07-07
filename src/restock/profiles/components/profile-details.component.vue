<script>
export default {
  name: "profile-details",
  props: {
    profile: {
      type: [Object, null],
      default: () => ({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        avatar: '',
        business: {
          name: '',
          address: ''
        }
      })
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>
<template>
  <div class="profile-details-container">
    <div class="profile-details-card">
      <!-- Card Header -->
      <div class="card-header">
        <h3 class="card-title text">{{ $t('profile.title') }}</h3>
      </div>

      <!-- Profile Image -->
      <img
          :src="this.profile?.avatar"
          alt="$t('profile.altUserPhoto')"
          class="profile-photo"
      />

      <!-- Card Content -->
      <div class="card-content text">
        <div class="personal-details-form">
          <h4 class="name">{{ profile?.first_name || $t('profile.add-your-information') }} {{ profile?.last_name || '' }}</h4>

          <p class="info">
            <i class="pi pi-user icon"></i>
            {{ profile?.email || $t('profile.not-provided') }}
          </p>

          <!-- Phone -->
          <p class="info">
            <i class="pi pi-phone icon"></i>
            {{ profile?.phone || $t('profile.not-provided') }}
          </p>

          <!-- Address -->
          <p class="info">
            <i class="pi pi-map-marker icon"></i>
            {{ profile?.address || $t('profile.not-provided') }} - {{ profile?.country || $t('profile.not-provided') }}
          </p>

          <hr>

          <!-- Company Name -->
          <h5 class="subtitle">{{ $t('profile.business-name') }}:</h5>
          <p>{{ profile?.business?.name || $t('profile.not-provided') }}</p>

          <!-- Company Address -->
          <h5 class="subtitle">{{ $t('profile.business-address') }}:</h5>
          <p>{{ profile?.business?.address || $t('profile.not-provided') }}</p>

          <!-- Company Phone -->
          <h5 class="subtitle">{{ $t('profile.business-phone') }}:</h5>
          <p>{{ profile?.business?.phone || $t('profile.not-provided') }}</p>

          <!-- Company Email -->
          <h5 class="subtitle">{{ $t('profile.business-email') }}:</h5>
          <p>{{ profile?.business?.email || $t('profile.not-provided') }}</p>

          <h5 class="subtitle">{{ $t('profile.categories') }}:</h5>

          <div class="category-chip-list">
            <span
                v-for="category in categories? categories : []"
                :key="category"
                class="chip"
            >
              {{ category? category : $t('profile.not-provided') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.profile-details-container {
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
}

.profile-details-card {
  width: 100%;
  max-width: 100%;
  background-color: #FFFFFF;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

.card-header {
  padding-bottom: 16px;
}

.card-title {
  margin: 0;
  font-weight: 500;
}

.card-content {
  padding-top: 8px;
}

.profile-photo {
  width: 100%;
  max-width: 300px;
  padding: 16px;
  height: auto;
  border-radius: 50px;
  object-fit: cover;
}

.text {
  font-size: 3.5vw;
}

.name {
  margin: 16px 0 8px 0;
  font-weight: 600;
}

.info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.info .material-icons {
  font-size: 18px;
  color: #666;
}

.subtitle {
  margin: 16px 0 4px 0;
  font-weight: 500;
  color: #333;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e0e0e0;
}

/* Chips */
.category-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.chip {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(170, 179, 165, 0.38);
  color: #3c3a3a;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

/* Desktop layout */
@media (min-width: 768px) {
  .profile-details-card {
    max-width: 20vw;
  }

  .text {
    font-size: 0.9vw;
  }
}

@media (max-width: 768px) {
  .profile-details-card {
    max-width: 100%;
  }

  .text {
    font-size: 15px;
  }
}
</style>