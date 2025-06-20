<template>
  <div class="p-3 m-2 surface-card border-round border-1 surface-border text-center shadow-2"
    style="min-width: 230px; max-width: 320px;">
    <h4 class="mb-2 text-primary font-bold">{{ supply.name }}</h4>
    <p class="text-sm text-500 mb-1">
      <strong>{{ supply.category }}</strong> - {{ supply.unit }}
    </p>
    <p class="text-sm mb-3 text-color-secondary">{{ supply.description }}</p>

    <pv-button icon="pi pi-pen-to-square" :label="$t('inventory.edit-button')" size="small" class="green-button"
      @click="$emit('edit', supply)" />
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
