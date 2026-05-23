<!-- pages/shop.vue -->
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
const search = ref('')
const sortBy = ref<'default' | 'priceAsc' | 'priceDesc'>('default')

const sortOptions = [
  { label: 'ترتيب افتراضي', value: 'default' },
  { label: 'السعر: الأقل أولاً', value: 'priceAsc' },
  { label: 'السعر: الأعلى أولاً', value: 'priceDesc' },
]

const filtered = computed(() => {
  let list = products
  if (selectedCategory.value !== 'الكل') {
    list = list.filter(p => p.category === selectedCategory.value)
  }
  if (search.value.trim()) {
    const q = search.value.trim()
    list = list.filter(p => p.name.includes(q) || p.origin.includes(q) || p.nameEn.toLowerCase().includes(q.toLowerCase()))
  }
  if (sortBy.value === 'priceAsc') list = [...list].sort((a, b) => a.pricePerKg - b.pricePerKg)
  if (sortBy.value === 'priceDesc') list = [...list].sort((a, b) => b.pricePerKg - a.pricePerKg)
  return list
})

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
  <div class="animate-fade-in pt-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="font-display text-3xl sm:text-4xl font-bold mb-1">المتجر</h1>
      <p class="text-gray-400">تصفّح كل أنواع القهوة المتوفرة لدينا</p>
    </div>

    <!-- Search + Sort -->
    <div class="flex flex-col sm:flex-row gap-3 mb-5">
      <UInput
        v-model="search"
        placeholder="ابحث عن نوع القهوة..."
        icon="i-heroicons-magnifying-glass"
        size="lg"
        class="flex-1"
        :ui="{ rounded: 'rounded-xl', icon: { trailing: { pointer: '' } } }"
      />
      <USelect
        v-model="sortBy"
        :options="sortOptions"
        option-attribute="label"
        value-attribute="value"
        size="lg"
        :ui="{ rounded: 'rounded-xl' }"
        class="sm:w-52"
      />
    </div>

    <!-- Categories -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
      <UButton
        v-for="cat in categories"
        :key="cat"
        :variant="selectedCategory === cat ? 'solid' : 'soft'"
        :color="selectedCategory === cat ? 'primary' : 'gray'"
        size="sm"
        class="flex-shrink-0 rounded-full font-semibold whitespace-nowrap"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </UButton>
    </div>

    <!-- Empty -->
    <div v-if="filtered.length === 0" class="py-16 text-center">
      <div class="text-5xl mb-3 opacity-40">🔍</div>
      <p class="text-gray-400">لا توجد نتائج مطابقة</p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
      <ProductCard
        v-for="p in filtered"
        :key="p.id"
        :product="p"
        @open="openProduct?.($event)"
        @quick-add="quickAdd"
      />
    </div>
  </div>
</template>
