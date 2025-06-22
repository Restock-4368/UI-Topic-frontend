import { BaseService } from "../../../../shared/services/base.service.js";
import { OrderCommentAssembler } from "./order-comment.assembler.js";

export class OrderCommentService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_COMMENTS_ENDPOINT_PATH);
    }

    async getAllComments() {
        const response = await this.getAll();
        return response.data.map(dto => OrderCommentAssembler.toEntity(dto));
    }

    async getCommentById(id) {
        const dto = await this.getById(id);
        return OrderCommentAssembler.toEntity(dto);
    }

    async createComment(comment) {
        const dto = OrderCommentAssembler.toDTO(comment);
        const created = await this.create(dto);
        return OrderCommentAssembler.toEntity(created);
    }

    async updateComment(id, comment) {
        const dto = OrderCommentAssembler.toDTO(comment);
        const updated = await this.update(id, dto);
        return OrderCommentAssembler.toEntity(updated);
    }

    async deleteComment(id) {
        return this.delete(id);
    }
}
