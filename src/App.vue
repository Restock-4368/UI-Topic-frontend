<script>
import Sidebar from './public/components/sidebar.component.vue'

export default {
  name: 'App',
  components: { Sidebar }
}
</script>

<template>
  <div class="flex">
    <Sidebar />
    <main class="w-full overflow-y-auto">
    <router-view />
    </main>
  </div>
</template>

<style>

</style>