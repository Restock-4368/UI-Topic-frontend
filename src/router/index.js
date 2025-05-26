import { createRouter, createWebHistory } from 'vue-router'

 /**
 * @description Lazy-loaded component imports for route configuration
 * Using dynamic imports to enable code splitting and improve performance
 */
const Inventory = () => import('../restock/resource/inventory/pages/inventory.component.vue')
const RestaurantSummaryOverview = () => import('../restock/Analytics/pages/restaurant-summary-overview.component.vue')
const SupplierReviewComponent = () => import('../restock/resource/orders-to-suppliers/pages/supplier-review.component.vue')
const RoleRedirect = () => import('../public/components/role-redirect.component.vue');
const SupplierSummaryOverview = () => import('../restock/Analytics/pages/supplier-summary-overview.component.vue')
const RestaurantSupplierOverview = () => import('../restock/resource/supplier-catalog/pages/restaurant-supplier-overview.component.vue')
const RestaurantSupplierDetail = () => import('../restock/resource/supplier-catalog/pages/supplier-detail.component.vue')
const RestaurantAlertsOverview = () => import('../restock/monitoring/pages/restaurant-alerts-overview.component.vue')
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 * @description Application route definitions.
 */
const routes = [
    {
        path: '/dashboard/restaurant/inventory',
        name: 'restaurant-inventory',
        component: Inventory,
        meta: { title: 'sidebar.inventory' }
    },
    {
        path: '/dashboard/restaurant/summary',
        name: 'restaurant-summary',
        component: RestaurantSummaryOverview,
        meta: { title: 'sidebar.restaurant-summary-overview' }
    },
    {
        path: '/dashboard/restaurant/alerts',
        name: 'restaurant-alerts',
        component: RestaurantAlertsOverview,
        meta: { title: 'sidebar.restaurant-alerts-overview' }
    },
    {
        path: '/dashboard/supplier/inventory',
        name: 'supplier-inventory',
        component: Inventory,
        meta: { title: 'sidebar.inventory' }
    },

    {
        path: '/dashboard/supplier/summary',
        name: 'supplier-summary',
        component: SupplierSummaryOverview,
        meta: { title: 'sidebar.supplier-summary-overview' }
    },
    {
        path: '/dashboard/restaurant/suppliers',
        name: 'supplier-catalog',
        component: RestaurantSupplierOverview,
        meta: { title: 'sidebar.supplier-catalog-overview' }
    },
    {
        path: '/dashboard/restaurant/suppliers/:id',
        name: 'supplier-detail',
        component: RestaurantSupplierDetail,
        meta: { title: 'sidebar.supplier-detail' }
    },
    {
        path: '/dashboard/supplier/ratings',
        name: 'supplier-reviews',
        component: SupplierReviewComponent,
        meta: { title: 'sidebar.ratings' }
    },
    {
        path: '/',
        name: 'root-redirect',
        component: RoleRedirect
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const baseTitle = 'Restock';
    document.title = `${baseTitle} - ${to.meta?.title || 'Page'}`;
    next();
});



export default router

