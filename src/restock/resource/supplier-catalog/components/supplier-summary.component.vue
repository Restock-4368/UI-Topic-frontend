<script setup> import {useRouter} from 'vue-router'
import {defineProps} from 'vue'
import {addRestaurantContact} from '../services/restaurant-contact.service.js'

const router = useRouter()
const props = defineProps({supplier: {type: Object, required: true}})
const RESTAURANT_ID = 1

async function addSupplier() {
  try {
    const exists = await checkIfContactExists(RESTAURANT_ID, props.supplier.id)
    if (exists) {
      console.log('Supplier already added.')
      return
    }
    await addRestaurantContact(props.supplier.id)
    await router.push('/dashboard/restaurant/suppliers?added=true')
  } catch (error) {
    console.error('Error adding supplier:', error)
  }
  console.log('Trying to add supplier ID:', props.supplier.id)
}

function contactSupplier() {
  const phone = props.supplier.phone?.replace(/\D/g, '')
  if (phone) {
    window.open(`https://wa.me/${phone}`, '_blank')
  }
}

async function checkIfContactExists(restaurantId, supplierId) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const contactsPath = import.meta.env.VITE_RESTAURANT_CONTACTS_ENDPOINT_PATH
  const response = await fetch(`${baseUrl}${contactsPath}?restaurant_id=${restaurantId}&supplier_contact_id=${supplierId}`)
  const data = await response.json()
  return data.length > 0
}
</script>
<template><h3 class="mobile-subtitle">Suppliers</h3>
  <div class="summary-container">
    <div class="image-column"><h4>{{ supplier.name }}</h4> <img src="/src/assets/images/general_profile_supplier.png"
                                                                alt="Supplier image"/></div>
    <div class="info-column">
      <p>Name: {{ supplier.name }}</p>
      <p>Email: {{ supplier.email }}</p>
      <p>Phone: {{ supplier.phone }}</p>
      <p>Address: {{ supplier.address }}</p>
      <p>Business: {{ supplier.business_name }}</p>
    </div>

    <div class="column action-column">
      <pv-button label="ADD" icon="pi pi-plus-circle" class="summary-btn" @click="addSupplier"/>
      <br/>
      <pv-button label="CONTACT" icon="pi pi-phone" class="summary-btn" @click="contactSupplier"/>
    </div>
  </div>
</template>
<style scoped> .summary-container {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  background: #fff;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
  box-shadow: 1px 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 30px;
  padding: 20px 0;
}

.mobile-subtitle {
  display: none;
  font-size: 22px;
  font-weight: 500;
  margin: 1rem 0;
  padding-left: 1rem;
}

.info-column {
  text-align: center;
}

.image-column h4 {
  margin-top: 0;
}

.image-column img {
  width: 150px;
  height: auto;
  border-radius: 12px;
}

.summary-btn {
  background-color: #4F8A5B !important;
  color: white !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
}

.action-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 1260px) {
  .summary-container {
    flex-direction: column;
    align-items: center;
    text-align: left;
  }

  .mobile-subtitle {
    margin-top: 3rem;
    display: block;
  }

  .info-column {
    width: 90%;
    text-align: left;
    font-size: 14px;
  }

  .action-column {
    order: 3;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-column {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    margin-bottom: -90px;
  }

  h4 {
    padding-top: 20px;
  }

  img {
    width: 35%;
  }
}
</style>