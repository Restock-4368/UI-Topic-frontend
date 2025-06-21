<script>
export default {
  name: "security-settings",
  props: {
    user: {
      type: Object,
      default: () => ({
        id: null,
        username: '',
        password: '',
        email: ''
      })
    }
  },
  data() {
    return {
      hideCurrentPassword: true,
      hideNewPassword: true,
      hideNewPasswordConfirm: true,
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      showSnackbar: false,
      snackbarMessage: '',
      snackbarType: 'error'
    }
  },
  methods: {
    onSaveChanges() {
      if (this.currentPassword !== this.user.password) {
        this.invalidUpdate('The current password is incorrect');
        return;
      }

      if (this.newPassword !== this.newPasswordConfirm) {
        this.invalidUpdate('The new passwords did not match');
        return;
      }

      if (this.newPassword === this.currentPassword) {
        this.invalidUpdate('The new password cannot be the same as the current password');
        return;
      }

      const updatedUser = {
        ...this.user,
        password: this.newPassword
      };

      this.$emit('profile-and-user-updated', updatedUser);

      // Clear form after successful update
      this.currentPassword = '';
      this.newPassword = '';
      this.newPasswordConfirm = '';

    },
    invalidUpdate(message) {
      this.snackbarMessage = message;
      this.snackbarType = 'error';
      this.showSnackbar = true;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.showSnackbar = false;
      }, 3000);
    },
    showSuccessMessage(message) {
      this.snackbarMessage = message;
      this.snackbarType = 'success';
      this.showSnackbar = true;

      // Auto-hide after 3 seconds
      setTimeout(() => {
        this.showSnackbar = false;
      }, 3000);
    },
    closeSnackbar() {
      this.showSnackbar = false;
    }
  }
}
</script>
<template>
  <div class="security-container">
    <!-- Change password section -->
    <div class="security-card">
      <div class="card-header">
        <h3 class="card-title">{{ $t('profile.settings.change-password') }}</h3>
      </div>

      <div class="card-content">
        <div class="content-container">
          <!-- Current password -->
          <label class="field-label">{{ $t('profile.settings.current-password') }}</label>
          <div class="form-field full-width">
            <div class="password-field">
              <input
                  v-model="currentPassword"
                  :type="hideCurrentPassword ? 'password' : 'text'"
                  :placeholder="$t('profile.settings.current-password-placeholder')"
                  aria-label="Current password"
                  class="form-input"
              />
              <button
                  @click="hideCurrentPassword = !hideCurrentPassword"
                  :aria-label="hideCurrentPassword ? 'Show current password' : 'Hide current password'"
                  :aria-pressed="!hideCurrentPassword"
                  class="hide-button"
                  type="button"
              >
                <i class="material-icons">{{ hideCurrentPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
          </div>

          <!-- New password -->
          <label class="field-label">{{ $t('profile.settings.new-password') }}</label>
          <div class="form-field full-width">
            <div class="password-field">
              <input
                  v-model="newPassword"
                  :type="hideNewPassword ? 'password' : 'text'"
                  :placeholder="$t('profile.settings.new-password-placeholder')"
                  aria-label="New password"
                  class="form-input"
              />
              <button
                  @click="hideNewPassword = !hideNewPassword"
                  :aria-label="hideNewPassword ? 'Show new password' : 'Hide new password'"
                  :aria-pressed="!hideNewPassword"
                  class="hide-button"
                  type="button"
              >
                <i class="material-icons">{{ hideNewPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
          </div>

          <!-- Confirm new password -->
          <label class="field-label">{{ $t('profile.settings.confirm-password') }}</label>
          <div class="form-field full-width">
            <div class="password-field">
              <input
                  v-model="newPasswordConfirm"
                  :type="hideNewPasswordConfirm ? 'password' : 'text'"
                  :placeholder="$t('profile.settings.confirm-password-placeholder')"
                  aria-label="Confirm new password"
                  class="form-input"
              />
              <button
                  @click="hideNewPasswordConfirm = !hideNewPasswordConfirm"
                  :aria-label="hideNewPasswordConfirm ? 'Show confirm password' : 'Hide confirm password'"
                  :aria-pressed="!hideNewPasswordConfirm"
                  class="hide-button"
                  type="button"
              >
                <i class="material-icons">{{ hideNewPasswordConfirm ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button
            @click="onSaveChanges"
            class="save-changes-button"
            aria-label="Save password changes"
        >
          {{ $t('profile.settings.save-changes') }}
        </button>
      </div>
    </div>

    <!-- Delete account section -->
    <div class="security-card">
      <div class="card-header">
        <h3 class="card-title">{{ $t('profile.settings.delete-account') }}</h3>
      </div>

      <div class="card-content">
        <div class="content-container">
          <p>{{ $t('profile.settings.delete-account-warning') }}</p>
        </div>
      </div>

      <div class="card-actions">
        <button class="delete-button">{{ $t('profile.settings.confirm-delete') }}</button>
      </div>
    </div>

    <!-- Snackbar/Toast notification -->
    <div v-if="showSnackbar" :class="['snackbar', snackbarType]">
      <span>{{ snackbarMessage }}</span>
      <button @click="closeSnackbar" class="snackbar-close">✕</button>
    </div>
  </div>
</template>


<style scoped>
/* Import Material Icons and Inter Font */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.security-container {
  padding: 16px;
  box-sizing: border-box;
}

.security-card {
  border-radius: 0px;
  padding: 0 16px 0;
  background-color: #FFFFFF;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 16px 0;
}

.card-title {
  margin: 0 0 20px 0;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
}

.card-content {
  padding-bottom: 16px;
}

.card-actions {
  padding: 16px 0;
}

.full-width {
  width: 100%;
  margin: 10px auto 0;
}

.content-container {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
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

.password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 12px 50px 12px 16px;
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

.hide-button {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: #323030 !important;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  transition: background-color 0.2s ease;
}

.hide-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.hide-button .material-icons {
  font-size: 20px;
}

button {
  color: white !important;
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 3px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 500ms ease, color 500ms ease;
}

.save-changes-button {
  background-color: #4F8A5B !important;
}

.save-changes-button:hover {
  background-color: rgb(26, 104, 60) !important;
}

.delete-button {
  background-color: #D9534F !important;
}

.delete-button:hover {
  background-color: rgb(140, 35, 35) !important;
}

.save-changes-button:focus,
.delete-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}

/* Snackbar styles */
.snackbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  min-width: 300px;
  animation: slideUp 0.3s ease;
}

.snackbar.error {
  background-color: #d32f2f;
}

.snackbar.success {
  background-color: #2e7d32;
}

.snackbar-close {
  background: none !important;
  border: none !important;
  color: white !important;
  cursor: pointer;
  font-size: 16px;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  padding: 0 !important;
}

@keyframes slideUp {
  from {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

/* Content container paragraph styling */
.content-container p {
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
  color: #666;
}
</style>