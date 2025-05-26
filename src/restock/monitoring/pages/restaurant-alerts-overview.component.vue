<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold mb-6">Registered alerts</h2>

    <div class="flex justify-end mb-4">
      <label class="mr-2">Filter by:</label>
      <select v-model="selectedFilter" class="border rounded px-3 py-2">
        <option value="All">All</option>
        <option value="LOW STOCK">LOW STOCK</option>
        <option value="MAX STOCK">MAX STOCK</option>
      </select>
    </div>

    <table class="w-full text-left border-collapse rounded shadow overflow-hidden">
      <thead class="bg-gray-100 text-gray-600 uppercase text-sm">
      <tr>
        <th class="px-4 py-3">Ingredients</th>
        <th class="px-4 py-3">Location</th>
        <th class="px-4 py-3">Status</th>
        <th class="px-4 py-3">Last update</th>
      </tr>
      </thead>
      <tbody class="text-gray-700">
      <tr
          v-for="alert in filteredAlerts"
          :key="alert.ingredient"
          class="border-t hover:bg-gray-50"
      >
        <td class="px-4 py-3">{{ alert.ingredient }}</td>
        <td class="px-4 py-3">{{ alert.location }}</td>
        <td class="px-4 py-3">
            <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                'bg-red-100 text-red-600': alert.status === 'LOW STOCK',
                'bg-orange-100 text-orange-600': alert.status === 'MAX STOCK'
              }"
            >
              {{ alert.status }}
            </span>
        </td>
        <td class="px-4 py-3">{{ alert.lastUpdate }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AlertsManagement',
  data() {
    return {
      selectedFilter: 'All',
      alerts: [
        {
          ingredient: 'Pescado bonito',
          location: 'Congeladora',
          status: 'LOW STOCK',
          lastUpdate: '15 minutes ago'
        },
        {
          ingredient: 'Leche deslactosada',
          location: 'Refrigeradora',
          status: 'MAX STOCK',
          lastUpdate: '1 hour ago'
        },
        {
          ingredient: 'Lentejas',
          location: 'Alacena',
          status: 'LOW STOCK',
          lastUpdate: '3 hour ago'
        },
        {
          ingredient: 'Avena',
          location: 'Alacena',
          status: 'MAX STOCK',
          lastUpdate: '1 day ago'
        },
        {
          ingredient: 'Arroz',
          location: 'Alacena',
          status: 'LOW STOCK',
          lastUpdate: '1 day ago'
        }
      ]
    };
  },
  computed: {
    filteredAlerts() {
      if (this.selectedFilter === 'All') return this.alerts;
      return this.alerts.filter(a => a.status === this.selectedFilter);
    }
  }
};
</script>

<style scoped>
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #cbd5e0;
}
</style>
