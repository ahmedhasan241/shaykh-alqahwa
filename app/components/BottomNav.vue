<!-- components/BottomNav.vue -->
<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cart = useCartStore()

const tabs = [
  {
    to: '/', label: 'الرئيسية',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    to: '/shop', label: 'المتجر',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
  },
  {
    to: '/blend', label: 'خلطتك',
    icon: 'M9 3v2m6-2v2M5 7h14l-1 13H6L5 7zm5 4v6m4-6v6'
  },
  {
    to: '/cart', label: 'السلة',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
  },
]
</script>

<template>
  <nav class="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-ink-800/95 blur-backdrop border-t border-ink-200/40 dark:border-ink-700/40 safe-bottom">
    <div class="flex items-center justify-around h-16">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex flex-col items-center justify-center flex-1 h-full relative transition"
      >
        <div
          class="flex min-w-[58px] flex-col items-center justify-center gap-0.5 rounded-full px-3 py-1.5 transition"
          :class="route.path === tab.to ? 'coffee-action' : 'text-ink-400'"
        >
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="tab.icon"/>
            </svg>
            <span
              v-if="tab.to === '/cart' && cart.count > 0"
              class="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center scale-90"
            >
              {{ cart.count }}
            </span>
          </div>
          <span class="text-[10px] font-semibold">{{ tab.label }}</span>
        </div>
      </NuxtLink>
    </div>
  </nav>
</template>
