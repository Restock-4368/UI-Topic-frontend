<script setup>
import {ref, computed, onMounted} from 'vue';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import DatePicker from 'primevue/datepicker';
import Chart from 'primevue/chart';
import {OrderToSupplierService} from '../../resource/orders-to-suppliers/services/order-to-supplier.service.js';

const selectedTab = ref('earnings');
const selectedRange = ref('week');
const predefinedRanges = ['today', 'week', 'month', 'year'];

const rangeDates = ref([]);
const from = ref(null);
const to = ref(null);
const orders = ref([]);
const supplierId = 4;

const chartData = ref(null);
const chartOptions = ref(null);

onMounted(async () => {
  const service = new OrderToSupplierService();
  orders.value = await service.getAllEnriched();
  console.log('🟢 Loaded orders:', orders.value);
  selectPredefinedRange(selectedRange.value);
});

const filteredOrders = computed(() => {
  const result = orders.value.filter((order) => {
    const date = new Date(order.date);
    return (
        order.supplier_id === supplierId &&
        from.value &&
        to.value &&
        date >= from.value &&
        date <= to.value &&
        ['Delivered', 'Paid'].includes(order.state?.name)
    );
  });
  console.log('📦 Filtered Orders:', result.length, result);
  console.log('📅 Range:', from.value, '→', to.value);
  return result;
});

const filteredEarnings = computed(() => {
  const total = filteredOrders.value.reduce((sum, order) => sum + order.totalPrice, 0);
  console.log('💰 Earnings:', total);
  return total;
});

const filteredSupplies = computed(() => {
  const total = filteredOrders.value.reduce((sum, order) => sum + order.requested_products_count, 0);
  console.log('📦 Supplies Sold:', total);
  return total;
});

function selectPredefinedRange(value) {
  selectedRange.value = value;

  const today = new Date();
  switch (value) {
    case 'today':
      from.value = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      to.value = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      break;
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - 6);
      from.value = new Date(weekStart);
      to.value = new Date(today);
      break;
    case 'month':
      const monthStart = new Date(today);
      monthStart.setMonth(today.getMonth() - 1);
      from.value = new Date(monthStart);
      to.value = new Date(today);
      break;
    case 'year':
      const yearStart = new Date(today);
      yearStart.setFullYear(today.getFullYear() - 1);
      from.value = new Date(yearStart);
      to.value = new Date(today);
      break;
  }

  rangeDates.value = null;
  initChart();
}

function onCalendarRangeChange(value) {
  if (value && Array.isArray(value) && value.length === 2) {
    from.value = value[0];
    to.value = value[1];
    selectedRange.value = 'custom';
    initChart();
  }
}

function initChart() {
  if (!(from.value instanceof Date) || isNaN(from.value) || !(to.value instanceof Date) || isNaN(to.value)) return;

  const dataMap = new Map();

  const formatKey = (date) => {
    switch (selectedRange.value) {
      case 'today':
        return `${date.getHours().toString().padStart(2, '0')}:00`;
      case 'week':
        return date.toLocaleDateString('en-US', {weekday: 'short'});
      case 'month':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'year':
        return date.toLocaleDateString('en-US', {month: 'short'});
      default:
        return date.toLocaleDateString('en-GB');
    }
  };

  filteredOrders.value.forEach((order) => {
    const date = new Date(order.date);
    const key = formatKey(date);
    dataMap.set(key, (dataMap.get(key) || 0) + order.totalPrice);
  });

  const finalLabels = [];
  const finalData = [];

  if (selectedRange.value === 'today') {
    for (let i = 0; i < 24; i++) {
      const hour = `${i.toString().padStart(2, '0')}:00`;
      finalLabels.push(hour);
      finalData.push(dataMap.get(hour) || 0);
    }
  } else if (selectedRange.value === 'week') {
    ['Mon', 'Sun', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      finalLabels.push(day);
      finalData.push(dataMap.get(day) || 0);
    });
  } else if (selectedRange.value === 'month') {
    for (let i = 1; i <= 5; i++) {
      const key = `Week ${i}`;
      finalLabels.push(key);
      finalData.push(dataMap.get(key) || 0);
    }
  } else if (selectedRange.value === 'year') {
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].forEach((month) => {
      finalLabels.push(month);
      finalData.push(dataMap.get(month) || 0);
    });
  } else {
    const current = new Date(from.value);
    while (current <= to.value) {
      const key = current.toLocaleDateString('en-GB');
      finalLabels.push(key);
      finalData.push(dataMap.get(key) || 0);
      current.setDate(current.getDate() + 1);
    }
  }

  const maxY = Math.max(...finalData, 0);
  const stepSize = maxY > 1000 ? 500 : maxY > 200 ? 100 : 20;

  const MAX_POINTS = 12;

  let trimmedLabels = [];
  let trimmedData = [];

  if (finalLabels.length <= MAX_POINTS) {
    // No hay que recortar
    trimmedLabels = finalLabels;
    trimmedData = finalData;
  } else {
    const step = Math.ceil((finalLabels.length - 2) / (MAX_POINTS - 2));

    // Siempre incluir primero
    trimmedLabels.push(finalLabels[0]);
    trimmedData.push(finalData[0]);

    for (let i = 1; i < finalLabels.length - 1; i++) {
      if ((i - 1) % step === 0) {
        trimmedLabels.push(finalLabels[i]);
        trimmedData.push(finalData[i]);
      }
    }

    // Siempre incluir último
    trimmedLabels.push(finalLabels[finalLabels.length - 1]);
    trimmedData.push(finalData[finalData.length - 1]);
  }

  chartData.value = {
    labels: trimmedLabels,
    datasets: [
      {
        label: 'Earnings',
        data: trimmedData,
        fill: true,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        tension: 0.4,
      },
    ],
  };

  chartOptions.value = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#495057' },
        grid: { color: '#ebedef' }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#495057',
          stepSize
        },
        grid: { color: '#ebedef' }
      }
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10
      }
    }
  };

}
</script>

