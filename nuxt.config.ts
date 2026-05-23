// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-05-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'ar', dir: 'rtl' },
      title: 'شيخ القهوة — مذاق كما تهوى',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'theme-color', content: '#1A100E' },
        { name: 'description', content: 'متجر شيخ القهوة — أجود أنواع البن المحمص طازجاً مع خدمة الخلطة الخاصة' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.ts',
  },

  ui: {
    global: true,
    icons: ['heroicons'],
    safelistColors: ['amber', 'green', 'red', 'ink'],
  },

  imports: {
    dirs: ['app/stores'],
  },

  pinia: {
    storesDirs: ['stores'],
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },
})
