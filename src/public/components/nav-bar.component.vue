<script >

export default {
  name: 'nav-bar',
}
</script>

<template>
  <div class="navbar-container">
    <div class="navbar">
      <router-link to="/dashboard/profile">
        <i class="pi pi-user icon"></i>
      </router-link>
      <span></span>
      <router-link to="/dashboard/profile">
        <i class="pi pi-ellipsis-v icon"></i>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.navbar-container {
  position: fixed;
  top: 20px;
  left: 94%;
  transform: translateX(-50%);
  z-index: 100;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90px;
  height: 44px;
  background-color: #f1f2f3;
  border-radius: 40px;
  padding: 0 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 20px;
  color: #333;
  margin-right: 10px;
}
</style>