import {SupplierAssembler} from "./supplier.assembler.js"

const API_URL = import.meta.env.VITE_API_BASE_URL
const USERS_PATH = import.meta.env.VITE_USERS_ENDPOINT_PATH
const PROFILES_PATH = import.meta.env.VITE_PROFILES_ENDPOINT_PATH
const ROLES_PATH = import.meta.env.VITE_ROLES_ENDPOINT_PATH
const PROFILES_CATEGORIES_PATH = import.meta.env.VITE_PROFILES_BUSINESS_CATEGORIES_ENDPOINT_PATH
const CATEGORIES_PATH = import.meta.env.VITE_BUSINESS_CATEGORIES_ENDPOINT_PATH

export async function getAllSuppliers() {
    try {
        const [usersRes, profilesRes, rolesRes, pcRes, catsRes] = await Promise.all([
            fetch(`${API_URL}${USERS_PATH}`),
            fetch(`${API_URL}${PROFILES_PATH}`),
            fetch(`${API_URL}${ROLES_PATH}`),
            fetch(`${API_URL}${PROFILES_CATEGORIES_PATH}`),
            fetch(`${API_URL}${CATEGORIES_PATH}`)
        ])
        const [users, profiles, roles, profileCategories, categories] = await Promise.all([
            usersRes.json(), profilesRes.json(), rolesRes.json(), pcRes.json(), catsRes.json()
        ])
        const supplierRole = roles.find(r => r.name === 'supplier')
        if (!supplierRole) return []
        const suppliers = users.filter(u => `${u.role_id}` === `${supplierRole.id}`)

        return suppliers.map(user => {
            const profile = profiles.find(p => p.user_id === user.id)
            const profileCatIds = profileCategories
                .filter(pbc => pbc.profile_id === profile?.id)
                .map(pbc => pbc.business_category_id)
            const categoriesForUser = categories.filter(c => profileCatIds.includes(c.id))

            return SupplierAssembler.toSupplierEntity({
                user,
                profile,
                role: supplierRole,
                categories: categoriesForUser
            })
        })
    } catch (error) {
        console.error('Error assembling suppliers:', error)
        return []
    }
}