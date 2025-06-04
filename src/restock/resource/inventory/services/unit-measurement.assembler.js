import { UnitMeasurement } from "../model/unit-measurement.entity.js";

export class UnitMeasurementAssembler {
  /**
   * Convierte un recurso plano a una entidad UnitMeasurement
   * @param {Object} resource - Objeto con los datos de la unidad
   * @returns {UnitMeasurement}
   */
  static toEntityFromResource(resource) {
    return new UnitMeasurement({ ...resource });
  }

  /**
   * Convierte una respuesta de la API a una lista de entidades UnitMeasurement
   * @param {AxiosResponse<any>} response - Respuesta HTTP con los datos
   * @returns {UnitMeasurement[]} Lista de unidades de medida
   */
  static toEntitiesFromResponse(response) {
    if (response.data && Array.isArray(response.data)) {
      return response.data.map(resource => this.toEntityFromResource(resource));
    }

    console.error('Respuesta inválida en UnitMeasurementAssembler:', response);
    return [];
  }
}
