<script>
import Sidebar from './public/components/sidebar.component.vue'

export default {
  name: 'App',
  components: { Sidebar },
}
</script>

<template>
  <div class="layout-container">
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

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
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
