// stores/ui.ts
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isDark: false,
  }),

  actions: {
    initTheme() {
      if (import.meta.client) {
        const saved = localStorage.getItem('shq-theme')
        this.isDark = saved
          ? saved === 'dark'
          : window.matchMedia('(prefers-color-scheme: dark)').matches
        this.applyTheme()
      }
    },
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
    },
    applyTheme() {
      if (import.meta.client) {
        document.documentElement.classList.toggle('dark', this.isDark)
        localStorage.setItem('shq-theme', this.isDark ? 'dark' : 'light')
      }
    },
  },
})
