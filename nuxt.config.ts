// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      // Exclude all routes from forced auth redirect — app works in local-only mode
      // Auth is still available on login/register pages for when Supabase is running
      exclude: ['/*'],
      cookieRedirect: false,
    },
  },

  app: {
    head: {
      title: 'Pesky Markdown Writer',
      meta: [
        { name: 'description', content: 'A beautiful Notion-like collaborative markdown editor' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
