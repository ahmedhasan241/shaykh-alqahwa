<!-- components/CartSheet.vue -->
<script setup lang="ts">
import { useToast } from '~/composables/useToast'
import { SHIPPING_AREAS, useCartStore } from '~/stores/cart'
import { useCheckout } from '~/composables/useCheckout'
import { useFormat } from '~/composables/useFormat'

const cart = useCartStore()
const checkout = useCheckout()
const { formatPrice } = useFormat()
const toast = useToast()
const router = useRouter()

watch(() => cart.isOpen, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})

const handleCheckout = () => {
  if (cart.items.length === 0) return
  if (!cart.customer.name || !cart.customer.phone) {
    toast.add({ title: 'بيانات ناقصة', description: 'يرجى إدخال الاسم ورقم الهاتف لإتمام الطلب.', icon: 'i-heroicons-exclamation-circle', color: 'red' })
    return
  }
  checkout.send(cart.items, cart.customer, cart.total, cart.shippingFee)
  toast.add({ title: 'تم فتح واتساب لإتمام الطلب 📲', icon: 'i-heroicons-check-circle', color: 'primary' })
}

const goToCart = () => {
  cart.close()
  router.push('/cart')
}
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-250"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cart.isOpen"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="cart.close()"
      />
    </Transition>

    <!-- Drawer panel -->
    <Transition
      enter-active-class="transition-transform duration-350 ease-out"
      enter-from-class="translate-y-full sm:translate-y-0 sm:translate-x-full"
      enter-to-class="translate-y-0 sm:translate-x-0"
      leave-active-class="transition-transform duration-250 ease-in"
      leave-from-class="translate-y-0 sm:translate-x-0"
      leave-to-class="translate-y-full sm:translate-y-0 sm:translate-x-full"
    >
      <div
        v-if="cart.isOpen"
        class="fixed z-50 bottom-0 inset-x-0 sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:w-[420px] flex flex-col bg-cream dark:bg-ink-900 rounded-t-[28px] sm:rounded-none shadow-2xl max-h-[92dvh] sm:max-h-screen"
      >
        <!-- Mobile drag handle -->
        <div class="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div class="w-10 h-1 rounded-full bg-ink-300/50 dark:bg-cream-100/20" />
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-ink-100 dark:border-ink-700 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="coffee-action w-9 h-9 rounded-xl flex items-center justify-center">
              <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5" />
            </div>
            <div>
              <h2 class="font-bold text-lg leading-tight">سلة التسوق</h2>
              <p class="text-xs text-ink-400 dark:text-cream/55">{{ cart.count }} {{ cart.count === 1 ? 'منتج' : 'منتجات' }}</p>
            </div>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            size="sm"
            class="rounded-full"
            @click="cart.close()"
          />
        </div>

        <!-- Empty state -->
        <div v-if="cart.items.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div class="w-28 h-28 rounded-full bg-ink-50 dark:bg-ink-800 flex items-center justify-center mb-5">
            <UIcon name="i-heroicons-shopping-bag" class="w-14 h-14 text-ink-200 dark:text-ink-600" />
          </div>
          <h3 class="font-bold text-xl mb-2">السلة فارغة</h3>
          <p class="text-sm text-ink-400 dark:text-cream/55 mb-8 leading-relaxed">لم تضف أي منتجات بعد.<br>اكتشف أنواع القهوة الفاخرة لدينا!</p>
          <UButton
            label="تصفّح المتجر"
            color="gray"
            size="lg"
            class="coffee-action rounded-2xl font-bold px-8"
            @click="cart.close(); $router.push('/shop')"
          />
        </div>

        <!-- Items -->
        <div v-else class="flex-1 overflow-y-auto overscroll-contain px-4 py-3 space-y-3">
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
              class="flex gap-3 p-3 bg-cream-50 dark:bg-ink-800 rounded-2xl border border-ink-200 dark:border-ink-700"
            >
              <!-- Thumbnail -->
              <div
                class="w-[72px] h-[72px] rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden"
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

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-1">
                  <p class="font-semibold text-sm leading-snug line-clamp-2">{{ item.name }}</p>
                  <UButton
                    icon="i-heroicons-x-mark"
                    color="gray"
                    variant="ghost"
                    size="2xs"
                    class="rounded-full flex-shrink-0 -mt-0.5 text-amber-600 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-400/10"
                    @click="cart.remove(item.id)"
                  />
                </div>

                <!-- Blend components -->
                <div
                  v-if="item.type === 'blend' && item.components"
                  class="mt-1 text-[10px] text-ink-400 dark:text-cream/55 space-y-0.5"
                >
                  <span v-for="(c, i) in item.components" :key="i" class="inline-block ml-2">
                    {{ c.name }} {{ c.weight }}كجم
                  </span>
                </div>

                <div class="mt-2 flex items-center justify-between">
                  <!-- Weight stepper (single items only) -->
                  <div v-if="item.type === 'single'" class="flex items-center gap-1 bg-ink-50 dark:bg-ink-900 rounded-xl p-0.5 border border-ink-200 dark:border-ink-700">
                    <UButton
                      icon="i-heroicons-minus"
                      color="gray"
                      variant="ghost"
                      size="2xs"
                      class="rounded-lg w-7 h-7"
                      @click="cart.adjustWeight(item.id, -0.125)"
                    />
                    <span class="text-xs font-bold w-12 text-center tabular-nums">{{ item.weight.toFixed(3) }}</span>
                    <UButton
                      icon="i-heroicons-plus"
                      color="gray"
                      variant="ghost"
                      size="2xs"
                      class="rounded-lg w-7 h-7"
                      @click="cart.adjustWeight(item.id, 0.125)"
                    />
                  </div>
                  <div v-else class="flex items-center gap-1 bg-ink-50 dark:bg-ink-900 rounded-xl p-0.5 border border-ink-200 dark:border-ink-700">
                    <UButton
                      icon="i-heroicons-minus"
                      color="gray"
                      variant="ghost"
                      size="2xs"
                      class="rounded-lg w-7 h-7"
                      @click="cart.adjustQuantity(item.id, -1)"
                    />
                    <span class="text-xs font-bold w-12 text-center tabular-nums">×{{ item.quantity || 1 }}</span>
                    <UButton
                      icon="i-heroicons-plus"
                      color="gray"
                      variant="ghost"
                      size="2xs"
                      class="rounded-lg w-7 h-7"
                      @click="cart.adjustQuantity(item.id, 1)"
                    />
                  </div>

                  <span class="font-bold text-base text-amber-600 dark:text-amber-300">{{ formatPrice(item.price) }} ج</span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- Footer -->
        <div v-if="cart.items.length > 0" class="flex-shrink-0 border-t border-ink-100 dark:border-ink-700 bg-cream dark:bg-ink-900 px-4 pt-4 pb-safe-bottom space-y-3" style="padding-bottom: max(1rem, env(safe-area-inset-bottom))">
          <!-- Customer fields -->
          <div class="grid grid-cols-2 gap-2">
            <UInput
              v-model="cart.customer.name"
              placeholder="الاسم"
              icon="i-heroicons-user"
              size="md"
              :ui="{ rounded: 'rounded-xl' }"
            />
            <UInput
              v-model="cart.customer.phone"
              placeholder="رقم الهاتف"
              type="tel"
              icon="i-heroicons-phone"
              size="md"
              :ui="{ rounded: 'rounded-xl' }"
            />
          </div>
          <UInput
            v-model="cart.customer.address"
            placeholder="العنوان (اختياري)"
            icon="i-heroicons-map-pin"
            size="md"
            :ui="{ rounded: 'rounded-xl' }"
          />



          <!-- Total row -->
          <div class="space-y-1 py-1">
          <div class="flex items-center justify-between">
            <span class="text-ink-500 dark:text-cream/60 text-sm">الإجمالي</span>
            <div class="text-right">
              <div class="font-bold text-2xl text-amber-600 dark:text-amber-300 leading-none">{{ formatPrice(cart.grandTotal) }} ج</div>
              <div class="text-[10px] text-ink-400 dark:text-cream/55">{{ cart.totalWeight.toFixed(3) }} كجم إجمالي</div>
            </div>
          </div>
          </div>

          <!-- WhatsApp checkout -->
          <UButton
            size="lg"
            block
            class="coffee-action rounded-2xl font-bold text-base border-0"
            @click="handleCheckout"
          >
            <template #leading>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </template>
            إتمام الطلب عبر واتساب
          </UButton>

          <!-- View full cart + Clear -->
          <div class="flex items-center gap-2">
            <UButton
              label="صفحة السلة الكاملة"
              variant="soft"
              color="gray"
              size="sm"
              class="flex-1 rounded-xl bg-cream-50 dark:bg-cream text-ink-500 hover:bg-ink-100 dark:hover:bg-cream-200"
              icon="i-heroicons-shopping-cart"
              @click="goToCart"
            />
            <UButton
              label="إفراغ"
              variant="soft"
              color="gray"
              size="sm"
              class="rounded-xl bg-amber-950 text-amber-300 hover:bg-amber-900"
              icon="i-heroicons-trash"
              @click="cart.clear()"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
