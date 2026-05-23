<!-- pages/blend.vue -->
<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { useProducts } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useFormat } from '~/composables/useFormat'

definePageMeta({ layout: 'default' })

type BlendMode = 'grams' | 'price'

interface BlendComp {
  productId: number
  mode: BlendMode
  amount: number
}

const { products, getProductById } = useProducts()
const cart = useCartStore()
const { formatPrice } = useFormat()
const toast = useToast()

const blendName = ref('')
const components = ref<BlendComp[]>([])
const step = ref<1 | 2 | 3>(1)

const totalWeight = computed<number>(() => components.value.reduce((sum: number, comp: BlendComp) => sum + componentWeightKg(comp), 0))
const totalPrice = computed<number>(() => components.value.reduce((sum: number, comp: BlendComp) => sum + componentPrice(comp), 0))
const canProceed = computed<boolean>(() => components.value.length >= 2 && components.value.every((c: BlendComp) => c.amount > 0 && getProductById(c.productId)))

const generatedName = computed(() => {
  if (!components.value.length) return ''
  const origins = components.value.map((c: BlendComp) => getProductById(c.productId)?.origin ?? '').filter(Boolean)
  return `خلطة ${origins.slice(0, 2).join(' و')}`
})

const finalName = computed(() => blendName.value.trim() || generatedName.value)

function componentWeightKg(comp: BlendComp) {
  const product = getProductById(comp.productId)
  if (!product) return 0
  return comp.mode === 'grams' ? comp.amount / 1000 : comp.amount / product.pricePerKg
}

function componentWeightGrams(comp: BlendComp) {
  return componentWeightKg(comp) * 1000
}

function componentPrice(comp: BlendComp) {
  const product = getProductById(comp.productId)
  if (!product) return 0
  return comp.mode === 'grams' ? (comp.amount / 1000) * product.pricePerKg : comp.amount
}

function addComponent() {
  const usedIds = components.value.map((c: BlendComp) => c.productId)
  const available = products.find(p => !usedIds.includes(p.id)) ?? products[0]!
  components.value.push({ productId: available.id, mode: 'grams', amount: 250 })
}

function removeComponent(idx: number) {
  components.value.splice(idx, 1)
}

function setPresetGram(idx: number, grams: number) {
  const comp = components.value[idx]
  if (!comp) return
  comp.mode = 'grams'
  comp.amount = grams
}

function nextStep() {
  if (step.value === 1 && canProceed.value) step.value = 2
  else if (step.value === 2) step.value = 3
}

function prevStep() {
  if (step.value > 1) step.value = (step.value - 1) as 1 | 2 | 3
}

function changeProduct(idx: number, e: Event) {
  const comp = components.value[idx]
  if (!comp) return
  comp.productId = Number((e.target as HTMLSelectElement).value)
}

