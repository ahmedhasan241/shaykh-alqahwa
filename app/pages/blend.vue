<!-- pages/blend.vue -->
<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { useProducts } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useFormat } from '~/composables/useFormat'

definePageMeta({ layout: 'default' })

const { products, getProductById } = useProducts()
const cart = useCartStore()
const { formatPrice } = useFormat()
const toast = useToast()

interface BlendComp { productId: number; weight: number }

const blendName = ref('')
const components = ref<BlendComp[]>([])
const step = ref<1 | 2 | 3>(1) // 1: pick coffees, 2: name it, 3: confirm

const weightOptions = [
  { value: 0.125, label: '⅛', sub: '125جم' },
  { value: 0.25,  label: '¼', sub: '250جم' },
  { value: 0.5,   label: '½', sub: '500جم' },
  { value: 1,     label: '١', sub: '1كجم' },
]

const totalWeight = computed(() => components.value.reduce((s, c) => s + c.weight, 0))
const totalPrice  = computed(() => components.value.reduce((s, c) => {
  const p = getProductById(c.productId)
  return s + (p ? p.pricePerKg * c.weight : 0)
}, 0))

const canProceed = computed(() => components.value.length >= 2)

function addComponent() {
  // pick a product not already fully used
  const usedIds = components.value.map(c => c.productId)
  const available = products.find(p => !usedIds.includes(p.id)) ?? products[0]
  components.value.push({ productId: available.id, weight: 0.25 })
}

function removeComponent(idx: number) {
  components.value.splice(idx, 1)
}

function setWeight(idx: number, val: number) {
  components.value[idx].weight = val
}

const generatedName = computed(() => {
  if (components.value.length === 0) return ''
  const names = components.value.map(c => getProductById(c.productId)?.origin ?? '').filter(Boolean)
  return `خلطة ${names.slice(0, 2).join(' و')}`
})

const finalName = computed(() => blendName.value.trim() || generatedName.value)

function addToCart() {
  const comps = components.value.map(c => {
    const p = getProductById(c.productId)!
    return { productId: p.id, name: p.name, weight: c.weight, pricePerKg: p.pricePerKg }
  })
  cart.add({
    type: 'blend',
    name: finalName.value,
    gradient: 'linear-gradient(135deg, #E5A84C 30%, #5C4126 100%)',
    weight: totalWeight.value,
    price: totalPrice.value,
    components: comps,
  })
  toast.add({ title: 'تمت إضافة خلطتك للسلة ✦', icon: 'i-heroicons-check-circle', color: 'primary' })
  // Reset
  components.value = []
  blendName.value = ''
  step.value = 1
}

function nextStep() {
  if (step.value === 1 && canProceed.value) step.value = 2
  else if (step.value === 2) step.value = 3
}
function prevStep() {
  if (step.value > 1) step.value = (step.value - 1) as 1 | 2 | 3
}
</script>