<template>
  <div class="widget-container">
    <!-- TABS DE ARRIBA -->
    <ul class="nav-tabs">
      <li :class="{ active: selectedTab === 'earnings' }" @click="selectedTab = 'earnings'">Earnings</li>
      <li :class="{ active: selectedTab === 'supplies' }" @click="selectedTab = 'supplies'">Supplies</li>
      <li :class="{ active: selectedTab === 'chart' }" @click="selectedTab = 'chart'">Chart</li>
    </ul>

    <!-- FILTROS DE RANGO (SIEMPRE VISIBLES) -->
    <div class="range-controls">
      <ButtonGroup>
        <Button
            v-for="range in predefinedRanges"
            :key="range"
            :label="range.charAt(0).toUpperCase() + range.slice(1)"
            :outlined="selectedRange !== range"
            :severity="selectedRange === range ? 'success' : 'secondary'"
            @click="selectPredefinedRange(range)"
        />
        <!-- Calendario integrado visualmente como un botón -->
        <div class="datepicker-icon-wrapper">
          <span class="icon-label">Fecha</span>
          <DatePicker
              v-model="rangeDates"
              selectionMode="range"
              @update:modelValue="onCalendarRangeChange"
              showIcon
              iconDisplay="icon"
              dateFormat="dd/mm/yy"
              class="minimal-datepicker-icon-only"
          />
        </div>

      </ButtonGroup>
    </div>

    <!-- CONTENIDO DEL TAB ACTIVO -->
    <div class="tab-content">
      <div v-if="selectedTab === 'earnings'" class="content-block">
        <h4>Earnings</h4>
        <p class="value">S/. {{ filteredEarnings.toFixed(2) }}</p>
      </div>

      <div v-if="selectedTab === 'supplies'" class="content-block">
        <h4>Supplies Sold</h4>
        <p class="value">{{ filteredSupplies }}</p>
      </div>

      <div v-if="selectedTab === 'chart'" class="content-block">
        <Chart
            v-if="chartData"
            type="line"
            :data="chartData"
            :options="chartOptions"
            style="height: 220px"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─────────────────────────────── */
/* CONTENEDOR PRINCIPAL            */
/* ─────────────────────────────── */
.widget-container {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 1px 0 8px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

/* ─────────────────────────────── */
/* TABS SUPERIORES                 */
/* ─────────────────────────────── */
.nav-tabs {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 1rem;
  padding: 0;
}

.nav-tabs li {
  cursor: pointer;
  padding: 10px 15px;
  font-weight: 500;
  color: #555;
  border-bottom: 3px solid transparent;
  transition: border-color 0.2s, color 0.2s;
}

.nav-tabs li.active {
  color: #2f855a;
  border-color: #2f855a;
}

/* ─────────────────────────────── */
/* FILTROS DE RANGO                */
/* ─────────────────────────────── */
.range-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.range-controls .p-button {
  padding: 4px 8px;
  font-size: 12px;
  height: 30px;
}

/* ─────────────────────────────── */
/* DATEPICKER COMO BOTÓN COMPACTO  */
/* ─────────────────────────────── */

/* Aplica solo al input del DatePicker con clase específica */
:deep(.minimal-datepicker-inline .p-inputtext) {
  font-size: 10px !important;
  padding: 0 4px !important;
  color: #333 !important;
  text-align: center;
  pointer-events: none;
  border: none !important;
  background: none !important;
  width: auto !important;
  min-width: 32px;
}

/* Wrapper para incluir el ícono encima */
.datepicker-icon-wrapper {
  position: relative;
  display: inline-block;
}

.icon-label {
  position: absolute;
  top: -14px;
  left: 0;
  font-size: 10px;
  color: #777;
  font-weight: 500;
}

/* Botón compacto */
.minimal-datepicker-inline {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
  margin-left: 6px;
  position: relative;
}

/* Estilo para el botón de calendario (ícono) */
.minimal-datepicker-inline .p-datepicker-trigger {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* Tamaño del ícono */
.minimal-datepicker-inline .p-button-icon {
  font-size: 1rem;
  color: #666;
}

/* ─────────────────────────────── */
/* CONTENIDO DE TABS               */
/* ─────────────────────────────── */
.tab-content {
  text-align: center;
  margin-top: 1.5rem;
}

.content-block h4 {
  margin-bottom: 0.5rem;
}

.value {
  font-size: 2rem;
  font-weight: bold;
  color: #2f855a;
}

/* ─────────────────────────────── */
/* CHART LIMITADO EN ALTURA        */
/* ─────────────────────────────── */
/* Forzar la altura máxima sin importar el inline style generado */
:deep(.p-chart) {
  min-height: unset !important;
  height: 200px !important;
}

.p-chart canvas {
  width: 100% !important;
  height: auto !important;
  max-height: 250px !important; /* límite para pantallas pequeñas */
}
</style>