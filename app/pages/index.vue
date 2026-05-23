<!-- pages/index.vue -->
<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { useProducts } from '~/composables/useProducts'
import type { Product } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useUIStore } from '~/stores/ui'

definePageMeta({ layout: 'default' })

const { products, categories } = useProducts()
const cart = useCartStore()
const ui = useUIStore()
const toast = useToast()
const openProduct = inject<(p: Product) => void>('openProduct')

const selectedCategory = ref('الكل')
const featured = computed(() =>
  selectedCategory.value === 'الكل'
    ? products.slice(0, 8)
    : products.filter(p => p.category === selectedCategory.value).slice(0, 8)
)

const quickAdd = (p: Product) => {
  cart.add({
    type: 'single',
    productId: p.id,
    name: p.name,
    image: p.image,
    gradient: p.gradient,
    accent: p.accent,
    weight: 0.25,
    pricePerKg: p.pricePerKg,
    price: p.pricePerKg * 0.25,
  })
  toast.add({ title: 'تمت الإضافة للسلة', icon: 'i-heroicons-check-circle', color: 'primary' })
}
</script>

<template>
  <div class="animate-fade-in">

    <!-- HERO -->
    <section class="relative mt-6 sm:mt-10 rounded-3xl overflow-hidden bg-gradient-to-br from-ink-700 via-ink-600 to-ink-800 dark:from-ink-800 dark:via-ink-900 dark:to-black grain hero-pattern">
      <div class="relative px-6 sm:px-12 py-12 sm:py-20 text-cream">
        <div class="flex flex-col sm:flex-row items-center gap-8">
          <div class="flex-1 text-center sm:text-right">
            <h1 class="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4">
              مذاق <span class="gold-shimmer">كما تهوى</span>
            </h1>
            <p class="text-cream/85 text-base sm:text-lg max-w-md mx-auto sm:mx-0 leading-relaxed">
              نخبة من أجود حبوب القهوة المحمصة طازجاً، تُحضّر لك بشغف وحرفية الأجيال.
            </p>
            <div class="flex flex-wrap gap-3 mt-8 justify-center sm:justify-start">
              <NuxtLink to="/shop" class="coffee-action px-7 py-3.5 font-bold rounded-full transition">
                اكتشف القهوة
              </NuxtLink>
              <NuxtLink to="/blend" class="px-7 py-3.5 bg-white/10 hover:bg-white/20 blur-backdrop text-cream font-semibold rounded-full border border-white/20 transition">
                اصنع خلطتك ✦
              </NuxtLink>
            </div>
          </div>
          <div class="flex-shrink-0">
            <SheikhLogo class="w-44 h-44 sm:w-64 sm:h-64 logo-glow" />
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED BANNERS -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2 relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-400 to-ink-500 p-6 sm:p-8 text-ink-900 grain">
        <div class="relative">
          <div class="text-[10px] font-bold uppercase tracking-[0.3em] mb-2">العرض الأسبوعي</div>
          <h3 class="font-display text-2xl sm:text-3xl font-bold mb-2">خصم ١٥٪ على البن الإثيوبي</h3>
          <p class="text-sm opacity-80 mb-4">عند شراء ١ كجم أو أكثر</p>
          <NuxtLink to="/shop" class="inline-block px-5 py-2 bg-ink-900 text-cream rounded-full text-sm font-bold hover:scale-105 transition">
            اطلب الآن ←
          </NuxtLink>
        </div>
      </div>
      <NuxtLink to="/blend" class="block rounded-3xl bg-ink-700 dark:bg-ink-800 p-6 text-cream grain group hover:shadow-lift transition">
        <div class="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">✦</div>
        <h3 class="font-display text-xl font-bold mb-1">خلطتك الخاصة</h3>
        <p class="text-sm opacity-80 mb-3">امزج أكثر من نوع</p>
        <span class="text-amber-300 text-sm font-bold">ابدأ الآن ←</span>
      </NuxtLink>
    </div>

    <!-- CATEGORY CHIPS -->
    <div class="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        class="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition"
        :class="selectedCategory === cat
          ? 'coffee-action'
          : 'bg-ink-100 dark:bg-ink-800 hover:bg-ink-200 dark:hover:bg-ink-700'"
      >
        {{ cat }}
      </button>
    </div>

    <!-- PRODUCTS -->
    <section class="mt-10">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h2 class="font-display text-2xl sm:text-3xl font-bold">قائمة القهوة</h2>
          <p class="text-sm text-ink-400 mt-1">{{ featured.length }} نوع متاح</p>
        </div>
        <NuxtLink to="/shop" class="text-sm font-bold text-ink-600 dark:text-amber-300 hover:underline">
          عرض الكل ←
        </NuxtLink>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        <ProductCard
          v-for="p in featured"
          :key="p.id"
          :product="p"
          @open="openProduct?.($event)"
          @quick-add="quickAdd"
        />
      </div>
    </section>

    <!-- VALUE STRIP -->
    <section class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-5 bg-white dark:bg-ink-800 rounded-2xl text-center border border-ink-100 dark:border-ink-700">
        <div class="text-2xl mb-2">🌱</div>
        <div class="font-bold text-sm">حبوب طازجة</div>
        <div class="text-xs text-ink-400 mt-1">محمصة يومياً</div>
      </div>
      <div class="p-5 bg-white dark:bg-ink-800 rounded-2xl text-center border border-ink-100 dark:border-ink-700">
        <div class="text-2xl mb-2">🚚</div>
        <div class="font-bold text-sm">توصيل سريع</div>
        <div class="text-xs text-ink-400 mt-1">خلال 24 ساعة</div>
      </div>
      <div class="p-5 bg-white dark:bg-ink-800 rounded-2xl text-center border border-ink-100 dark:border-ink-700">
        <div class="text-2xl mb-2">✦</div>
        <div class="font-bold text-sm">خلطات حصرية</div>
        <div class="text-xs text-ink-400 mt-1">صنع توقيعك</div>
      </div>
      <div class="p-5 bg-white dark:bg-ink-800 rounded-2xl text-center border border-ink-100 dark:border-ink-700">
        <div class="text-2xl mb-2">🏆</div>
        <div class="font-bold text-sm">+50 سنة خبرة</div>
        <div class="text-xs text-ink-400 mt-1">إرث عائلي</div>
      </div>
    </section>

  </div>
</template>
