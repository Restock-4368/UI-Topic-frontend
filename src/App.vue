<script>
import Sidebar from './shared/components/sidebar.component.vue'

export default {
  name: 'App',
  components: { Sidebar }
}
</script>

<template>
  <div class="app-shell flex min-h-screen">
    <Sidebar />
    <main class="flex-auto overflow-x-hidden">
    <router-view />
    </main>
  </div>
</template>

<style>

</style>