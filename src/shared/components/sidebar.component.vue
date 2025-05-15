<template>
  <aside class="flex flex-column surface-0 w-2 border-right-1 surface-border">
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
            class="menu-link flex align-items-center gap-3 p-3 text-color transition-colors border-left-3 border-transparent w-full"
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
  created() {
    // Obtén el primer usuario del fake-API
    axios.get('http://localhost:3000/users/1').then(({ data }) => (this.user = data))
  },
  methods: {
    isActive(route) {
      return this.$route.path.startsWith(route)
    }
  }
}
</script>

<style scoped>


/* Logo */
.logo-icon {
  width: 2.25rem;       /* ≈36 px, igual al mock-up */
  height: auto;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;     /* semibold */
  font-size: 1.25rem;   /* ≈20 px */
  color: var(--surface-900);   /* tono gris oscuro */
}


</style>
