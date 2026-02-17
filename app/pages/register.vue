<template>
  <div class="auth-card">
    <h1>Create an account</h1>
    <p class="subtitle">Join Pesky Writer and start collaborating</p>

    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-if="success" class="success-message">{{ success }}</div>

    <button class="btn-oauth" @click="signUpWithGitHub">
      <Icon name="mdi:github" size="18" />
      <span>Continue with GitHub</span>
    </button>

    <div class="auth-divider">or</div>

    <form @submit.prevent="handleEmailSignUp">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          id="name"
          type="text"
          v-model="name"
          placeholder="John Doe"
          required
        />
      </div>
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
          placeholder="At least 6 characters"
          required
          minlength="6"
        />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <p class="auth-footer">
      Already have an account? <NuxtLink to="/login">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const client = useSupabaseClient()
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

async function handleEmailSignUp() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    const { error: authError } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: name.value,
        },
      },
    })
    if (authError) throw authError
    success.value = 'Account created! Check your email for a confirmation link.'
  } catch (err: any) {
    error.value = err.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}

async function signUpWithGitHub() {
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

.success-message {
  background: rgba(15, 157, 88, 0.08);
  color: #0f9d58;
  border-radius: var(--radius-md);
  padding: 0.6rem 0.8rem;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}
</style>
