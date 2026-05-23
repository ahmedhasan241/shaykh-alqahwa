<!-- components/ProductCard.vue -->
<script setup lang="ts">
import type { Product } from '~/composables/useProducts'
import { useFormat } from '~/composables/useFormat'

defineProps<{ product: Product }>()
const emit = defineEmits<{ open: [Product]; quickAdd: [Product] }>()

const { formatPrice } = useFormat()
</script>

<template>
  <article
    @click="emit('open', product)"
    class="product-card relative min-h-[168px] cursor-pointer overflow-hidden rounded-3xl border border-ink-200/70 bg-cream-50 p-4 shadow-soft hover:shadow-lift dark:border-ink-700 dark:bg-ink-800 group"
  >
    <!-- Image -->
    <div
      class="absolute inset-y-0 left-0 w-[42%] overflow-hidden border-r border-amber-400/15"
      :style="{ background: product.gradient }"
    >
      <div class="absolute inset-0 grain"></div>
      <div class="absolute inset-0 flex items-center justify-center p-3 opacity-95 transition-transform duration-700 group-hover:scale-110">
        <CoffeeIllustration :variant="product.image" :accent="product.accent" />
      </div>
    </div>

    <!-- Info -->
    <div class="relative z-10 flex min-h-[136px] max-w-[62%] flex-col justify-between">
      <div>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[10px] text-amber-600 dark:text-amber-300 font-semibold uppercase tracking-widest">{{ product.origin }}</span>
          <span class="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-ink-500 dark:text-cream/70">
            {{ product.roast }}
          </span>
          <span
            v-if="product.badge"
            class="rounded-full bg-ink-900/80 px-2 py-0.5 text-[10px] font-bold text-amber-300"
          >
            {{ product.badge }}
          </span>
        </div>
        <h3 class="font-display mt-3 font-bold text-base sm:text-lg leading-tight line-clamp-2">{{ product.name }}</h3>
        <p class="mt-1 text-xs text-ink-400 dark:text-cream/55 line-clamp-1">{{ product.tagline }}</p>
      </div>
      <div>
        <div class="font-display font-bold text-amber-600 dark:text-amber-300 text-lg leading-none">{{ formatPrice(product.pricePerKg) }}</div>
        <div class="text-[10px] text-ink-400 dark:text-ink-400 mt-0.5">جنيه / كجم</div>
      </div>
    </div>

    <button
      @click.stop="emit('quickAdd', product)"
      class="coffee-action absolute bottom-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition"
      aria-label="إضافة سريعة"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
        <path stroke-linecap="round" d="M12 4v16m8-8H4"/>
      </svg>
    </button>
  </article>
</template>
