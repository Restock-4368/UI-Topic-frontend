import { createRouter, createWebHistory } from 'vue-router'
import SubscriptionOverviewComponent from '../restock/subscription/pages/subscription-overview.component.vue';
import SalesComponent from '../restock/monitoring/restaurant-sales/pages/sales.component.vue';
import SupplierAlertsOverviewComponent from '../restock/monitoring/suppliers-orders/pages/supplier-alerts-overview.component.vue';


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
const RestaurantNotificationsOverview = () => import('../restock/resource/inventory/pages/restaurant-notifications-overview.component.vue')
const RestaurantRecipesOverview = () => import('../restock/planning/pages/restaurant-recipes-overview.component.vue')
const SuppliersOrdersOverview = () => import('../restock/monitoring/suppliers-orders/pages/suppliers-orders-overview.component.vue')
/**
 * @type {import('vue-router').RouteRecordRaw[]}
 * @description Application route definitions.
 */
const routes = [

    // Restaurants Routes
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
        path: '/dashboard/restaurant/subscription',
        name: 'restaurant-subscription',
        component: SubscriptionOverviewComponent,
        meta: { title: 'sidebar.supplier-summary-overview' }
    },
    {
        path: '/dashboard/restaurant/notifications',
        name: 'restaurant-notifications',
        component: RestaurantNotificationsOverview,
        meta: { title: 'sidebar.restaurant-notifications-overview' }
    },
    {
        path: '/dashboard/restaurant/recipes',
        name: 'restaurant-recipes',
        component: RestaurantRecipesOverview,
        meta: { title: 'sidebar.restaurant-recipes-overview' }
    },
    {
        path: '/dashboard/restaurant/sales',
        name: 'restaurant-sales',
        component: SalesComponent,
        meta: { title: 'sidebar.sales' }
    },

    // Suppliers Routes
    {
        path: '/dashboard/supplier/summary',
        name: 'supplier-summary',
        component: SupplierSummaryOverview,
        meta: { title: 'sidebar.supplier-summary-overview' }
    },
    {
        path: '/dashboard/supplier/subscription',
        name: 'supplier-subscription',
        component: SubscriptionOverviewComponent,
        meta: { title: 'sidebar.subscription' }
    },
    {
        path: '/dashboard/supplier/inventory',
        name: 'supplier-inventory',
        component: Inventory,
        meta: { title: 'sidebar.inventory' }
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
        path: '/dashboard/supplier/orders',
        name: 'supplier-orders',
        component: SuppliersOrdersOverview,
        meta: { title: 'sidebar.orders' }
    },
    {
        path: '/dashboard/supplier/notifications',
        name: 'notificaction-suppliers',
        component: SupplierAlertsOverviewComponent,
        meta: { title: 'sidebar.notifications' }
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

