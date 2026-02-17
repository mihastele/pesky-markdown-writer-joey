<template>
  <div :class="{ dark: isDark }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const isDark = useState('isDark', () => false)

onMounted(() => {
  const stored = localStorage.getItem('pesky-dark-mode')
  if (stored !== null) {
    isDark.value = stored === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

watch(isDark, (val) => {
  localStorage.setItem('pesky-dark-mode', String(val))
})
</script>
