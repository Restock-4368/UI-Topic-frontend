import {SupplyBatchService} from "./supply-batch.service.js";
import {SupplyService} from "./supply.service.js";
import {OrderToSupplierService} from "../../orders-to-suppliers/services/order-to-supplier.service.js";
import {OrderToSupplierStateService} from "../../orders-to-suppliers/services/order-to-supplier-state.service.js";
import {
    OrderToSupplierSituationService
} from "../../orders-to-suppliers/services/order-to-supplier-situation.service.js";

export function useRestaurantNotifications() {
    async function getInventoryAlerts() {
        const batchService = new SupplyBatchService();
        const supplyService = new SupplyService();

        const [batchRes, supplyRes] = await Promise.all([
            batchService.getAll(),
            supplyService.getAll()
        ]);

        const batches = batchRes.data;
        const supplies = supplyRes.data;

        return batches
            .filter(b => b.supply_id)
            .map(b => {
                const supply = supplies.find(s => s.id === b.supply_id);
                const stock = b.stock ?? 0;
                const minStock = supply?.min_stock ?? 0;
                const maxStock = supply?.max_stock ?? Infinity;

                return {
                    ingredient: supply?.name ?? "Unknown",
                    status: stock <= minStock ? "Low stock" : (stock >= maxStock ? "Max stock" : "Normal")
                };
            })
            .filter(alert => alert.status !== "Normal");
    }

    async function getOrderAlerts() {
        const orderService = new OrderToSupplierService();
        const stateService = new OrderToSupplierStateService();
        const situationService = new OrderToSupplierSituationService();

        const [ordersRes, statesRes, situationsRes] = await Promise.all([
            orderService.getAll(),
            stateService.getAll(),
            situationService.getAll()
        ]);

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const states = Array.isArray(statesRes.data) ? statesRes.data : [];
        const situations = Array.isArray(situationsRes.data) ? situationsRes.data : [];

        // Crear mapas para mejor performance
        const stateMap = new Map(states.map(s => [s.id, s]));
        const situationMap = new Map(situations.map(s => [s.id, s]));

        // Filtrar y enriquecer órdenes
        const alerts = orders
            .map(order => {
                const state = stateMap.get(order.order_to_supplier_state_id);
                const situation = situationMap.get(order.order_to_supplier_situation_id);

                const stateName = state?.name?.toLowerCase() || '';
                const situationName = situation?.name?.toLowerCase() || '';

                const isRelevant =
                    stateName === 'delivered' ||
                    (situationName && situationName !== 'pending');

                if (!isRelevant) return null;

                const status =
                    stateName === 'delivered'
                        ? 'Delivered'
                        : `Updated to ${situation?.name || 'Unknown'}`;

                return {
                    ingredient: `Order #${order.id}`,
                    status,
                    date: new Date(order.date || order.updated_at || null) // fallback
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.date - a.date); // más reciente primero

        console.log('📦 Final orderAlerts:', alerts);
        return alerts;
    }

    return {
        getInventoryAlerts,
        getOrderAlerts
    };
}
