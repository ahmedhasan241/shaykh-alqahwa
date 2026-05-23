<!-- components/BlendBuilder.vue -->
<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useUIStore } from '~/stores/ui'
import { useProducts } from '~/composables/useProducts'
import { useFormat } from '~/composables/useFormat'
const { products, getProductById } = useProducts()
const cart = useCartStore()
const ui = useUIStore()
const { formatPrice } = useFormat()

interface BlendComp { productId: number; weight: number }

const blendName = ref('')
const components = ref<BlendComp[]>([])

const weights = [
  { value: 0.125, label: '⅛' },
  { value: 0.25,  label: '¼' },
  { value: 0.5,   label: '½' },
  { value: 1,     label: '١' },
]

const totalWeight = computed(() => components.value.reduce((s, c) => s + c.weight, 0))
const totalPrice = computed(() => components.value.reduce((s, c) => {
  const p = getProductById(c.productId)
  return s + (p ? p.pricePerKg * c.weight : 0)
}, 0))

const addComponent = () => {
  components.value.push({ productId: products[0].id, weight: 0.25 })
}
const removeComponent = (idx: number) => {
  components.value.splice(idx, 1)
}

const addToCart = () => {
  if (components.value.length === 0) return
  if (components.value.length < 2) {
    ui.showToast('أضف نوعين على الأقل لصنع خلطة', 'error')
    return
  }
  const comps = components.value.map(c => {
    const p = getProductById(c.productId)!
    return { productId: p.id, name: p.name, weight: c.weight, pricePerKg: p.pricePerKg }
  })
  cart.add({
    type: 'blend',
    name: blendName.value || `خلطة مخصصة (${comps.length} أنواع)`,
    gradient: 'linear-gradient(135deg, #E5A84C, #5C4126)',
    weight: totalWeight.value,
    price: totalPrice.value,
    components: comps,
  })
  components.value = []
  blendName.value = ''
  ui.showToast('تمت إضافة الخلطة للسلة ✦')
  cart.open()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Hero banner -->
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-ink-700 via-ink-600 to-ink-800 dark:from-ink-800 dark:via-ink-900 dark:to-black p-6 sm:p-10 text-cream grain">
      <div class="relative">
        <div class="text-amber-300 text-xs font-bold tracking-[0.3em] mb-3">✦ EXCLUSIVE ✦</div>
        <h1 class="font-display text-3xl sm:text-5xl font-bold mb-3">اصنع خلطتك الخاصة</h1>
        <p class="text-cream/80 max-w-xl leading-relaxed">امزج أنواع القهوة المفضلة لديك بالنسب التي تريدها واصنع توقيعك الخاص.</p>
      </div>
      <!-- Decorative -->
      <div class="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl"></div>
      <div class="absolute -top-6 -right-4 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl"></div>
    </div>

    <!-- Builder -->
    <div class="bg-white dark:bg-ink-800 rounded-3xl p-5 sm:p-7 border border-ink-100 dark:border-ink-700 shadow-soft">
      <!-- Name input -->
      <div class="mb-5">
        <label class="block text-sm font-semibold mb-2">اسم الخلطة <span class="text-ink-400 font-normal">(اختياري)</span></label>
        <input
          v-model="blendName"
          type="text"
          placeholder="مثال: خلطة الصباح المنعشة"
          class="w-full px-4 py-3 rounded-xl bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-700 focus:border-amber-400 outline-none transition"
        />
      </div>

      <!-- Components -->
      <div class="space-y-3 mb-5">
        <TransitionGroup
          enter-active-class="transition duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 absolute"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-for="(comp, idx) in components"
            :key="`${idx}-${comp.productId}`"
            class="bg-ink-50 dark:bg-ink-900 rounded-2xl p-4 border border-ink-100 dark:border-ink-700"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden"
                :style="{ background: getProductById(comp.productId)?.gradient }"
              >
                <CoffeeIllustration
                  :variant="getProductById(comp.productId)?.image || ''"
                  :accent="getProductById(comp.productId)?.accent"
                />
              </div>
              <div class="flex-1 min-w-0">
                <select
                  v-model="comp.productId"
                  class="w-full font-display font-bold bg-transparent outline-none mb-2 cursor-pointer"
                >
                  <option v-for="p in products" :key="p.id" :value="p.id" class="bg-white dark:bg-ink-800">
                    {{ p.name }} — {{ formatPrice(p.pricePerKg) }} ج/كجم
                  </option>
                </select>
                <div class="flex flex-wrap items-center gap-1.5">
                  <button
                    v-for="w in weights"
                    :key="w.value"
                    @click="comp.weight = w.value"
                    class="px-3 py-1 rounded-lg text-xs font-bold transition"
                    :class="comp.weight === w.value
                      ? 'bg-ink-700 dark:bg-amber-400 text-cream dark:text-ink-900'
                      : 'bg-ink-100 dark:bg-ink-800 hover:bg-ink-200'"
                  >
                    {{ w.label }} كجم
                  </button>
                </div>
                <div class="mt-2 flex items-center gap-2 text-sm">
                  <span class="text-ink-400">السعر:</span>
                  <span class="font-bold text-ink-700 dark:text-amber-300">
                    {{ formatPrice((getProductById(comp.productId)?.pricePerKg || 0) * comp.weight) }} ج
                  </span>
                </div>
              </div>
              <button
                @click="removeComponent(idx)"
                class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 transition hover:scale-110"
                aria-label="حذف"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                  <path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </TransitionGroup>

        <button
          @click="addComponent"
          class="w-full py-4 rounded-2xl border-2 border-dashed border-ink-300 dark:border-ink-600 hover:border-amber-400 dark:hover:border-amber-400 text-ink-500 dark:text-ink-300 hover:text-amber-500 dark:hover:text-amber-300 font-semibold flex items-center justify-center gap-2 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" d="M12 4v16m8-8H4"/>
          </svg>
          إضافة نوع للخلطة
        </button>
      </div>

      <!-- Summary -->
      <div
        v-if="components.length > 0"
        class="bg-gradient-to-br from-ink-700 to-ink-800 dark:from-ink-900 dark:to-black text-cream rounded-2xl p-5 grain"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="text-cream/70 text-sm">الوزن الإجمالي</span>
          <span class="font-bold text-xl">{{ totalWeight.toFixed(3) }} كجم</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-cream/70 text-sm">السعر الإجمالي</span>
          <span class="font-display font-bold text-2xl text-amber-300">{{ formatPrice(totalPrice) }} ج</span>
        </div>
        <button
          @click="addToCart"
          :disabled="components.length === 0"
          class="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-ink-900 font-bold rounded-xl disabled:opacity-50 transition"
        >
          إضافة الخلطة إلى السلة
        </button>
      </div>
    </div>
  </div>
</template>
