<!-- pages/order/verify.vue -->
<script setup lang="ts">
import { decodeOrder } from '~/utils/crypto'
import { useFormat } from '~/composables/useFormat'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { formatPrice, formatWeight } = useFormat()

const d = computed(() => route.query.d as string || '')
const s = computed(() => route.query.s as string || '')

const verificationResult = computed(() => {
  if (!d.value || !s.value) {
    return { order: null, isValid: false }
  }
  return decodeOrder(d.value, s.value)
})

const order = computed(() => verificationResult.value.order)
const isValid = computed(() => verificationResult.value.isValid)

const formattedDate = computed(() => {
  if (!order.value?.ts) return ''
  return new Date(order.value.ts).toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
})
</script>

<template>
  <div class="animate-fade-in pt-4 pb-20 lg:pb-12 max-w-2xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <SheikhLogo class="w-20 h-20 mx-auto logo-glow mb-4 animate-pulse" />
      <h1 class="font-display text-2xl sm:text-3xl font-bold">بوابة التحقق من الطلبات</h1>
      <p class="text-sm text-ink-400 dark:text-slate-400 mt-1">تأكيد صحة وموثوقية فواتير شيخ القهوة</p>
    </div>

    <!-- Verification Badge Card -->
    <div
      class="rounded-3xl border p-6 mb-6 shadow-soft text-center transition duration-300"
      :class="[
        isValid 
          ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
          : 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
      ]"
    >
      <div class="flex flex-col items-center gap-3">
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center mb-2"
          :class="[
            isValid
              ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400'
          ]"
        >
          <UIcon 
            :name="isValid ? 'i-heroicons-shield-check' : 'i-heroicons-shield-exclamation'" 
            class="w-10 h-10" 
          />
        </div>
        
        <h2 class="font-display font-bold text-xl sm:text-2xl leading-snug">
          {{ isValid ? 'تم التحقق: طلب موثق ومطابق' : 'فشل التحقق: تفاصيل الطلب غير آمنة!' }}
        </h2>
        
        <p class="text-sm leading-relaxed max-w-md opacity-90">
          {{ 
            isValid 
              ? 'تم التحقق من البنية الرقمية المشفرة للطلب بنجاح. بيانات الأسعار والمنتجات أدناه مطابقة تماماً للمتجر ولم تتعرض للتعديل.'
              : 'هذا الرابط تم التعديل عليه أو يحتوي على توقيع غير صالح. الرجاء عدم اعتماد الأسعار أو التفاصيل المذكورة في رسالة الواتساب إذا كانت مختلفة عن لوحة التحكم الخاصة بك.'
          }}
        </p>
      </div>
    </div>

    <!-- Order Details (Only if Valid) -->
    <div 
      v-if="isValid && order" 
      class="bg-cream-50 dark:bg-ink-800 rounded-3xl border border-ink-200 dark:border-ink-700 shadow-soft overflow-hidden divide-y divide-ink-100 dark:divide-ink-700"
    >
      <!-- Date & Customer Header -->
      <div class="p-6 bg-ink-50/40 dark:bg-ink-900/40 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span class="text-xs font-semibold text-ink-400 dark:text-slate-400 uppercase tracking-wider">الرقم المرجعي للطلب</span>
          <span class="font-mono text-sm font-bold bg-ink-100 dark:bg-ink-900 px-3 py-1 rounded-full text-ink-700 dark:text-cream">
            #SQ-{{ order.ts.toString().slice(-6) }}
          </span>
        </div>
        
        <div class="flex items-center gap-2 text-sm text-ink-500 dark:text-slate-400">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-primary-500" />
          <span>تاريخ الطلب:</span>
          <span class="font-semibold text-ink-700 dark:text-white">{{ formattedDate }}</span>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="p-6 space-y-4">
        <h3 class="font-bold text-base flex items-center gap-2">
          <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-primary-500" />
          بيانات العميل
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div class="bg-ink-50/30 dark:bg-ink-900/20 p-3 rounded-2xl border border-ink-100/50 dark:border-ink-700/50">
            <span class="block text-xs text-ink-400 dark:text-slate-400 mb-1">الاسم الكريم</span>
            <span class="font-bold text-ink-700 dark:text-white">{{ order.n }}</span>
          </div>
          <div class="bg-ink-50/30 dark:bg-ink-900/20 p-3 rounded-2xl border border-ink-100/50 dark:border-ink-700/50">
            <span class="block text-xs text-ink-400 dark:text-slate-400 mb-1">رقم الهاتف</span>
            <span class="font-bold text-ink-700 dark:text-white" dir="ltr">{{ order.p }}</span>
          </div>
          <div v-if="order.a" class="sm:col-span-2 bg-ink-50/30 dark:bg-ink-900/20 p-3 rounded-2xl border border-ink-100/50 dark:border-ink-700/50">
            <span class="block text-xs text-ink-400 dark:text-slate-400 mb-1">عنوان التوصيل</span>
            <span class="font-bold text-ink-700 dark:text-white">{{ order.a }}</span>
          </div>
          <div v-if="order.nt" class="sm:col-span-2 bg-ink-50/30 dark:bg-ink-900/20 p-3 rounded-2xl border border-ink-100/50 dark:border-ink-700/50">
            <span class="block text-xs text-ink-400 dark:text-slate-400 mb-1">ملاحظات خاصة</span>
            <span class="text-ink-600 dark:text-slate-300 leading-relaxed">{{ order.nt }}</span>
          </div>
        </div>
      </div>

      <!-- Products List -->
      <div class="p-6 space-y-4">
        <h3 class="font-bold text-base flex items-center gap-2">
          <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5 text-primary-500" />
          تفاصيل المنتجات
        </h3>
        
        <div class="space-y-3">
          <div 
            v-for="(item, idx) in order.i" 
            :key="idx"
            class="p-4 rounded-2xl border border-ink-100 dark:border-ink-700 bg-white/50 dark:bg-ink-900/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
          >
            <div class="flex gap-3 items-center flex-1 min-w-0">
              <!-- Coffee Illustration container -->
              <div
                class="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden border border-ink-100 dark:border-ink-700"
                :style="{ background: item.gr }"
              >
                <CoffeeIllustration
                  v-if="item.img"
                  :variant="item.img"
                  :accent="item.ac"
                />
                <span v-else class="text-2xl">☕</span>
              </div>
              
              <div class="min-w-0 flex-1">
                <h4 class="font-bold text-sm leading-snug truncate">{{ item.n }}</h4>
                <div v-if="item.t === 'b' && item.c" class="mt-1 flex flex-wrap gap-1">
                  <span class="inline-flex items-center text-[10px] bg-ink-100 dark:bg-ink-900 text-ink-500 dark:text-cream/70 px-2 py-0.5 rounded-full border border-ink-200 dark:border-ink-700">
                    ×{{ item.q || 1 }}
                  </span>
                  <span
                    v-for="(c, cIdx) in item.c"
                    :key="cIdx"
                    class="inline-flex items-center text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-700/30"
                  >
                    {{ c.n }} · {{ formatWeight(c.w) }}
                  </span>
                </div>
                <p v-else class="text-xs text-ink-400 dark:text-slate-400 mt-0.5">
                  الوزن الكلي: {{ formatWeight(item.w) }}
                </p>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="text-left w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-ink-100 dark:border-ink-700 flex justify-between sm:block">
              <span class="sm:hidden text-xs text-ink-400">سعر الصنف:</span>
              <span class="font-display font-bold text-base text-primary-600 dark:text-amber-400">
                {{ formatPrice(item.pr) }} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Breakdown -->
      <div class="p-6 bg-ink-50/20 dark:bg-ink-900/20 space-y-3">
        <div class="flex justify-between text-sm text-ink-500 dark:text-slate-400">
          <span>إجمالي المنتجات</span>
          <span class="font-semibold text-ink-700 dark:text-white">{{ formatPrice(order.t) }} ج.م</span>
        </div>
        <div class="flex justify-between text-sm text-ink-500 dark:text-slate-400">
          <span>مصاريف الشحن</span>
          <span class="font-semibold text-ink-700 dark:text-white">حسب المنطقة</span>
        </div>
        
        <div class="pt-4 border-t border-dashed border-ink-200 dark:border-ink-700 flex justify-between items-center">
          <span class="font-bold text-base">الإجمالي الكلي (بدون الشحن)</span>
          <div class="text-left">
            <span class="font-display font-bold text-2xl text-primary-600 dark:text-amber-400">{{ formatPrice(order.t) }}</span>
            <span class="text-xs text-ink-400 dark:text-slate-400 mr-1">جنيه</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Back to store button -->
    <div class="mt-8 text-center">
      <UButton
        to="/shop"
        size="lg"
        color="gray"
        variant="ghost"
        icon="i-heroicons-home"
        class="rounded-2xl font-bold px-6"
      >
        العودة للرئيسية
      </UButton>
    </div>
  </div>
</template>
