<script>
import Sidebar from './public/components/sidebar.component.vue'
import NavBar from "./public/components/nav-bar.component.vue";
import {Profile} from "./restock/profiles/model/profile.entity.js";
import {User} from "./restock/iam/model/user.entity.js";
import {ProfileService} from "./restock/profiles/services/profile.service.js";
import {ProfileAssembler} from "./restock/profiles/services/profile.assembler.js";
import {sessionService} from "./shared/services/session.service.js";

export default {
  name: 'App',
  components: {NavBar, Sidebar },
   async created () {

 // DEFINIR AQUI EL ID DEL PERFIL ACTUAL
    // 1 -> Supplier pepe
    // 2 -> Restaurant maria
    // 3 -> Supplier Juan
    // 4 -> Restaurant Luis
     sessionService.setProfileId(2); // Simula la asignación del ID del perfil
  },
}

</script>


<template>
  <toast />
  <div class="layout-container">
    <nav-bar v-if="!$route.meta.hideLayout"></nav-bar>

    <aside v-if="!$route.meta.hideLayout">
      <Sidebar/>
    </aside>

    <main class="main-content" :class="{'full-width': $route.meta.hideLayout}">
      <img v-if="!$route.meta.hideLayout" src="../src/assets/images/imagen-principal.png" alt="Logo" class="principal-image" />

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
  background-color: #ffffff;
  flex-grow: 1;
}

.principal-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>
