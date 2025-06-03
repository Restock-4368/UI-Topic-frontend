import { getAllSuppliers } from './supplier.service.js'
import { getActiveRestaurantId } from "./user-context.service.js";

const API_URL = import.meta.env.VITE_API_BASE_URL
const CONTACTS_PATH = import.meta.env.VITE_RESTAURANT_CONTACTS_ENDPOINT_PATH

export async function getRestaurantSuppliers() {
    try {
        const restaurantId = getActiveRestaurantId()
        const contactRes = await fetch(`${API_URL}${CONTACTS_PATH}?restaurant_id=${restaurantId}`)
        const contacts = await contactRes.json()
        const allSuppliers = await getAllSuppliers()
        const supplierIds = contacts.map(c => Number(c.supplier_contact_id))
        return allSuppliers
            .filter(s => supplierIds.includes(s.id))
            .map(s => ({ ...s, added: true }))
    } catch (e) {
        console.error('Error fetching restaurant suppliers:', e)
        return []
    }
}

export async function addRestaurantContact(supplierId) {
    const restaurantId = getActiveRestaurantId()
    const checkRes = await fetch(`${API_URL}${CONTACTS_PATH}?restaurant_id=${restaurantId}&supplier_contact_id=${supplierId}`)
    const existing = await checkRes.json()
    if (existing.length > 0) {
        console.warn('Supplier already added for this restaurant')
        return
    }
    return await fetch(`${API_URL}${CONTACTS_PATH}`, {
        method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            restaurant_id: restaurantId,
            supplier_contact_id: supplierId
        })
    })
}