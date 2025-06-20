<script>
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n()

    const toggle = () => {
      const next = locale.value === 'en' ? 'es' : 'en'
      locale.value = next
      localStorage.setItem('lang', next)
    }

    return { toggle }
  }
}
</script>
<template>
  <pv-button
      @click="toggle"
      class="w-3 h-10 green-button hover:bg-green-800 rounded-full flex items-center justify-center text-white"
      :aria-label="$t('language.switch')"
  >
    <i class="pi pi-globe text-base" />
  </pv-button>
</template>

<style scoped>

</style>