<script>
export default {
  name: "personal-data-settings",
  props: {
    profile: {
      type: [Object, null],
      required: true,
    }
  },
  data() {
    return {
      localProfile: {
        name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        avatar: '',
        business: null
      }
    }
  },
  watch: {
    profile: {
      handler(newProfile) {
        if (newProfile) {
          this.localProfile = {
            ...newProfile
          };
        }
      },
      deep: true,
      immediate: true
    }
  },
  emits: ['profile-updated'],
  methods: {
    async onSaveChanges() {
      console.log('Saving changes:', this.localProfile);
      this.$emit('profile-updated', this.localProfile);
    }
  }
}
</script>
<template>
  <div class="personal-data-container">
    <div class="personal-data-card">
      <div class="card-content">
        <div class="personal-data-form">
          <!-- Name -->
          <label class="field-label">{{ $t('profile.name') }}</label>
          <div class="form-field full-width">
            <input
                v-model="localProfile.name"
                type="text"
                placeholder="Enter your name"
                aria-label="Name"
                class="form-input"
            />
          </div>

          <!-- Last Name -->
          <label class="field-label">{{ $t('profile.last-name') }}</label>
          <div class="form-field full-width">
            <input
                v-model="localProfile.last_name"
                type="text"
                placeholder="Enter your last name"
                aria-label="Last Name"
                class="form-input"
            />
          </div>

          <!-- Email -->
          <label class="field-label">{{ $t('profile.email') }}</label>
          <div class="form-field full-width">
            <input
                v-model="localProfile.email"
                type="email"
                placeholder="Enter your email"
                aria-label="Email"
                class="form-input"
            />
          </div>

          <!-- Phone -->
          <label class="field-label">{{ $t('profile.phone') }}</label>
          <div class="form-field full-width">
            <input
                v-model="localProfile.phone"
                type="text"
                placeholder="Enter your phone"
                aria-label="Phone"
                class="form-input"
            />
          </div>

          <!-- Address -->
          <label class="field-label">{{ $t('profile.address') }}</label>
          <div class="form-field full-width">
            <input
                v-model="localProfile.address"
                type="text"
                placeholder="Enter your address"
                aria-label="Address"
                class="form-input"
            />
          </div>

          <!-- Country -->
          <label class="field-label">{{ $t('profile.country') }}</label>
          <div class="form-field full-width">
            <input
                v-model="localProfile.country"
                type="text"
                placeholder="Enter your country"
                aria-label="Country"
                class="form-input"
            />
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button
            @click="onSaveChanges"
            class="save-changes-button"
            aria-label="Save changes"
        >
          {{ $t('profile.settings.save-changes') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.personal-data-container {
  padding: 16px;
  box-sizing: border-box;
}

.personal-data-card {
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding-bottom: 16px;
}

.personal-data-form {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
}

.full-width {
  width: 100%;
  margin: 10px auto 0;
}

.field-label {
  display: block;
  color: #808D99;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  margin-bottom: 4px;
  margin-top: 16px;
}

.field-label:first-child {
  margin-top: 0;
}

.form-field {
  position: relative;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #4F8A5B;
  box-shadow: 0 0 0 2px rgba(79, 138, 91, 0.1);
}

.form-input::placeholder {
  color: #999;
}

.card-actions {
  padding-top: 16px;
}

.save-changes-button {
  background-color: #4F8A5B !important;
  color: white !important;
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 3px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  margin: 2.4rem 0.6rem 2rem 0.6rem;
  cursor: pointer;
  transition: background-color 500ms ease, color 500ms ease;
}

.save-changes-button:hover {
  background-color: rgb(26, 104, 60) !important;
}

.save-changes-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 138, 91, 0.3);
}
</style>