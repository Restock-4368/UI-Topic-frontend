import { SupplyCategory } from '../model/supply-category.entity';

export class SupplyCategoryAssembler {
  /**
   * Transforma un objeto plano (raw) en una entidad SupplyCategory
   * @param {Object} raw - Objeto recibido de la API
   * @returns {SupplyCategory}
   */
  static toEntity(raw) {
    return new SupplyCategory(raw);
  }

  /**
   * Transforma un array de objetos planos en entidades SupplyCategory
   * @param {Object[]} rawArray - Array de objetos recibidos de la API
   * @returns {SupplyCategory[]}
   */
  static toEntities(rawArray) {
    return rawArray.map(raw => this.toEntity(raw));
  }

  /**
   * Transforma un AxiosResponse en un array de entidades SupplyCategory
   * @param {import('axios').AxiosResponse} response - Respuesta HTTP de Axios
   * @returns {SupplyCategory[]}
   */
  static toEntitiesFromResponse(response) {
    return this.toEntities(response.data);
  }

  /**
   * Transforma una entidad SupplyCategory a un objeto plano para enviar al backend
   * @param {SupplyCategory} entity
   * @returns {Object}
   */
  static toResource(entity) {
    return {
      name: entity.name,
    };
  }
}
