<script>
export default {
  name: 'EmptySection',
};
</script>

<template>
  <div class="empty-section">
    <div class="empty-section__text">
      <slot>
        No data available.
      </slot>
    </div>
    <p></p>
    <div class="empty-section__icon">
      <slot name="icon">
        <i class="pi pi-clipboard" style="font-size: 3rem; color: #6b6a6a;"></i>
      </slot>
    </div>
  </div>
</template>

<style>
.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 4rem 1rem;
  color: #6b6a6a;
}

.empty-section__icon {
  margin-bottom: 1rem;
}

.empty-section__text {
  font-size: 1rem;
  max-width: 450px;
  line-height: 1.6;
}

</style>