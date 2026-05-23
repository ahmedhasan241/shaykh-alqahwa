<!-- components/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '~/composables/useProducts'
import { useFormat } from '~/composables/useFormat'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ open: [Product]; quickAdd: [Product] }>()

const { formatPrice } = useFormat()
</script>

<template>
  <article
    @click="emit('open', product)"
    class="product-card cursor-pointer bg-white dark:bg-ink-800 rounded-3xl overflow-hidden shadow-soft hover:shadow-lift border border-ink-100 dark:border-ink-700 group"
  >
    <!-- Image area -->
    <div class="relative aspect-square overflow-hidden" :style="{ background: product.gradient }">
      <div class="absolute inset-0 grain"></div>
      <div class="absolute inset-0 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-700">
        <CoffeeIllustration :variant="product.image" :accent="product.accent" />
      </div>
      <!-- Badge -->
      <div
        v-if="product.badge"
        class="absolute top-3 right-3 px-2.5 py-1 bg-ink-900/80 backdrop-blur text-amber-300 text-[10px] font-bold rounded-full"
      >{{ product.badge }}</div>
      <!-- Roast pill -->
      <div class="absolute top-3 left-3 px-2 py-1 bg-white/85 backdrop-blur text-ink-700 text-[10px] font-bold rounded-full">
        {{ product.roast }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-3 sm:p-4">
      <div class="text-[10px] text-ink-400 dark:text-ink-300 font-semibold uppercase tracking-widest mb-1">{{ product.origin }}</div>
      <h3 class="font-display font-bold text-base sm:text-lg leading-tight mb-1 line-clamp-1">{{ product.name }}</h3>
      <p class="text-xs text-ink-400 dark:text-ink-300 mb-3 line-clamp-1">{{ product.tagline }}</p>
      <div class="flex items-end justify-between">
        <div>
          <div class="font-display font-bold text-ink-700 dark:text-amber-300 text-lg leading-none">{{ formatPrice(product.pricePerKg) }}</div>
          <div class="text-[10px] text-ink-400 dark:text-ink-400 mt-0.5">جنيه / كجم</div>
        </div>
        <button
          @click.stop="emit('quickAdd', product)"
          class="w-9 h-9 bg-ink-700 dark:bg-amber-400 text-cream dark:text-ink-900 rounded-full flex items-center justify-center hover:scale-110 shadow-soft transition"
          aria-label="إضافة سريعة"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
            <path stroke-linecap="round" d="M12 4v16m8-8H4"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
