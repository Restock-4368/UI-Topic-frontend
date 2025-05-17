# 🍽️ Restaurant Inventory Management System 

Sistema de gestión de inventario para restaurantes y proveedores, desarrollado en **Vue 3**, que permite a los administradores controlar eficientemente productos, alertas, perfiles y relaciones con proveedores.

## 🚀 Tecnologías

- Vue 3 (Options API)
- Vue Router
- Pinia *(en integración opcional)*
- Vuetify / PrimeVue *(en integración)*
- SCSS / CSS3
- JavaScript / TypeScript

---

## ✅ Funcionalidades Clave

### 📦 Gestión de Inventario

**Feature:** Visualización y control del inventario

- **Dado que** el usuario accede al módulo de inventario  
  **Cuando** selecciona un producto o categoría  
  **Entonces** puede ver el stock actual, detalles y movimientos recientes

- **Dado que** un insumo alcanza su umbral mínimo  
  **Entonces** el sistema genera una alerta visual (y sonora, si aplica) para el administrador

- **Dado que** se realiza una entrada o salida de inventario  
  **Entonces** el sistema actualiza en tiempo real la cantidad disponible

---
 
### 📊 Panel de Resumen

**Feature:** Vista consolidada de métricas clave y actividad reciente

- **Dado que** un administrador entra al sistema  
  **Entonces** visualiza un dashboard con:  
  → estado del inventario  
  → proveedores activos  
  → alertas recientes  
  → métricas generales

---

### 📢 Envío de Alertas

**Feature:** Sistema de notificaciones ante eventos críticos

- **Dado que** un producto baja del umbral mínimo  
  **Entonces** se notifica al administrador mediante:  
  → banner visual  
  → notificación contextual en el panel principal

- **Dado que** se registra un movimiento de inventario crítico  
  **Entonces** el sistema muestra una alerta con responsable y fecha

---

### 📚 Catálogo de Proveedores

**Feature:** Visualización y gestión de proveedores registrados

- **Dado que** un restaurante desea consultar sus proveedores  
  **Cuando** accede al catálogo  
  **Entonces** puede filtrarlos por nombre, rubro y productos que ofrecen

- **Dado que** un proveedor no ha actualizado su información  
  **Entonces** el sistema le notifica para que la revise y actualice
