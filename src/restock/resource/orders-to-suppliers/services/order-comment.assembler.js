import { OrderComment } from "../model/order-comment.entity.js";
import { OrderToSupplier } from "../model/order-to-supplier.entity.js";

export class OrderCommentAssembler {
    static toEntity(dto, order) {
        const comment = new OrderComment({
            id: dto.id,
            order_to_supplier_id: dto.order_to_supplier_id,
            content: dto.content,
            rating: dto.rating,
            date: dto.date
        });

        if (order) {
            comment.order_to_supplier = new OrderToSupplier(order);
        }

        return comment;
    }

    static toDTO(entity) {
        return {
            id: entity.id,
            order_to_supplier_id: entity.order_to_supplier_id,
            content: entity.content,
            rating: entity.rating,
            date: entity.date.toISOString()
        };
    }
}
