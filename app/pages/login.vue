<template>
  <div class="auth-card">
    <h1>Welcome back</h1>
    <p class="subtitle">Sign in to your Pesky Writer account</p>

    <div v-if="error" class="error-message">{{ error }}</div>

    <button class="btn-oauth" @click="signInWithGitHub">
      <Icon name="mdi:github" size="18" />
      <span>Continue with GitHub</span>
    </button>

    <div class="auth-divider">or</div>

    <form @submit.prevent="handleEmailLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="••••••••"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <p class="auth-footer">
      Don't have an account? <NuxtLink to="/register">Sign up</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleEmailLogin() {
  loading.value = true
  error.value = ''
  try {
    const { error: authError } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (authError) throw authError
    navigateTo('/')
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}

async function signInWithGitHub() {
  try {
    const { error: authError } = await client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/confirm`,
      },
    })
    if (authError) throw authError
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in with GitHub'
  }
}
</script>

<style scoped>
.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.auth-footer a {
  color: var(--accent-primary);
  font-weight: 500;
}

.btn-oauth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>
