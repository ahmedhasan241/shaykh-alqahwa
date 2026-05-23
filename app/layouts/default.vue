<!-- layouts/default.vue -->
<script setup lang="ts">
import type { Product } from '~/composables/useProducts'
import { useUIStore } from '~/stores/ui'

const ui = useUIStore()
const selectedProduct = useState<Product | null>('selectedProduct', () => null)

onMounted(() => {
  ui.initTheme()
})

const openProduct = (p: Product) => { selectedProduct.value = p }
const closeProduct = () => { selectedProduct.value = null }

provide('openProduct', openProduct)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-12">
      <slot />
    </main>

    <BottomNav />

    <!-- Global product sheet -->
    <ProductSheet :product="selectedProduct" @close="closeProduct" />

    <!-- Global cart sheet -->
    <CartSheet />

    <!-- Nuxt UI Notifications (replaces AppToast) -->
    <UNotifications />
  </div>
</template>
