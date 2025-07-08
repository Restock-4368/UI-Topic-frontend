<template>
  <!-- Botón hamburguesa solo visible en pantallas pequeñas -->
  <pv-button
      class="p-button p-button-text text-xl z-6 burger-button"
      @click="sidebarVisible = !sidebarVisible"
      v-show="isMobile"
      :style="sidebarVisible ? 'position: fixed; top: 1rem; left: 12rem; z-index: 10' : 'position: fixed; top: 1rem; left: 1rem;'"
  >
    <i :class="['pi', sidebarVisible ? 'pi-times' : 'pi-bars']"></i>
  </pv-button>


  <aside
      class="bg-white shadow-2 h-screen z-5 transition-all"
      :class="[
        'p-3',
        isMobile ? 'fixed top-0 left-0 w-15rem' : 'w-15rem block',
        sidebarVisible ? 'block' : isMobile ? 'hidden' : ''
      ]"
  >
    <div class="flex align-items-center gap-2 px-3 pt-4 pb-3">
      <img :src="logo" alt="Restock logo" class="w-2rem" />
      <span class="text-xl">Restock</span>
    </div>


    <ul class="menu list-none flex-auto p-0">
      <li v-for="item in menuItems" :key="item.route">
        <RouterLink
            :to="item.route"
            class="menu-link flex align-items-center gap-3 p-4 transition-colors border-left-3 border-transparent w-full"
            :class="{ 'bg-active-sidebar': isActive(item.route) }"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span>{{ $t(item.label) }}</span>
        </RouterLink>
      </li>
    </ul>

    <div  class="menu list-none flex-auto p-0">
      <pv-button
          class="p-button-text p-button-danger"
          @click="logout"
      >
        <i class="pi pi-sign-out"></i>
        <span class="ml-2">Logout</span>
      </pv-button>
    </div>

    <div class="pt-5 flex justify-content-center mt-auto">
      <LanguageSwitcher />
    </div>


  </aside>
</template>

<script>
import { RouterLink } from 'vue-router'
import LanguageSwitcher from './language-switcher.component.vue'
import logo from '../../assets/images/logo-restock.png'
import {ProfileService} from "../../restock/profiles/services/profile.service.js";
import {ProfileAssembler} from "../../restock/profiles/services/profile.assembler.js";
import {sessionService} from "../../shared/services/session.service.js";
import AuthenticationSection from "../../restock/iam/components/authentication-section.component.vue";
import {useAuthenticationStore} from "../../restock/iam/services/authentication.store.js";

export default {
  name: 'Sidebar',
  components: {AuthenticationSection, RouterLink, LanguageSwitcher },
  props: {
    user: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      logo,
      sidebarVisible: false,
      isMobile: window.innerWidth < 1260,
      menuItems: [], // se llenará según el rol
    }
  },
  async created() {

    const authStore = useAuthenticationStore();
    this.loadMenu(authStore.roleId);

    console.log("Sidebar created with roleId:", authStore.roleId);

  },
  mounted() {
    window.addEventListener('resize', this.checkMobile)
    this.checkMobile()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  watch: {
    isMobile(newValue) {
      this.sidebarVisible = !newValue
    },
    'authStore.roleId': function(newRoleId) {
      console.log("RoleId changed in store:", newRoleId);
      this.loadMenu(newRoleId);
    }
  },
  computed: {
    authStore() {
      return useAuthenticationStore();
    }
  },
  methods: {
    loadMenu(role) {
      if (role === 1) {
        this.menuItems = [
          { label: 'sidebar.summary', icon: 'pi pi-chart-bar', route: '/dashboard/supplier/summary' },
          { label: 'sidebar.subscription', icon: 'pi pi-credit-card', route: '/dashboard/supplier/subscription' },
          { label: 'sidebar.inventory', icon: 'pi pi-box', route: '/dashboard/supplier/inventory' },
          { label: 'sidebar.notifications', icon: 'pi pi-bell', route: '/dashboard/supplier/notifications' },
          { label: 'sidebar.orders', icon: 'pi pi-truck', route: '/dashboard/supplier/orders' },
          { label: 'sidebar.ratings', icon: 'pi pi-star', route: '/dashboard/supplier/ratings' }
        ];
      } else if (role === 2) {
        this.menuItems = [
          { label: 'sidebar.summary', icon: 'pi pi-chart-bar', route: '/dashboard/restaurant/summary' },
          { label: 'sidebar.subscription', icon: 'pi pi-credit-card', route: '/dashboard/restaurant/subscription' },
          { label: 'sidebar.inventory', icon: 'pi pi-box', route: '/dashboard/restaurant/inventory' },
          { label: 'sidebar.notifications', icon: 'pi pi-bell', route: '/dashboard/restaurant/notifications' },
          { label: 'sidebar.orders', icon: 'pi pi-truck', route: '/dashboard/restaurant/orders' },
          { label: 'sidebar.recipes', icon: 'pi pi-clipboard', route: '/dashboard/restaurant/recipes' },
          { label: 'sidebar.sales', icon: 'pi pi-chart-line', route: '/dashboard/restaurant/sales' }
        ];
      } else {
        console.error("Unknown role for sidebar:", role);
        this.menuItems = [];
      }
    },
    isActive(route) {
      return this.$route.path.startsWith(route)
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 1260
      this.sidebarVisible = !this.isMobile
    },
    logout() {
      let authStore = useAuthenticationStore();
      authStore.signOut(this.$router);
    }
  }
}
</script>


<style>

/* Base sidebar para todos los tamaños */
.sidebar {
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
}

@media (min-width: 1260px) {
  .sidebar {
    top: 0;
    left: 0;
  }
}

@media (max-width: 1259px) {
  .sidebar {
    top: 0;
    left: 0;
    z-index: 5;
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  .sidebar--mobile-show {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
  }

  .sidebar--mobile-hide {
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }
}

.hamburger-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 10;

  width: 3rem;
  height: 3rem;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
/* Logo */
.logo-icon {
  width: 2.25rem;       /* ≈36 px, igual al mock-up */
  height: auto;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;     /* semibold */
  font-size: 1.25rem;   /* ≈20 px */
}

.logout-container {
  margin-top: auto;
  padding: 1rem 0;
  display: flex;
  color: #e68900 !important;
}
</style>