function addToCart() {
  const comps = components.value.map((c: BlendComp) => {
    const product = getProductById(c.productId)!
    return {
      productId: product.id,
      name: product.name,
      weight: componentWeightKg(c),
      pricePerKg: product.pricePerKg,
    }
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
  components.value = []
  blendName.value = ''
  step.value = 1
}
</script>

<template>
  <div class="animate-fade-in pt-4 pb-20 lg:pb-12">

    <!-- ── Hero Banner ── -->
    <div class="relative rounded-3xl overflow-hidden mb-6 bg-gradient-to-br from-ink-800 via-ink-700 to-ink-900 grain">
      <div class="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

      <div class="relative px-5 py-7 sm:px-10 sm:py-10 text-white">
        <UBadge label="✦ حصري" color="primary" variant="soft" class="mb-3 rounded-full px-3" />
        <h1 class="font-display text-2xl sm:text-4xl font-bold leading-tight mb-2">
          اصنع خلطتك<br>
          <span class="text-amber-400">الخاصة</span>
        </h1>
        <p class="text-white/70 text-sm max-w-md leading-relaxed">
          امزج أنواع قهوتك المفضلة بالنسب التي تريدها وأضفها للسلة بلمسة واحدة.
        </p>

        <!-- Step indicators -->
        <div class="flex items-center gap-2 sm:gap-3 mt-5">
          <div v-for="s in [1,2,3]" :key="s" class="flex items-center gap-1.5 sm:gap-2">
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              :class="step >= s ? 'bg-amber-400 text-ink-900' : 'bg-white/10 text-white/40'"
            >
              <UIcon v-if="step > s" name="i-heroicons-check" class="w-4 h-4" />
              <span v-else>{{ s }}</span>
            </div>
            <span
              class="text-xs font-medium hidden sm:block transition-colors"
              :class="step >= s ? 'text-amber-300' : 'text-white/30'"
            >{{ ['اختر الأنواع', 'سمّ خلطتك', 'تأكيد'][s-1] }}</span>
            <UIcon v-if="s < 3" name="i-heroicons-chevron-left" class="w-3 h-3 text-white/20" />
          </div>
        </div>
      </div>
    </div>

    <!-- ── STEP 1: Pick coffees ── -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="step === 1" key="step1" class="space-y-4">

        <!-- Mobile summary strip -->
        <div v-if="components.length > 0" class="xl:hidden flex items-center justify-between rounded-2xl bg-ink-900 dark:bg-ink-950 border border-ink-700 px-4 py-3">
          <span class="text-xs text-slate-400 uppercase tracking-wider">الإجمالي</span>
          <div class="flex items-center gap-4">
            <span class="text-sm text-slate-300">{{ totalWeight.toFixed(2) }} كجم</span>
            <span class="text-base font-bold text-amber-400">{{ formatPrice(totalPrice) }} ج</span>
          </div>
        </div>

        <div class="grid gap-5 xl:grid-cols-[1fr_320px]">

          <!-- Left column -->
          <div class="space-y-4 min-w-0">

            <!-- Status card -->
            <div class="rounded-3xl border border-ink-700 dark:border-slate-800 bg-ink-900 dark:bg-slate-950 p-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div class="text-xs uppercase tracking-widest text-amber-400 mb-1.5">ابدأ بخلطة جديدة</div>
                  <h2 class="font-display text-xl sm:text-2xl font-bold text-white">اختر نوعين أو أكثر</h2>
                  <p class="mt-2 text-xs text-slate-400 max-w-md leading-relaxed">حدد كل نوع بالجرام أو بالسعر، وسيتم تحديث السعر والوزن مباشرةً.</p>
                </div>
                <div class="rounded-2xl border border-ink-700 dark:border-slate-800 bg-ink-800 dark:bg-slate-900 p-3 sm:p-4 text-right shrink-0">
                  <div class="text-[10px] uppercase tracking-widest text-slate-500">الحالة الحالية</div>
                  <div class="mt-1.5 text-xl font-bold text-amber-400">{{ formatPrice(totalPrice) }} ج</div>
                  <div class="text-xs text-slate-400">{{ totalWeight.toFixed(3) }} كجم</div>
                </div>
              </div>
            </div>

            <!-- Components card -->
            <div class="rounded-3xl border border-ink-700 dark:border-slate-800 bg-ink-900 dark:bg-slate-950 p-4 sm:p-5">
              <div class="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div class="text-xs uppercase tracking-widest text-amber-400">مكونات الخلطة</div>
                  <div class="text-base font-semibold text-white">{{ components.length }} نوع</div>
                </div>
                <button
                  class="flex items-center gap-1.5 rounded-full border border-amber-400/40 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-400/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  :disabled="components.length >= 6"
                  @click="addComponent"
                >
                  <UIcon name="i-heroicons-plus" class="w-3.5 h-3.5" />
                  أضف نوع
                </button>
              </div>

              <TransitionGroup name="list" tag="div" class="space-y-3">
                <!-- Empty state -->
                <div
                  v-if="components.length === 0"
                  key="empty"
                  class="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center text-slate-400"
                >
                  <div class="text-4xl mb-3">☕</div>
                  <div class="text-sm">أضف نوعين على الأقل لتكوين خلطتك</div>
                </div>

                <!-- Component cards -->
                <div
                  v-for="(comp, idx) in components"
                  :key="`comp-${idx}`"
                  class="relative rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <!-- Remove -->
                  <button
                    class="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-950/40 hover:text-red-400 transition"
                    @click="removeComponent(idx)"
                  >
                    <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                  </button>

                  <div class="space-y-4">
                    <!-- Product selector -->
                    <div class="flex items-center gap-3 pr-8">
                      <div
                        class="w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden"
                        :style="{ background: getProductById(comp.productId)?.gradient }"
                      >
                        <CoffeeIllustration
                          :variant="getProductById(comp.productId)?.image || ''"
                          :accent="getProductById(comp.productId)?.accent"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <select
                          :value="comp.productId"
                          @change="changeProduct(idx, $event)"
                          class="w-full rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-semibold px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/60"
                        >
                          <option
                            v-for="p in products"
                            :key="p.id"
                            :value="p.id"
                            :disabled="components.some((c, ci) => c.productId === p.id && ci !== idx)"
                          >
                            {{ p.name }} — {{ p.origin }}
                          </option>
                        </select>
                        <p class="mt-1 text-xs text-slate-500">
                          {{ formatPrice(getProductById(comp.productId)?.pricePerKg || 0) }} ج / كجم
                        </p>
                      </div>
                    </div>

                    <!-- Mode toggle -->
                    <div class="flex rounded-full border border-slate-700 overflow-hidden text-sm bg-slate-950">
                      <button
                        type="button"
                        @click="comp.mode = 'grams'"
                        class="flex-1 py-2.5 text-sm font-semibold transition"
                        :class="comp.mode === 'grams'
                          ? 'rounded-full bg-amber-400 text-ink-900'
                          : 'text-slate-400 hover:bg-slate-800'"
                      >
                        بالجرام
                      </button>
                      <button
                        type="button"
                        @click="comp.mode = 'price'"
                        class="flex-1 py-2.5 text-sm font-semibold transition"
                        :class="comp.mode === 'price'
                          ? 'rounded-full bg-amber-400 text-ink-900'
                          : 'text-slate-400 hover:bg-slate-800'"
                      >
                        بالسعر
                      </button>
                    </div>

                    <!-- Amount input -->
                    <div class="grid grid-cols-[1fr_auto] gap-2 items-stretch">
                      <UInput
                        v-model.number="comp.amount"
                        type="number"
                        :min="comp.mode === 'grams' ? 10 : 5"
                        :step="comp.mode === 'grams' ? 10 : 1"
                        :placeholder="comp.mode === 'grams' ? '250' : '275'"
                        :label="comp.mode === 'grams' ? 'الكمية بالجرام' : 'المبلغ بالجنيه'"
                        size="lg"
                        :ui="{ rounded: 'rounded-xl', base: 'font-semibold' }"
                      />
                      <div class="h-full min-h-[2.75rem] flex items-center justify-center rounded-xl bg-slate-800 px-4 text-sm font-semibold text-slate-200 border border-slate-700">
                        {{ comp.mode === 'grams' ? 'جم' : 'ج' }}
                      </div>
                    </div>

                    <!-- Price/weight display -->
                    <div class="grid grid-cols-2 gap-2">
                      <div class="rounded-xl bg-slate-950 border border-slate-800 p-3">
                        <div class="text-[10px] uppercase tracking-widest text-slate-500">السعر</div>
                        <div class="mt-1 text-base font-bold text-white">{{ formatPrice(componentPrice(comp)) }} ج</div>
                      </div>
                      <div class="rounded-xl bg-slate-950 border border-slate-800 p-3">
                        <div class="text-[10px] uppercase tracking-widest text-slate-500">الوزن</div>
                        <div class="mt-1 text-base font-bold text-white">{{ componentWeightGrams(comp).toFixed(0) }} جم</div>
                      </div>
                    </div>

                    <!-- Preset buttons -->
                    <div class="flex flex-wrap gap-1.5">
                      <button
                        v-for="gram in [100, 250, 500, 1000]"
                        :key="gram"
                        type="button"
                        class="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-amber-400/10 hover:border-amber-400/60 hover:text-amber-400"
                        @click="setPresetGram(idx, gram)"
                      >
                        {{ gram }} جم
                      </button>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
          </div>

          <!-- Right: aside (sticky on xl) -->
          <aside class="space-y-4 xl:sticky xl:top-24 self-start">
            <div class="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <h2 class="text-sm font-semibold text-white mb-4">ملخص الخلطة</h2>
              <div class="space-y-3">
                <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                  <div class="text-xs text-slate-500 uppercase tracking-widest">السعر الإجمالي</div>
                  <div class="mt-1.5 text-2xl font-bold text-amber-400">{{ formatPrice(totalPrice) }} ج</div>
                </div>
                <div class="rounded-2xl bg-slate-900 border border-slate-800 p-4">
                  <div class="text-xs text-slate-500 uppercase tracking-widest">الوزن الإجمالي</div>
                  <div class="mt-1.5 text-2xl font-bold text-white">{{ totalWeight.toFixed(3) }} كجم</div>
                </div>
                <div class="rounded-2xl bg-amber-400/5 border border-amber-400/20 p-4 text-sm text-slate-300">
                  <div class="text-xs uppercase tracking-widest font-semibold mb-2 text-amber-400">نصيحة</div>
                  <p class="leading-relaxed text-xs">استخدم الأسعار للتحكم في التكلفة، أو الجرامات للحصول على وزن محدد.</p>
                </div>
              </div>
            </div>

            <div class="rounded-3xl bg-gradient-to-br from-ink-800 to-ink-900 border border-ink-700 p-5 text-white">
              <div class="text-xs uppercase tracking-widest text-amber-400 mb-3">تحقق قبل المتابعة</div>
              <div class="space-y-2 text-sm text-slate-300">
                <p class="leading-relaxed">أضف نوعين على الأقل لتنشيط زر المتابعة.</p>
                <p class="leading-relaxed">يمكنك تغيير النمط بين الوزن والسعر في أي وقت.</p>
              </div>
            </div>
          </aside>

        </div>

        <!-- Navigation -->
        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            class="coffee-action w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 font-bold text-base transition"
            :disabled="!canProceed"
            @click="nextStep"
          >
            <span>التالي: تسمية الخلطة</span>
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          </button>
          <p v-if="!canProceed && components.length > 0" class="text-center text-xs text-slate-400">
            أضف نوعاً آخر للمتابعة
          </p>
        </div>

      </div>
    </Transition>

    <!-- ── STEP 2: Name it ── -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="step === 2" key="step2" class="space-y-5">

        <div class="text-center py-4">
          <div class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/15 text-3xl">✦</div>
          <h2 class="font-display text-2xl sm:text-3xl font-bold mt-3 mb-2">سمّ خلطتك</h2>
          <p class="text-slate-400 text-sm max-w-md mx-auto">اختر اسمًا مميزًا أو اتركه تلقائيًا.</p>
        </div>

        <div class="grid gap-5 xl:grid-cols-[1fr_300px]">
          <div class="space-y-4">
            <UInput
              v-model="blendName"
              :placeholder="generatedName || 'مثال: خلطة الصباح الذهبي'"
              size="xl"
              icon="i-heroicons-pencil"
              :ui="{ rounded: 'rounded-2xl', base: 'text-lg font-semibold' }"
            />

            <div class="rounded-3xl overflow-hidden bg-gradient-to-br from-ink-800 to-ink-900 p-5 text-white border border-ink-700">
              <div class="text-xs uppercase tracking-widest text-amber-400 mb-2">عرض سريع</div>
              <div class="font-display text-2xl font-bold mb-4">{{ finalName }}</div>
              <div class="space-y-2">
                <div
                  v-for="(c, i) in components"
                  :key="i"
                  class="rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <div class="text-sm font-semibold">{{ getProductById(c.productId)?.name }}</div>
                      <div class="text-[11px] text-amber-300 mt-0.5">{{ getProductById(c.productId)?.origin }}</div>
                    </div>
                    <div class="text-right">
                      <div class="text-[10px] uppercase tracking-widest text-slate-400">{{ c.mode === 'grams' ? 'جرام' : 'جنيه' }}</div>
                      <div class="text-sm font-bold">{{ c.amount }} {{ c.mode === 'grams' ? 'جم' : 'ج' }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 rounded-xl bg-black/20 p-3 border border-white/10">
                <div class="flex justify-between text-sm text-slate-300">
                  <span>عدد الأنواع</span>
                  <span>{{ components.length }}</span>
                </div>
                <div class="flex justify-between text-sm text-slate-300 mt-1.5">
                  <span>السعر المتوقع</span>
                  <span class="font-bold text-amber-400">{{ formatPrice(totalPrice) }} ج</span>
                </div>
              </div>
            </div>
          </div>

          <aside class="rounded-3xl border border-slate-800 bg-slate-950 p-5 xl:sticky xl:top-24 self-start">
            <div class="flex items-center justify-between gap-3 mb-4">
              <div>
                <div class="text-xs uppercase tracking-widest text-slate-500">ملخص سريع</div>
                <div class="text-xl font-bold text-white">{{ formatPrice(totalPrice) }} ج</div>
              </div>
              <span class="rounded-xl bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 text-xs font-semibold text-amber-400">
                {{ totalWeight.toFixed(3) }} كجم
              </span>
            </div>
            <div class="space-y-2 text-sm text-slate-400">
              <p>يمكنك العودة لتعديل الكمية أو الاسم.</p>
              <p>السعر يتحدث فورياً بناءً على مدخلاتك.</p>
            </div>
          </aside>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            class="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            @click="prevStep"
          >
            <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
            رجوع
          </button>
          <button
            class="coffee-action flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold text-sm transition"
            @click="nextStep"
          >
            مراجعة الطلب
            <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          </button>
        </div>

      </div>
    </Transition>

    <!-- ── STEP 3: Confirm ── -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="step === 3" key="step3" class="space-y-5">

        <div class="text-center py-4">
          <div class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-ink-800 text-2xl text-white shadow-lg">🎉</div>
          <h2 class="font-display text-2xl sm:text-3xl font-bold mt-3 mb-2">خلطتك جاهزة!</h2>
          <p class="text-slate-400 text-sm max-w-md mx-auto">راجع المكونات النهائية وأضفها للسلة.</p>
        </div>

        <div class="grid gap-5 xl:grid-cols-[1fr_300px]">
          <div class="space-y-4">

            <!-- Summary card -->
            <div class="rounded-3xl border border-slate-700 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-soft">
              <div class="bg-gradient-to-r from-ink-800 to-ink-900 px-5 py-4 text-white">
                <div class="text-xs uppercase tracking-widest text-amber-400">ملخص الخلطة</div>
                <div class="mt-2 text-2xl font-bold">{{ finalName }}</div>
              </div>
              <div class="divide-y divide-slate-100 dark:divide-slate-800">
                <div
                  v-for="(c, i) in components"
                  :key="i"
                  class="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                >
                  <div
                    class="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    :style="{ background: getProductById(c.productId)?.gradient }"
                  >
                    <CoffeeIllustration
                      :variant="getProductById(c.productId)?.image || ''"
                      :accent="getProductById(c.productId)?.accent"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm text-slate-900 dark:text-white">{{ getProductById(c.productId)?.name }}</div>
                    <div class="text-xs text-slate-500">{{ getProductById(c.productId)?.origin }} · {{ componentWeightKg(c).toFixed(3) }} كجم</div>
                  </div>
                  <div class="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {{ formatPrice(componentPrice(c)) }} ج
                  </div>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-soft">
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-100 dark:border-slate-800">
                  <div class="text-xs text-slate-500">السعر الإجمالي</div>
                  <div class="mt-1 text-xl font-bold text-amber-600 dark:text-amber-400">{{ formatPrice(totalPrice) }} ج</div>
                </div>
                <div class="rounded-2xl bg-slate-50 dark:bg-slate-900 p-3 border border-slate-100 dark:border-slate-800">
                  <div class="text-xs text-slate-500">الوزن الإجمالي</div>
                  <div class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{ totalWeight.toFixed(3) }} كجم</div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-slate-800 bg-gradient-to-br from-ink-900 to-ink-800 p-5 text-white xl:sticky xl:top-24 self-start">
            <div class="text-xs uppercase tracking-widest text-slate-400 mb-3">ملاحظات سريعة</div>
            <div class="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p>يمكنك تعديل خلطة القهوة في أي وقت.</p>
              <p>السعر المعروض هو مجموع المكونات.</p>
              <p>احفظ الاسم لتتذكر تركيبة الخلطة.</p>
            </div>
            <div class="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4 text-center text-sm text-white/80">
              <div class="font-semibold text-amber-400">ممتاز! الخلطة جاهزة للتسوق.</div>
              <div class="mt-1 text-slate-400 text-xs">اضغط إضافة للسلة لإنهاء تجربة الخلط.</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            class="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-semibold text-sm border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
            @click="prevStep"
          >
            <UIcon name="i-heroicons-pencil" class="w-4 h-4" />
            تعديل
          </button>
          <button
            class="coffee-action flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-bold text-sm transition"
            @click="addToCart"
          >
            <UIcon name="i-heroicons-shopping-bag" class="w-4 h-4" />
            إضافة الخلطة للسلة
          </button>
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
