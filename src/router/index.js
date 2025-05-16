import { createRouter, createWebHistory } from 'vue-router'
/**
 * @description Lazy-loaded component imports for route configuration
 * Using dynamic imports to enable code splitting and improve performance
 */
const Inventory = () => import('../restaurant-admin/components/inventory.component.vue')
const RestaurantSummaryOverview = () => import('../app/restock/Analytics/pages/restaurant-summary-overview.component.vue')
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 * @description Application route definitions.
 */
const routes = [
    {
        path: '/inventory',
        name: 'inventory',
        component: Inventory,
        meta: { title: 'sidebar.inventory' }
    },
    {
        path: '/summary',
        name: 'restaurant-summary',
        component: RestaurantSummaryOverview,
        meta: { title: 'sidebar.restaurant-summary-overview' }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`)
    const baseTitle = 'Restock'
    document.title = `${baseTitle} · ${to.meta?.title || 'Page'}`
    next()
})

export default router
