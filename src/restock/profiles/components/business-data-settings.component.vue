<script>
export default {
  name: "business-data-settings",
  props: {
    business: {
      type: Object,
      required: true
    },
    currentCategories: {
      type: Array,
      default: () => []
    },
    categoriesOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localBusiness: {
        name: '',
        address: '',
        categories: '',
        phone: '',
        email: ''
      },
      selectedCategories: []
    }
  },
  watch: {
    business: {
      handler(newBusiness) {
        if (newBusiness) {
          this.localBusiness = {
            name: newBusiness.name || '',
            address: newBusiness.address || '',
            categories: newBusiness.categories || '',
            phone: newBusiness.phone || '',
            email: newBusiness.email || ''
          };
        }
      },
      deep: true,
      immediate: true
    },
    currentCategories: {
      handler(newCategories) {
        this.selectedCategories = [...newCategories];
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    removeCategory(category) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    },
    onSaveChanges() {
      this.localBusiness.categories = this.selectedCategories.join(', ');

      const updatedBusiness = {
        id: this.business.id,
        name: this.localBusiness.name,
        address: this.localBusiness.address,
        categories: this.localBusiness.categories,
        phone: this.localBusiness.phone,
        email: this.localBusiness.email,
      };

      this.$emit('profile-and-business-updated', updatedBusiness);
    }
  }
}
</script>

<template>
  <div class="business-data-container">
    <div class="business-data-card">
      <div class="card-content">
        <div class="business-data-form">
          <!-- Business Name -->
          <label class="field-label">Business Name</label>
          <div class="form-field full-width">
            <input
                v-model="localBusiness.name"
                type="text"
                placeholder="Enter your business name"
                aria-label="Business Name"
                class="form-input"
            />
          </div>

          <!-- Business Address -->
          <label class="field-label">Business Address</label>
          <div class="form-field full-width">
            <input
                v-model="localBusiness.address"
                type="text"
                placeholder="Enter your business address"
                aria-label="Business Address"
                class="form-input"
            />
          </div>

          <!-- Business Phone -->
          <label class="field-label">Business Phone</label>
          <div class="form-field full-width">
            <input
                v-model="localBusiness.phone"
                type="text"
                placeholder="Enter your business phone"
                aria-label="Business Phone"
                class="form-input"
            />
          </div>

          <!-- Company Email -->
          <label class="field-label">Business Email</label>
          <div class="form-field full-width">
            <input
                v-model="localBusiness.email"
                type="text"
                placeholder="Enter your business email"
                aria-label="Business Email"
                class="form-input"
            />
          </div>

          <!-- Business Categories -->
          <label class="field-label">Business Categories</label>
          <div class="form-field full-width">
            <pv-multiselect
                v-model="selectedCategories"
                filter
                outline
                :options="categoriesOptions"
                placeholder="Select Categories"
                class="multiselect-container"
                aria-label="Business Categories"
            />
          </div>

          <!-- Category Chips -->
          <div class="category-chip-list">
            <div
                v-for="category in selectedCategories"
                :key="category"
                class="chip removable"
            >
              {{ category }}
              <button
                  @click="removeCategory(category)"
                  class="chip-remove-btn"
                  aria-label="Remove category"
              >
                <i class="material-icons">cancel</i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button
            @click="onSaveChanges"
            class="save-changes-button"
            aria-label="Save changes"
        >
          SAVE CHANGES
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.business-data-container {
  padding: 16px;
  box-sizing: border-box;
}

.business-data-card {
  padding: 16px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding-bottom: 16px;
}

.business-data-form {
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
  background-color: white !important;
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
  border-color: #2D5A34;
  box-shadow: 0 0 0 2px rgba(45, 90, 52, 0.1);
}

.form-select {
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  background-color: white;
}

.form-select:focus {
  border-color: #2D5A34;
  box-shadow: 0 0 0 2px rgba(45, 90, 52, 0.1);
}

.form-select option {
  padding: 8px;
  font-family: 'Inter', sans-serif;
}

.form-select option:checked {
  background-color: #2D5A34;
  color: white;
}

/* Custom multiselect styling */

.multiselect-container {
  width: 100%;
  background-color: white !important;
  border: 1px solid #ddd !important;
  border-radius: 4px !important;
}

:global(.p-multiselect-option,
.p-multiselect-label,
.p-multiselect-dropdown) {
  background-color: white !important;
  border-bottom: 1px solid #ddd !important;
  color: #333 !important;
}

:deep(.p-component, .p-multiselect-panel) {
  background-color: #a1a0a0 !important;
}

:global(.p-multiselect-header) {
  background-color: white !important;
  border-bottom: 1px solid #ddd !important;
}


.category-chip-list {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  margin-top: 16px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color:rgba(170, 179, 165, 0.38);
  color: #131313 !important;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.chip.removable {
  padding-right: 4px;
}

.chip-remove-btn {
  background: none;
  border: none;
  color: #635d5d;
  cursor: pointer;
  padding: 2px;
  margin-left: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.chip-remove-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chip-remove-btn .material-icons {
  font-size: 16px;
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
  background-color: #1A3B20 !important;
}

.save-changes-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(45, 90, 52, 0.3);
}
</style>