<!-- pages/cart.vue -->
<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
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
  checkout.send(cart.items, cart.customer, cart.total)
  toast.add({
    title: 'تم فتح واتساب لإتمام الطلب 📲',
    icon: 'i-heroicons-check-circle',
    color: 'green'
  })
}
</script>

<template>
  <div class="animate-fade-in pt-6 pb-12">
    <!-- Header -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl sm:text-4xl font-bold mb-1">سلة التسوق</h1>
        <p class="text-gray-400">راجع منتجاتك وأدخل بياناتك لإتمام الطلب مباشرة</p>
      </div>
      <UButton
        to="/shop"
        icon="i-heroicons-arrow-right"
        variant="ghost"
        color="gray"
        class="self-start sm:self-auto font-semibold rounded-2xl"
      >
        العودة للمتجر
      </UButton>
    </div>

    <!-- Empty State -->
    <div
      v-if="cart.items.length === 0"
      class="max-w-md mx-auto my-12 text-center bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-150 dark:border-gray-700 shadow-soft"
    >
      <div class="w-24 h-24 rounded-full bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center mx-auto mb-6">
        <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 text-primary-500" />
      </div>
      <h2 class="font-display font-bold text-2xl mb-2">سلتك فارغة حالياً</h2>
      <p class="text-gray-400 text-sm mb-8 leading-relaxed">
        لم تقم بإضافة أي نوع بن أو خلطة خاصة بعد. استمتع بتصفح متجرنا واختر قهوتك المفضلة!
      </p>
      <UButton
        to="/shop"
        size="lg"
        color="primary"
        block
        class="rounded-2xl font-bold"
      >
        اكتشف منتجاتنا الآن
      </UButton>
    </div>

    <!-- Active Cart Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Items Column -->
      <div class="lg:col-span-8 space-y-4">
        <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 overflow-hidden shadow-soft">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
            <h3 class="font-bold text-lg">المنتجات المختارة ({{ cart.count }})</h3>
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

          <div class="divide-y divide-gray-100 dark:divide-gray-700">
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
                class="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <!-- Product details left side -->
                <div class="flex gap-4 items-center flex-1 min-w-0">
                  <!-- Thumbnail -->
                  <div
                    class="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700"
                    :style="{ background: item.gradient }"
                  >
                    <CoffeeIllustration
                      v-if="item.type === 'single' && item.image"
                      :variant="item.image"
                      :accent="item.accent"
                    />
                    <span v-else class="text-3xl">✦</span>
                  </div>

                  <!-- Name and notes -->
                  <div class="min-w-0 flex-1">
                    <h4 class="font-bold text-base leading-snug truncate">{{ item.name }}</h4>
                    <!-- Component list for blend -->
                    <div
                      v-if="item.type === 'blend' && item.components"
                      class="mt-1 flex flex-wrap gap-1.5"
                    >
                      <span
                        v-for="(c, i) in item.components"
                        :key="i"
                        class="inline-flex items-center text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full"
                      >
                        {{ c.name }} · {{ c.weight }} كجم
                      </span>
                    </div>
                    <p v-else class="text-xs text-gray-400 mt-0.5">سعر الكيلو: {{ formatPrice(item.pricePerKg || 0) }} جنيه</p>
                  </div>
                </div>

                <!-- Weight adjuster and price right side -->
                <div class="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-750">
                  <!-- Stepper for single coffee -->
                  <div v-if="item.type === 'single'" class="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 rounded-2xl p-1 border border-gray-200 dark:border-gray-700">
                    <UButton
                      icon="i-heroicons-minus"
                      color="gray"
                      variant="ghost"
                      size="sm"
                      class="rounded-xl w-8 h-8"
                      @click="cart.adjustWeight(item.id, -0.125)"
                    />
                    <span class="text-sm font-bold w-16 text-center tabular-nums">{{ item.weight.toFixed(3) }} كجم</span>
                    <UButton
                      icon="i-heroicons-plus"
                      color="gray"
                      variant="ghost"
                      size="sm"
                      class="rounded-xl w-8 h-8"
                      @click="cart.adjustWeight(item.id, 0.125)"
                    />
                  </div>
                  <div v-else class="text-sm text-gray-500 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-2xl border border-gray-200 dark:border-gray-700">
                    الوزن: {{ item.weight.toFixed(3) }} كجم
                  </div>

                  <!-- Item total price -->
                  <div class="flex items-center gap-4">
                    <span class="font-display font-bold text-lg text-primary-500 min-w-[70px] text-left">
                      {{ formatPrice(item.price) }} ج
                    </span>
                    <UButton
                      icon="i-heroicons-trash"
                      color="red"
                      variant="soft"
                      size="sm"
                      class="rounded-xl"
                      @click="cart.remove(item.id)"
                    />
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Checkout Summary Column -->
      <div class="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
        <!-- Billing / Customer Card -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 p-6 shadow-soft space-y-4">
          <h3 class="font-bold text-lg border-b border-gray-100 dark:border-gray-700 pb-3">بيانات التوصيل</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-400">الاسم الكريم *</label>
              <UInput
                v-model="cart.customer.name"
                placeholder="أدخل اسمك بالكامل"
                icon="i-heroicons-user"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-400">رقم الهاتف للاتصال والتأكيد *</label>
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
              <label class="block text-xs font-semibold mb-1 text-gray-400">عنوان التوصيل بالتفصيل</label>
              <UInput
                v-model="cart.customer.address"
                placeholder="الشارع، المنطقة، رقم العقار"
                icon="i-heroicons-map-pin"
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1 text-gray-400">ملاحظات خاصة بالطلب (اختياري)</label>
              <UTextarea
                v-model="cart.customer.notes"
                placeholder="أضف أي تفاصيل أو متطلبات خاصة بالتحميص أو التعبئة..."
                size="lg"
                :ui="{ rounded: 'rounded-xl' }"
                rows="2"
              />
            </div>
          </div>
        </div>

        <!-- Total summary -->
        <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700 p-6 shadow-soft space-y-5">
          <h3 class="font-bold text-lg border-b border-gray-100 dark:border-gray-700 pb-3">ملخص الحساب</h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-400">
              <span>عدد الأصناف</span>
              <span>{{ cart.count }} أصناف</span>
            </div>
            <div class="flex justify-between text-sm text-gray-400">
              <span>الوزن الكلي للبن</span>
              <span>{{ cart.totalWeight.toFixed(3) }} كجم</span>
            </div>
            <div class="flex justify-between text-sm text-gray-400">
              <span>قيمة التوصيل</span>
              <span class="text-green-500 font-medium">مجاني بمناسبة الافتتاح</span>
            </div>
            <div class="border-t border-dashed border-gray-200 dark:border-gray-700 my-3 pt-3 flex justify-between items-end">
              <span class="font-bold text-base">المبلغ الإجمالي</span>
              <div class="text-left">
                <span class="font-display font-bold text-3xl text-primary-500">{{ formatPrice(cart.total) }}</span>
                <span class="text-xs text-gray-400 mr-1">جنيه</span>
              </div>
            </div>
          </div>

          <UButton
            size="lg"
            block
            class="rounded-2xl font-bold text-base py-3.5 bg-green-500 hover:bg-green-600 text-white shadow-soft transition-transform active:scale-[0.98] border-0"
            @click="handleCheckout"
          >
            <template #leading>
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </template>
            تأكيد الطلب وإرسال عبر واتساب
          </UButton>

          <p class="text-[10px] text-gray-400 text-center leading-relaxed">
            سيتم توجيهك مباشرة لفتح تطبيق واتساب لإتمام التفاصيل النهائية مع خدمة العملاء.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
