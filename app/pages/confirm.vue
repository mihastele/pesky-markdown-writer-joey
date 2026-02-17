<template>
  <div class="auth-page">
    <div class="confirm-card">
      <div v-if="loading" class="confirm-loading">
        <span class="spinner"></span>
        <p>Confirming your account...</p>
      </div>
      <div v-else-if="error" class="confirm-error">
        <Icon name="lucide:alert-circle" size="48" />
        <h2>Something went wrong</h2>
        <p>{{ error }}</p>
        <NuxtLink to="/login" class="btn btn-primary" style="max-width: 160px; margin-top: 1rem;">
          Back to Login
        </NuxtLink>
      </div>
      <div v-else class="confirm-success">
        <span class="success-icon">✅</span>
        <h2>Account confirmed!</h2>
        <p>Redirecting you to the app...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // The Supabase module handles the auth callback automatically
    await new Promise(resolve => setTimeout(resolve, 1500))
    loading.value = false
    setTimeout(() => {
      navigateTo('/')
    }, 1000)
  } catch (err: any) {
    error.value = err.message || 'Failed to confirm account'
    loading.value = false
  }
})
</script>

<style scoped>
.confirm-card {
  text-align: center;
  padding: 3rem;
}

.confirm-loading,
.confirm-error,
.confirm-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-default);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-icon {
  font-size: 3rem;
}

.confirm-error {
  color: var(--text-secondary);
}

.confirm-error h2 {
  color: var(--text-primary);
}
</style>
