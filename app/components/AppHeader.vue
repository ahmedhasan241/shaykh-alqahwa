<!-- components/AppHeader.vue -->
<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const ui = useUIStore()
const cart = useCartStore()

const navLinks = [
  { to: '/',       label: 'الرئيسية' },
  { to: '/shop',   label: 'المتجر' },
  { to: '/blend',  label: 'خلطتك' },
]

const badgePulse = ref(false)
watch(() => cart.count, (n: number, o: number) => {
  if (n > o) {
    badgePulse.value = false
    nextTick(() => { badgePulse.value = true })
    setTimeout(() => { badgePulse.value = false }, 500)
  }
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-cream/80 dark:bg-ink-900/80 blur-backdrop border-b border-ink-200/40 dark:border-ink-700/40 safe-top">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <SheikhLogo class="w-10 h-10 sm:w-12 sm:h-12 logo-glow transition-transform group-hover:scale-105" />
          <div class="hidden sm:block text-right leading-tight">
            <div class="font-display text-lg font-bold">شيخ القهوة</div>
            <div class="text-[10px] text-ink-400 dark:text-ink-300 tracking-widest">SHEIKH EL QAHWA</div>
          </div>
        </NuxtLink>

        <!-- Desktop nav -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="route.path === link.to
              ? 'coffee-action'
              : 'text-ink-600 hover:bg-ink-100 dark:text-cream/90 dark:hover:bg-white/10'"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Theme toggle -->
          <UButton
            :icon="ui.isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            variant="ghost"
            color="gray"
            size="sm"
            class="rounded-full w-10 h-10"
            aria-label="تبديل الوضع"
            @click="ui.toggleTheme()"
          />

          <!-- Cart button — raw button for guaranteed icon centering -->
          <div class="relative">
            <button
              class="coffee-action w-10 h-10 rounded-full flex items-center justify-center transition"
              aria-label="السلة"
              @click="cart.open()"
            >
              <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5" />
            </button>
            <UBadge
              v-if="cart.count > 0"
              :label="String(cart.count)"
              color="red"
              size="xs"
              class="absolute -top-1 -left-1 min-w-[20px] justify-center"
              :class="badgePulse && 'animate-scale-in'"
            />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
