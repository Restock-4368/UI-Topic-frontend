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

    <div class="pt-5 flex justify-content-center mt-auto">
      <LanguageSwitcher />
    </div>
  </aside>
</template>

<script>
import { RouterLink } from 'vue-router'
import LanguageSwitcher from './language-switcher.component.vue'
import logo from '../../assets/images/logo-restock.png'
import { mockUser } from '../../shared/mocks/user.mock.ts';
import {UserService} from "../../restock/iam/services/user.service.js";

export default {
  name: 'Sidebar',
  components: { RouterLink, LanguageSwitcher },
  data() {
    return {
      logo,
      user: null,
      sidebarVisible: false,
      isMobile: window.innerWidth < 1260,
      menuItems: [], // se llenará según el rol
      userService: new UserService()
    }
  },
  created() {
    this.userService.getById(2).then(user => {
      this.user = user;
      const role = this.user.role;  // Accede al nombre del rol directamente

      console.log(role); // Verifica si el rol es correcto

      if (role === 'supplier') {
        this.menuItems = [
          { label: 'sidebar.summary', icon: 'pi pi-chart-bar', route: '/dashboard/supplier/summary' },
          { label: 'sidebar.subscription', icon: 'pi pi-credit-card', route: '/dashboard/supplier/subscription' },
          { label: 'sidebar.inventory', icon: 'pi pi-box', route: '/dashboard/supplier/inventory' },
          { label: 'sidebar.notifications', icon: 'pi pi-bell', route: '/dashboard/supplier/notifications' },
          { label: 'sidebar.orders', icon: 'pi pi-truck', route: '/dashboard/supplier/orders' },
          { label: 'sidebar.ratings', icon: 'pi pi-star', route: '/dashboard/supplier/ratings' }
        ];
      } else if (role === 'restaurant') {
        this.menuItems = [
          { label: 'sidebar.summary', icon: 'pi pi-chart-bar', route: '/dashboard/restaurant/summary' },
          { label: 'sidebar.subscription', icon: 'pi pi-credit-card', route: '/dashboard/restaurant/subscription' },
          { label: 'sidebar.inventory', icon: 'pi pi-box', route: '/dashboard/restaurant/inventory' },
          { label: 'sidebar.suppliers', icon: 'pi pi-users', route: '/dashboard/restaurant/suppliers' },
          { label: 'sidebar.notifications', icon: 'pi pi-bell', route: '/dashboard/restaurant/notifications' },
          { label: 'sidebar.orders', icon: 'pi pi-truck', route: '/dashboard/restaurant/orders' },
          { label: 'sidebar.recipes', icon: 'pi pi-clipboard', route: '/dashboard/restaurant/recipes' },
          { label: 'sidebar.sales', icon: 'pi pi-chart-line', route: '/dashboard/restaurant/sales' }
        ];
      }
    });
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
    }
  },
  methods: {
    isActive(route) {
      return this.$route.path.startsWith(route)
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 1260
      this.sidebarVisible = !this.isMobile
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


</style>
