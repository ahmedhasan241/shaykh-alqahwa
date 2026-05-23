<!-- components/ProductSheet.vue -->
<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import type { Product } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useUIStore } from '~/stores/ui'
import { useFormat } from '~/composables/useFormat'

const props = defineProps<{ product: Product | null }>()
const emit = defineEmits<{ close: [] }>()

const cart = useCartStore()
const ui = useUIStore()
const { formatPrice } = useFormat()
const toast = useToast()

const purchaseMode = ref<'weight' | 'budget'>('weight')
const selectedWeight = ref(0.25)
const customBudget = ref(100)

const weights = [
  { value: 0.125, label: '⅛ كجم', sub: '125 جم' },
  { value: 0.25,  label: '¼ كجم', sub: '250 جم' },
  { value: 0.5,   label: '½ كجم', sub: '500 جم' },
  { value: 1,     label: '١ كجم', sub: '1000 جم' },
]

const budgetWeight = computed(() => {
  if (!props.product || !customBudget.value) return 0
  return customBudget.value / props.product.pricePerKg
})

watch(() => props.product, (p) => {
  if (p) {
    purchaseMode.value = 'weight'
    selectedWeight.value = 0.25
    customBudget.value = 100
    if (import.meta.client) document.body.style.overflow = 'hidden'
  } else {
    if (import.meta.client) document.body.style.overflow = ''
  }
})

const addToCart = () => {
  if (!props.product) return
  const weight = purchaseMode.value === 'weight' ? selectedWeight.value : budgetWeight.value
  const price  = purchaseMode.value === 'weight'
    ? props.product.pricePerKg * selectedWeight.value
    : customBudget.value
  if (weight <= 0) {
    toast.add({ title: 'من فضلك أدخل قيمة صحيحة', icon: 'i-heroicons-exclamation-circle', color: 'red' })
    return
  }
  cart.add({
    type: 'single',
    productId: props.product.id,
    name: props.product.name,
    image: props.product.image,
    gradient: props.product.gradient,
    accent: props.product.accent,
    weight,
    pricePerKg: props.product.pricePerKg,
    price,
  })
  toast.add({ title: 'تمت الإضافة للسلة', icon: 'i-heroicons-check-circle', color: 'primary' })
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100" leave-to-class="opacity-0"
  >
    <div
      v-if="product"
      @click="emit('close')"
      class="fixed inset-0 z-50 bg-black/60 blur-backdrop flex items-end sm:items-center justify-center sm:p-4"
    >
      <div
        @click.stop
        class="bg-cream dark:bg-ink-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto animate-slide-up sm:animate-scale-in"
      >
        <div class="drag-handle sm:hidden" />

        <!-- Hero -->
        <div class="relative aspect-[5/3] overflow-hidden sm:rounded-t-3xl" :style="{ background: product.gradient }">
          <div class="absolute inset-0 grain" />
          <div class="absolute inset-0 flex items-center justify-center p-8">
            <CoffeeIllustration :variant="product.image" :accent="product.accent" />
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            variant="solid"
            color="white"
            size="sm"
            class="absolute top-4 left-4 rounded-full shadow"
            @click="emit('close')"
          />
          <UBadge
            v-if="product.badge"
            :label="product.badge"
            color="primary"
            variant="solid"
            class="absolute top-4 right-4"
          />
        </div>

        <!-- Body -->
        <div class="p-6">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs text-ink-400 font-semibold uppercase tracking-widest">{{ product.origin }}</span>
            <span class="text-ink-300">·</span>
            <span class="text-xs text-ink-400 font-semibold">{{ product.roast }}</span>
          </div>
          <h2 class="font-display text-3xl font-bold mb-2">{{ product.name }}</h2>
          <p class="text-ink-500 dark:text-ink-200 leading-relaxed mb-5">{{ product.description }}</p>

          <!-- Flavor notes -->
          <div class="flex flex-wrap gap-2 mb-6">
            <UBadge
              v-for="note in product.notes"
              :key="note"
              :label="note"
              color="gray"
              variant="soft"
              size="sm"
            />
          </div>

          <!-- Mode toggle -->
          <div class="flex bg-ink-100 dark:bg-ink-800 p-1 rounded-2xl mb-4">
            <UButton
              label="حسب الوزن"
              :variant="purchaseMode === 'weight' ? 'solid' : 'ghost'"
              :color="purchaseMode === 'weight' ? 'white' : 'gray'"
              size="sm"
              class="flex-1 rounded-xl justify-center"
              :class="purchaseMode === 'weight' ? 'shadow-soft' : ''"
              @click="purchaseMode = 'weight'"
            />
            <UButton
              label="حسب الميزانية"
              :variant="purchaseMode === 'budget' ? 'solid' : 'ghost'"
              :color="purchaseMode === 'budget' ? 'white' : 'gray'"
              size="sm"
              class="flex-1 rounded-xl justify-center"
              :class="purchaseMode === 'budget' ? 'shadow-soft' : ''"
              @click="purchaseMode = 'budget'"
            />
          </div>

          <!-- Weight selector -->
          <div v-if="purchaseMode === 'weight'">
            <label class="block text-sm font-semibold mb-2">اختر الوزن</label>
            <div class="grid grid-cols-4 gap-2 mb-4">
              <UButton
                v-for="w in weights"
                :key="w.value"
                :variant="selectedWeight === w.value ? 'solid' : 'outline'"
                :color="selectedWeight === w.value ? 'gray' : 'gray'"
                size="sm"
                class="flex-col h-auto py-3 rounded-2xl leading-tight"
                :class="selectedWeight === w.value ? 'coffee-action border-transparent' : ''"
                @click="selectedWeight = w.value"
              >
                <div>{{ w.label }}</div>
                <div class="text-[9px] opacity-70 font-normal">{{ w.sub }}</div>
              </UButton>
            </div>
            <div class="bg-ink-100 dark:bg-ink-800 rounded-2xl p-4 flex justify-between items-center">
              <span class="text-sm text-ink-500 dark:text-ink-200">الإجمالي</span>
              <span class="font-display font-bold text-2xl text-ink-700 dark:text-amber-300">
                {{ formatPrice(product.pricePerKg * selectedWeight) }} ج
              </span>
            </div>
          </div>

          <!-- Budget mode -->
          <div v-else>
            <label class="block text-sm font-semibold mb-2">حدّد ميزانيتك (جنيه مصري)</label>
            <UInput
              v-model.number="customBudget"
              type="number"
              placeholder="مثال: 100"
              size="lg"
              trailing-icon="i-heroicons-currency-dollar"
              :ui="{ rounded: 'rounded-2xl' }"
              class="mb-4"
            />
            <div class="bg-gradient-to-br from-amber-400/20 to-ink-400/10 dark:from-amber-400/15 dark:to-ink-400/10 rounded-2xl p-4">
              <div class="text-xs text-ink-400 mb-1">ستحصل على</div>
              <div class="font-display font-bold text-3xl text-ink-700 dark:text-amber-300">
                {{ budgetWeight.toFixed(3) }} كجم
              </div>
              <div class="text-xs text-ink-400 mt-1">من {{ product.name }}</div>
            </div>
          </div>

          <!-- CTA -->
          <UButton
            label="إضافة إلى السلة"
            color="gray"
            size="lg"
            block
            class="coffee-action mt-5 rounded-2xl font-bold"
            @click="addToCart"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
