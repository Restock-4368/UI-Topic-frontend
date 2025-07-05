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

        return orders
            .map(order => {
                const state = states.find(s => s.id === order.order_to_supplier_state_id);
                const situation = situations.find(s => s.id === order.order_to_supplier_situation_id);

                const sitName = situation?.name?.toLowerCase();
                const stateName = state?.name?.toLowerCase();

                if ((sitName && sitName !== "pending") || stateName === "delivered") {
                    console.log("Order", order.id, "State:", stateName, "Situation:", sitName);
                    return {
                        ingredient: `Order #${order.id}`,
                        status: stateName === "delivered"
                            ? "Delivered"
                            : `Updated to ${situation?.name}`
                    };
                }
                console.log("Returning order alert for order", order.id);
                return null;
            })

            .filter(Boolean); // elimina nulls
        const result = orders
            .map(order => {
                const state = states.find(s => s.id === order.order_to_supplier_state_id);
                const situation = situations.find(s => s.id === order.order_to_supplier_situation_id);

                const sitName = situation?.name?.toLowerCase();
                const stateName = state?.name?.toLowerCase();

                if ((sitName && sitName !== "pending") || stateName === "delivered") {
                    console.log("✅ Order ALERT generated for:", order.id, "| Status:", stateName, "| Situation:", sitName);
                    return {
                        ingredient: `Order #${order.id}`,
                        status: stateName === "delivered"
                            ? "Delivered"
                            : `Updated to ${situation?.name}`
                    };
                }

                return null;
            })
            .filter(Boolean);

        console.log("📦 Final orderAlerts:", result);
        return result;

    }

    return {
        getInventoryAlerts,
        getOrderAlerts
    };
}