<template>
  <div class="animate-fade-in pt-4 pb-10">

    <!-- ── Hero Banner ── -->
    <div class="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 dark:from-gray-900 dark:to-black grain">
      <!-- Glow orbs -->
      <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary-400/20 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-primary-600/15 blur-3xl pointer-events-none" />

      <div class="relative px-6 py-8 sm:px-10 sm:py-12 text-white">
        <UBadge label="✦ حصري" color="primary" variant="soft" class="mb-4 rounded-full px-3" />
        <h1 class="font-display text-3xl sm:text-5xl font-bold leading-tight mb-3">
          اصنع خلطتك<br>
          <span class="text-primary-400">الخاصة</span>
        </h1>
        <p class="text-white/70 text-sm sm:text-base max-w-md leading-relaxed">
          امزج أنواع قهوتك المفضلة بالنسب التي تريدها وأضفها للسلة بلمسة واحدة.
        </p>

        <!-- Step indicators -->
        <div class="flex items-center gap-3 mt-6">
          <div
            v-for="s in [1,2,3]"
            :key="s"
            class="flex items-center gap-2"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              :class="step >= s
                ? 'bg-primary-400 text-gray-900'
                : 'bg-white/10 text-white/40'"
            >
              <UIcon v-if="step > s" name="i-heroicons-check" class="w-4 h-4" />
              <span v-else>{{ s }}</span>
            </div>
            <span
              class="text-xs font-medium hidden sm:block"
              :class="step >= s ? 'text-primary-300' : 'text-white/30'"
            >{{ ['اختر الأنواع', 'سمّ خلطتك', 'تأكيد'][s-1] }}</span>
            <UIcon v-if="s < 3" name="i-heroicons-chevron-left" class="w-3 h-3 text-white/20" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── STEP 1: Pick coffees ── -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="step === 1" key="step1">

        <!-- Empty nudge -->
        <div v-if="components.length === 0" class="mb-6 p-5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
          <div class="text-4xl mb-2">☕</div>
          <p class="text-gray-500 dark:text-gray-400 text-sm">ابدأ بإضافة نوعين على الأقل لصنع خلطتك</p>
        </div>

        <!-- Component cards -->
        <div class="space-y-3 mb-4">
          <TransitionGroup name="list" tag="div" class="space-y-3">
            <div
              v-for="(comp, idx) in components"
              :key="`comp-${idx}`"
              class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
            >
              <!-- Product header row -->
              <div class="flex items-center gap-3 p-4 pb-3">
                <!-- Mini thumbnail -->
                <div
                  class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
                  :style="{ background: getProductById(comp.productId)?.gradient }"
                >
                  <CoffeeIllustration
                    :variant="getProductById(comp.productId)?.image || ''"
                    :accent="getProductById(comp.productId)?.accent"
                  />
                </div>

                <!-- Select -->
                <div class="flex-1 min-w-0">
                  <USelect
                    v-model="comp.productId"
                    :options="products.map(p => ({ label: p.name, value: p.id }))"
                    size="sm"
                    :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }"
                  />
                  <p class="text-[10px] text-gray-400 mt-1 truncate">
                    {{ getProductById(comp.productId)?.origin }} ·
                    {{ formatPrice((getProductById(comp.productId)?.pricePerKg ?? 0) * comp.weight) }} ج
                  </p>
                </div>

                <!-- Remove -->
                <UButton
                  icon="i-heroicons-x-mark"
                  color="red"
                  variant="ghost"
                  size="xs"
                  class="rounded-full flex-shrink-0"
                  @click="removeComponent(idx)"
                />
              </div>

              <!-- Weight pills -->
              <div class="flex gap-2 px-4 pb-4">
                <button
                  v-for="w in weightOptions"
                  :key="w.value"
                  class="flex-1 py-2 rounded-xl border-2 text-center transition-all duration-200 active:scale-95"
                  :class="comp.weight === w.value
                    ? 'border-primary-400 bg-primary-400/10 dark:bg-primary-400/20 text-primary-600 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'"
                  @click="setWeight(idx, w.value)"
                >
                  <div class="font-bold text-sm">{{ w.label }}</div>
                  <div class="text-[9px] opacity-60 mt-0.5">{{ w.sub }}</div>
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Add button -->
        <UButton
          label="إضافة نوع آخر"
          icon="i-heroicons-plus-circle"
          variant="outline"
          color="gray"
          block
          size="lg"
          class="rounded-2xl border-dashed mb-6"
          :disabled="components.length >= 6"
          @click="addComponent"
        />

        <!-- Live summary bar -->
        <Transition name="fade-slide">
          <div
            v-if="components.length >= 1"
            class="bg-gray-900 dark:bg-gray-800 rounded-2xl p-4 flex items-center justify-between mb-4"
          >
            <div class="text-white">
              <div class="text-xs text-gray-400 mb-0.5">الإجمالي</div>
              <div class="font-bold text-xl text-primary-400">{{ formatPrice(totalPrice) }} ج</div>
              <div class="text-xs text-gray-400">{{ totalWeight.toFixed(3) }} كجم</div>
            </div>
            <div class="flex flex-wrap gap-1 max-w-[55%] justify-end">
              <UBadge
                v-for="(c, i) in components"
                :key="i"
                :label="getProductById(c.productId)?.origin ?? ''"
                color="primary"
                variant="soft"
                size="xs"
                class="rounded-full"
              />
            </div>
          </div>
        </Transition>

        <!-- Proceed -->
        <UButton
          label="التالي: تسمية الخلطة"
          icon="i-heroicons-arrow-left"
          trailing-icon
          color="primary"
          block
          size="lg"
          class="rounded-2xl font-bold"
          :disabled="!canProceed"
          @click="nextStep"
        />
        <p v-if="!canProceed && components.length > 0" class="text-center text-xs text-gray-400 mt-2">
          أضف نوعاً آخر على الأقل للمتابعة
        </p>
      </div>
    </Transition>

    <!-- ── STEP 2: Name it ── -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="step === 2" key="step2" class="space-y-5">
        <div class="text-center py-4">
          <div class="text-5xl mb-3">✦</div>
          <h2 class="font-display text-2xl font-bold mb-1">سمّ خلطتك</h2>
          <p class="text-gray-400 text-sm">اختر اسماً مميزاً لخلطتك أو اتركه فارغاً</p>
        </div>

        <UInput
          v-model="blendName"
          :placeholder="generatedName || 'مثال: خلطة الصباح الذهبي'"
          size="xl"
          icon="i-heroicons-pencil"
          :ui="{ rounded: 'rounded-2xl', base: 'text-lg font-semibold' }"
        />

        <!-- Preview card -->
        <div class="rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400/80 to-gray-800 p-5 text-white grain">
          <div class="text-xs text-primary-200 mb-1 tracking-widest">خلطتك المخصصة</div>
          <div class="font-display text-2xl font-bold mb-3">{{ finalName }}</div>
          <div class="flex flex-wrap gap-2 mb-4">
            <div
              v-for="(c, i) in components"
              :key="i"
              class="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-xs"
            >
              <span>{{ getProductById(c.productId)?.name }}</span>
              <span class="opacity-60">{{ c.weight }}كجم</span>
            </div>
          </div>
          <div class="flex justify-between items-center border-t border-white/20 pt-3">
            <span class="text-white/60 text-sm">الإجمالي</span>
            <span class="font-bold text-xl text-primary-300">{{ formatPrice(totalPrice) }} ج</span>
          </div>
        </div>

        <div class="flex gap-3">
          <UButton
            label="رجوع"
            icon="i-heroicons-arrow-right"
            variant="soft"
            color="gray"
            size="lg"
            class="rounded-2xl flex-1"
            @click="prevStep"
          />
          <UButton
            label="مراجعة الطلب"
            icon="i-heroicons-arrow-left"
            trailing-icon
            color="primary"
            size="lg"
            class="rounded-2xl flex-1 font-bold"
            @click="nextStep"
          />
        </div>
      </div>
    </Transition>

    <!-- ── STEP 3: Confirm ── -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="step === 3" key="step3" class="space-y-5">
        <div class="text-center py-4">
          <div class="text-5xl mb-3">🎉</div>
          <h2 class="font-display text-2xl font-bold mb-1">خلطتك جاهزة!</h2>
          <p class="text-gray-400 text-sm">راجع التفاصيل ثم أضفها للسلة</p>
        </div>

        <!-- Full summary -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="bg-gradient-to-br from-primary-400 to-gray-700 p-4 text-white grain">
            <div class="text-xs text-primary-100 mb-1">✦ خلطة مخصصة</div>
            <div class="font-display text-xl font-bold">{{ finalName }}</div>
          </div>
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div
              v-for="(c, i) in components"
              :key="i"
              class="flex items-center gap-3 p-4"
            >
              <div
                class="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden"
                :style="{ background: getProductById(c.productId)?.gradient }"
              >
                <CoffeeIllustration
                  :variant="getProductById(c.productId)?.image || ''"
                  :accent="getProductById(c.productId)?.accent"
                />
              </div>
              <div class="flex-1">
                <div class="font-semibold text-sm">{{ getProductById(c.productId)?.name }}</div>
                <div class="text-xs text-gray-400">{{ c.weight }} كجم · {{ getProductById(c.productId)?.origin }}</div>
              </div>
              <div class="font-bold text-primary-500 text-sm">
                {{ formatPrice((getProductById(c.productId)?.pricePerKg ?? 0) * c.weight) }} ج
              </div>
            </div>
          </div>
          <div class="p-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
            <div>
              <div class="text-xs text-gray-400">الوزن الإجمالي</div>
              <div class="font-semibold">{{ totalWeight.toFixed(3) }} كجم</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-400">السعر الإجمالي</div>
              <div class="font-bold text-2xl text-primary-500">{{ formatPrice(totalPrice) }} ج</div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <UButton
            label="تعديل"
            icon="i-heroicons-pencil"
            variant="soft"
            color="gray"
            size="lg"
            class="rounded-2xl"
            @click="prevStep"
          />
          <UButton
            label="إضافة الخلطة للسلة"
            icon="i-heroicons-shopping-bag"
            color="primary"
            size="lg"
            block
            class="rounded-2xl font-bold"
            @click="addToCart"
          />
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
