<script>

import {Profile} from "../model/profile.entity.js";
import PersonalDataSettings from "./personal-data-settings.component.vue";
import BusinessDataSettings from "./business-data-settings.component.vue";
import SecuritySettings from "./security-settings.component.vue";

export default {
  name: "profile-settings",
  components: {SecuritySettings, BusinessDataSettings, PersonalDataSettings},
  props: {
    profile: {
      type: [Object, null],
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    categoriesOptions: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      activeTab: 0,
    }
  },

  methods: {
    async onSaveChanges(profile) {
      this.$emit('profile-updated', profile)
    },

    onProfileAndBusinessChanges(business) {
      this.$emit('profile-and-business-updated', business)
    },

    onProfileAndUserChanges(user) {
      this.$emit('profile-and-user-updated', user)
    }
  },
  computed: {
    tabs() {
      return [
        {
          label: this.$t('profile.settings.personal-info')
        },
        {
          label: this.$t('profile.settings.business-info')
        },
        {
          label: this.$t('profile.settings.security-info')
        }
      ]
    }
  },
  emits: [
    'profile-updated',
    'profile-and-business-updated',
    'profile-and-user-updated'
  ]
}
</script>

<template>
  <div class="profile-settings-container">
    <div class="profile-settings-card">
      <div class="card-header">
        <h2 class="card-title">{{ $t('profile.settings.title') }}</h2>
      </div>
      <div class="card-content">
        <div class="tab-group">
          <div class="tab-headers">
            <button
                v-for="(tab, index) in tabs"
                :class="['tab-button', { active: activeTab === index }]"
                @click="activeTab = index"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="tab-content">
            <!-- Personal Data Tab -->
            <div v-if="activeTab === 0" class="tab-panel">
              <personal-data-settings
                  :profile="profile"
                  @profile-updated="onSaveChanges($event)"
              />
            </div>

            <!-- Business Data Tab -->
            <div v-if="activeTab === 1" class="tab-panel">
              <business-data-settings
                  :business="profile.business"
                  :current-categories="categories"
                  :categories-options="categoriesOptions"
                  @profile-and-business-updated="onProfileAndBusinessChanges"
              />
            </div>

            <!-- Security and Privacy Tab -->
            <div v-if="activeTab === 2" class="tab-panel">
              <security-settings
                  :user="profile.user"
                  @profile-and-user-updated="onProfileAndUserChanges"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-settings-card {
  height: auto;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 60vw;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
}

.card-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.card-content {
  flex: 1;
}

.tab-group {
  width: 100%;
}

.tab-headers {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 24px;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: #1976d2;
  background-color: rgba(25, 118, 210, 0.04);
}

.tab-button.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

.tab-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .profile-settings-card {
    max-width: 95vw;
    height: auto;
    min-height: 600px;
  }

  .tab-headers {
    flex-direction: column;
  }

  .tab-button {
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    border-right: none;
  }

  .tab-button.active {
    border-bottom-color: #e0e0e0;
    border-left: 3px solid #1976d2;
    background-color: rgba(25, 118, 210, 0.04);
  }
}
</style>