<template>
  <div class="border-1 surface-border border-round p-3 m-2 text-center">
    <h4>{{ supply.name }}</h4>
    <p class="text-sm">{{ supply.description }}</p>
    <p><strong>{{ supply.category }}</strong> - {{ supply.unit }}</p>

    <pv-button
        icon="pi pi-pencil"
        label="Editar"
        size="small"
        class="mt-2"
        @click="$emit('edit', supply)"
    />
  </div>
</template>

<script>
export default {
  name: 'InventorySupplyCard',
  props: {
    supply: {
      type: Object,
      required: true
    }
  }
};
</script>
