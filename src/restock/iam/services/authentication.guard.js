import {useAuthenticationStore} from "./authentication.store.js";

/**
 * Guard to check if user is authenticated
 * @summary
 * This guard checks if user is authenticated.
 * If user is not authenticated and tries to navigate to a route that requires authentication,
 * it redirects to the sign-in page, otherwise it allows navigation.
 * @param to - Route to navigate to
 * @param from - Route from which navigation is done
 * @param next - Function to call to navigate to the next route
 */
export const authenticationGuard = (to, from, next) => {
    const authenticationStore = useAuthenticationStore();
    const isAnonymous = !authenticationStore.signedIn;

    const publicRoutes = ['/sign-in', '/sign-up', '/page-not-found'];
    const routeRequiresAuth = !publicRoutes.includes(to.path);

    if (isAnonymous && routeRequiresAuth) {
        return next({ name: 'sign-in' });
    }

    const userRoleId = authenticationStore.roleId;

    if (to.path.startsWith('/dashboard/supplier') && userRoleId !== 1) {
        return next({ name: 'restaurant-summary' });
    }

    if (to.path.startsWith('/dashboard/restaurant') && userRoleId !== 2) {
        return next({ name: 'supplier-summary' });
    }

    next();
}