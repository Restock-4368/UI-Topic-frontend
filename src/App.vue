<script>
import Sidebar from './public/components/sidebar.component.vue'
import NavBar from "./public/components/nav-bar.component.vue";

export default {
  name: 'App',
  components: {NavBar, Sidebar },
}
</script>

<template>
  <div class="layout-container">
    <nav-bar></nav-bar>

    <!-- Sidebar fija al lado izquierdo -->
    <aside>
      <Sidebar />
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <!-- Imagen superior -->
      <img src="../src/assets/images/imagen-principal.png" alt="Logo" class="principal-image" />

      <!-- Contenido dinámico de las rutas -->
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style >
/* En tu main.css o app.css */
.p-multiselect-panel {
  background-color: white !important;
}

.p-multiselect-items {
  background-color: white !important;
}

.p-multiselect-item {
  background-color: white !important;
  color: #333 !important;
}

.p-multiselect-item:hover {
  background-color: #f5f5f5 !important;
}

.p-multiselect-item.p-highlight {
  background-color: #2D5A34 !important;
  color: white !important;
}
.layout-container {
  display: flex;
  height: 100vh;
  
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.content-wrapper {
  padding: 24px;
  background-color: #ffffff;
  flex-grow: 1;
}

.principal-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
