<template>
  <!-- Botón hamburguesa solo visible en pantallas pequeñas -->
  <button
      class="hamburger-button p-button p-button-text"
      @click="sidebarVisible = !sidebarVisible"
      v-show="isMobile"
  >
    <i class="pi pi-bars text-xl px-3 py-2"></i>
  </button>

  <aside
      class="sidebar"
      :class="{
    'sidebar--mobile-show': isMobile && sidebarVisible,
    'sidebar--mobile-hide': isMobile && !sidebarVisible
  }"
  >
    <div class="logo flex align-items-center gap-2 px-3 pt-4 pb-3">
      <img :src="logo" alt="Restock logo" class="logo-icon" />
      <span class="logo-text">Restock</span>
    </div>

    <UserCard
    />

    <ul class="menu list-none flex-auto p-0">
      <li v-for="item in menuItems" :key="item.route">
        <RouterLink
            :to="item.route"
            class="menu-link flex align-items-center gap-3 p-4 transition-colors border-left-3 border-transparent w-full"
            :class="{
            'menu-link--active': isActive(item.route)
          }"
        >
          <i :class="item.icon" class="text-lg"></i>
          <span class="line-height-none">{{ $t(item.label) }}</span>
        </RouterLink>
      </li>
    </ul>

    <div class="py-6 flex justify-content-center">
      <LanguageSwitcher />
    </div>
  </aside>
</template>

<script>
/**
 * @summary Sidebar component for Restock.
 * @author Jahaziel
 * @description Fetches user with Axios (JSON Server) and renders navigation.
 */
import axios from 'axios'
import { RouterLink } from 'vue-router'
import LanguageSwitcher from './language-switcher.component.vue'
import UserCard from '/src/public/user/components/user-card.component.vue'

// usa rutas relativas: sin alias "@"
import logo from '../../assets/logo-restock.png'

export default {
  name: 'Sidebar',
  components: { RouterLink, LanguageSwitcher, UserCard },
  data() {
    return {
      logo,
      user: null,
      sidebarVisible: false,
      isMobile: window.innerWidth < 1260,
      // PrimeIcons -> https://primefaces.org/primevue/icons
      menuItems: [
        { label: 'sidebar.summary', icon: 'pi pi-chart-bar', route: '/summary' },
        { label: 'sidebar.subscription', icon: 'pi pi-credit-card', route: '/subscription' },
        { label: 'sidebar.inventory', icon: 'pi pi-box', route: '/inventory' },
        { label: 'sidebar.suppliers', icon: 'pi pi-users', route: '/suppliers' },
        { label: 'sidebar.alerts', icon: 'pi pi-bell', route: '/alerts' },
        { label: 'sidebar.orders', icon: 'pi pi-truck', route: '/orders' },
        { label: 'sidebar.recipes', icon: 'pi pi-clipboard', route: '/recipes' },
        { label: 'sidebar.sales', icon: 'pi pi-chart-line', route: '/sales' }
      ]
    }
  },
  mounted() {
    window.addEventListener('resize', this.checkMobile)
    this.checkMobile()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile)
  },
  created() {
    // Obtén el primer usuario del fake-API
    axios.get('http://localhost:3000/users/1').then(({ data }) => (this.user = data))
  },
  watch: {
    isMobile(newValue) {
      this.sidebarVisible = !newValue; // false si móvil, true si escritorio
    }
  },
  methods: {
    isActive(route) {
      return this.$route.path.startsWith(route)
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 1260;

      // Asegura que sidebarVisible sea false si pasas a móvil
      if (this.isMobile) {
        this.sidebarVisible = false;
      } else {
        this.sidebarVisible = true;
      }
    }
  }
}
</script>

<style>

/* Base sidebar para todos los tamaños */
.sidebar {
  width: 18rem;
  background: var(--surface-0);
  border-right: 1px solid var(--surface-border);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.1);
}

/* Desktop (por defecto visible) */
@media (min-width: 1260px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
  }
}

@media (max-width: 1259px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
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
