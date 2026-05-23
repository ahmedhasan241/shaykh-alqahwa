<!-- pages/cart.vue -->
<script setup lang="ts">
import { SHIPPING_AREAS, useCartStore } from '~/stores/cart'
import { useCheckout } from '~/composables/useCheckout'
import { useFormat } from '~/composables/useFormat'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'default' })

const cart = useCartStore()
const checkout = useCheckout()
const { formatPrice } = useFormat()
const toast = useToast()

const handleCheckout = () => {
  if (cart.items.length === 0) return
  if (!cart.customer.name || !cart.customer.phone) {
    toast.add({
      title: 'بيانات ناقصة',
      description: 'يرجى إدخال الاسم ورقم الهاتف لإتمام الطلب.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    })
    return
  }
  checkout.send(cart.items, cart.customer, cart.total, cart.shippingFee)
  toast.add({
    title: 'تم فتح واتساب لإتمام الطلب 📲',
    icon: 'i-heroicons-check-circle',
    color: 'primary'
  })
}
</script>

<template>
  <div class="animate-fade-in pt-4 pb-20 lg:pb-12">

    <!-- ── Page Header ── -->
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold">سلة التسوق</h1>
        <p class="text-sm text-ink-400 dark:text-slate-400 mt-0.5">راجع طلبك وأدخل بياناتك لإتمامه</p>
      </div>
      <UButton
        to="/shop"
        icon="i-heroicons-arrow-right"
        variant="ghost"
        color="gray"
        class="rounded-2xl font-semibold shrink-0"
      >
        <span class="hidden sm:inline">العودة للمتجر</span>
      </UButton>
    </div>

    <!-- ── Empty State ── -->
    <div
      v-if="cart.items.length === 0"
      class="max-w-sm mx-auto my-16 text-center"
    >
      <div class="w-24 h-24 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center mx-auto mb-6">
        <UIcon name="i-heroicons-shopping-bag" class="w-11 h-11 text-ink-400 dark:text-ink-300" />
      </div>
      <h2 class="font-display font-bold text-xl mb-2">سلتك فارغة حالياً</h2>
      <p class="text-ink-400 dark:text-slate-400 text-sm mb-8 leading-relaxed">
        لم تقم بإضافة أي نوع بن أو خلطة بعد. تصفّح متجرنا واختر قهوتك!
      </p>
      <UButton
        to="/shop"
        size="lg"
        color="primary"
        block
        class="rounded-2xl font-bold"
      >
        اكتشف منتجاتنا
      </UButton>
    </div>

    <!-- ── Active Cart ── -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      <!-- Items Column -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-3">

        <!-- Items Card -->
        <div class="bg-cream-50 dark:bg-ink-800 rounded-3xl border border-ink-200 dark:border-ink-700 overflow-hidden shadow-soft">
          <div class="px-5 py-4 border-b border-ink-100 dark:border-ink-700 flex justify-between items-center bg-ink-50/50 dark:bg-ink-900/50">
            <h3 class="font-bold text-base">المنتجات المختارة
              <span class="text-ink-400 dark:text-slate-400 font-normal text-sm mr-1">({{ cart.count }})</span>
            </h3>
            <UButton
              label="إفراغ السلة"
              icon="i-heroicons-trash"
              variant="ghost"
              color="red"
              size="sm"
              class="rounded-xl font-semibold"
              @click="cart.clear()"
            />
          </div>

          <div class="divide-y divide-ink-100 dark:divide-ink-700">
            <TransitionGroup
              enter-active-class="transition-all duration-300"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <!-- Left: product info -->
                <div class="flex gap-3 items-center flex-1 min-w-0">
                  <div
                    class="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden border border-ink-100 dark:border-ink-700"
                    :style="{ background: item.type === 'blend' ? item.components?.[0]?.gradient || item.gradient : item.gradient }"
                  >
                    <CoffeeIllustration
                      v-if="item.type === 'single' && item.image"
                      :variant="item.image"
                      :accent="item.accent"
                    />
                    <CoffeeIllustration
                      v-else-if="item.type === 'blend' && item.components?.[0]?.image"
                      :variant="item.components?.[0]?.image || ''"
                      :accent="item.components?.[0]?.accent"
                    />
                    <span v-else class="text-2xl">✦</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="font-bold text-sm leading-snug truncate">{{ item.name }}</h4>
                    <div
                      v-if="item.type === 'blend' && item.components"
                      class="mt-1 flex flex-wrap gap-1"
                    >
                      <span class="inline-flex items-center text-[10px] bg-ink-100 dark:bg-ink-900 text-ink-500 dark:text-cream/70 px-2 py-0.5 rounded-full border border-ink-200 dark:border-ink-700">
                        ×{{ item.quantity || 1 }}
                      </span>
                      <span
                        v-for="(c, i) in item.components"
                        :key="i"
                        class="inline-flex items-center text-[10px] bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-700/30"
                      >
                        {{ c.name }} · {{ c.weight }} كجم
                      </span>
                    </div>
                    <p v-else class="text-xs text-ink-400 dark:text-slate-400 mt-0.5">
                      {{ formatPrice(item.pricePerKg || 0) }} ج / كجم
                    </p>
                  </div>
                </div>

                <!-- Right: stepper + price + delete -->
                <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-ink-100 dark:border-ink-700">
                  <!-- Weight stepper for single -->
                  <div v-if="item.type === 'single'" class="flex items-center gap-1 bg-ink-50 dark:bg-ink-900 rounded-2xl p-1 border border-ink-200 dark:border-ink-700">
                    <button
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700 transition"
                      @click="cart.adjustWeight(item.id, -0.125)"
                    >
                      <UIcon name="i-heroicons-minus" class="w-4 h-4" />
                    </button>
                    <span class="text-sm font-bold w-16 text-center tabular-nums">{{ item.weight.toFixed(3) }} كجم</span>
                    <button
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700 transition"
                      @click="cart.adjustWeight(item.id, 0.125)"
                    >
                      <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                    </button>
                  </div>
                  <div v-else class="flex items-center gap-1 bg-ink-50 dark:bg-ink-900 rounded-2xl p-1 border border-ink-200 dark:border-ink-700">
                    <button
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700 transition"
                      @click="cart.adjustQuantity(item.id, -1)"
                    >
                      <UIcon name="i-heroicons-minus" class="w-4 h-4" />
                    </button>
                    <span class="text-sm font-bold w-16 text-center tabular-nums">×{{ item.quantity || 1 }}</span>
                    <button
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-700 transition"
                      @click="cart.adjustQuantity(item.id, 1)"
                    >
                      <UIcon name="i-heroicons-plus" class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Price + Delete -->
                  <div class="flex items-center gap-3">
                    <span class="font-display font-bold text-base text-primary-600 dark:text-amber-400 min-w-[60px] text-left tabular-nums">
                      {{ formatPrice(item.price) }} ج
                    </span>
                    <button
                      class="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                      @click="cart.remove(item.id)"
                    >
                      <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>

      </div>

      <!-- ── Checkout Column ── -->
      <div class="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-4">

        <!-- Customer info -->
        <div class="bg-cream-50 dark:bg-ink-800 rounded-3xl border border-ink-200 dark:border-ink-700 p-5 shadow-soft space-y-4">
          <h3 class="font-bold text-base pb-3 border-b border-ink-100 dark:border-ink-700">بيانات التوصيل</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold mb-1 text-ink-400 dark:text-slate-400">الاسم الكريم *</label>
              <UInput
                v-model="cart.customer.name"
                placeholder="أدخل اسمك بالكامل"
                icon="i-heroicons-user"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-ink-400 dark:text-slate-400">رقم الهاتف *</label>
              <UInput
                v-model="cart.customer.phone"
                placeholder="مثال: 01004513892"
                type="tel"
                icon="i-heroicons-phone"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-ink-400 dark:text-slate-400">عنوان التوصيل</label>
              <UInput
                v-model="cart.customer.address"
                placeholder="الشارع، المنطقة، رقم العقار"
                icon="i-heroicons-map-pin"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-ink-400 dark:text-slate-400">ملاحظات الطلب (اختياري)</label>
              <UTextarea
                v-model="cart.customer.notes"
                placeholder="أي تفاصيل خاصة بالتحميص أو التعبئة..."
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
                rows="2"
              />
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="bg-cream-50 dark:bg-ink-800 rounded-3xl border border-ink-200 dark:border-ink-700 p-5 shadow-soft space-y-4">
          <h3 class="font-bold text-base pb-3 border-b border-ink-100 dark:border-ink-700">ملخص الحساب</h3>

          <div class="space-y-2.5 text-sm">
            <div class="flex justify-between text-ink-500 dark:text-slate-400">
              <span>عدد الأصناف</span>
              <span>{{ cart.count }} أصناف</span>
            </div>
            <div class="flex justify-between text-ink-500 dark:text-slate-400">
              <span>الوزن الكلي</span>
              <span>{{ cart.totalWeight.toFixed(3) }} كجم</span>
            </div>
            <div class="flex justify-between text-ink-500 dark:text-slate-400">
              <span>إجمالي المنتجات</span>
              <span class="font-semibold text-ink-700 dark:text-white">{{ formatPrice(cart.total) }} ج</span>
            </div>

            <div class="pt-3 border-t border-dashed border-ink-200 dark:border-ink-700 flex justify-between items-end">
              <span class="font-bold text-base">الإجمالي الكلي</span>
              <div class="text-left">
                <span class="font-display font-bold text-2xl text-primary-600 dark:text-amber-400">{{ formatPrice(cart.grandTotal) }}</span>
                <span class="text-xs text-ink-400 dark:text-slate-400 mr-1">جنيه</span>
              </div>
            </div>
          </div>

          <!-- WhatsApp checkout -->
          <button
            class="coffee-action w-full flex items-center justify-center gap-3 rounded-2xl px-5 py-3.5 font-bold text-base transition active:scale-[0.98]"
            @click="handleCheckout"
          >
            <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            تأكيد الطلب عبر واتساب
          </button>

          <p class="text-[10px] text-ink-400 dark:text-slate-500 text-center leading-relaxed">
            سيتم توجيهك لواتساب لإتمام التفاصيل النهائية مع فريقنا.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>
