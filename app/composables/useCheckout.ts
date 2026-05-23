// composables/useCheckout.ts
import type { CartItem, Customer } from '~/stores/cart'

const WHATSAPP_NUMBER = '201004513892' // +20 100 451 3892

export const useCheckout = () => {
  const fmt = (n: number) => Math.round(n).toLocaleString('ar-EG')
  const fmtKg = (n: number) => n.toFixed(3).replace(/\.?0+$/, '')

  const buildMessage = (items: CartItem[], customer: Customer, total: number, shippingFee: number) => {
    const singles = items.filter(i => i.type === 'single')
    const blends = items.filter(i => i.type === 'blend')
    const now = new Date().toLocaleString('ar-EG', {
      dateStyle: 'medium', timeStyle: 'short',
    })

    let m = ''
    m += '╔══════════════════════╗\n'
    m += '   🌟 *شيخ القهوة* 🌟\n'
    m += '   _مذاق كما تهوى_\n'
    m += '╚══════════════════════╝\n\n'
    m += `📅 ${now}\n`
    m += '━━━━━━━━━━━━━━━━━━━━\n\n'

    if (customer.name || customer.phone || customer.address) {
      m += '👤 *بيانات العميل*\n'
      if (customer.name) m += `▪️ الاسم: ${customer.name}\n`
      if (customer.phone) m += `▪️ الهاتف: ${customer.phone}\n`
      if (customer.address) m += `▪️ العنوان: ${customer.address}\n`
      m += '\n'
    }

    m += '🛍️ *تفاصيل الطلب*\n'
    m += '━━━━━━━━━━━━━━━━━━━━\n\n'

    if (singles.length > 0) {
      m += '☕ *المنتجات:*\n\n'
      singles.forEach((it, i) => {
        m += `*${i + 1}.* ${it.name}\n`
        m += `   ⚖️ الوزن: ${fmtKg(it.weight)} كجم\n`
        m += `   💰 السعر: ${fmt(it.price)} ج.م\n\n`
      })
    }

    if (blends.length > 0) {
      m += '✦ *الخلطات الخاصة:*\n\n'
      blends.forEach((b, i) => {
        m += `*${i + 1}.* ${b.name}\n`
        m += '   📋 المكونات:\n'
        b.components?.forEach(c => {
          m += `      ◦ ${c.name} — ${fmtKg(c.weight)} كجم\n`
        })
        m += `   ⚖️ الوزن الإجمالي: ${fmtKg(b.weight)} كجم\n`
        m += `   💰 السعر: ${fmt(b.price)} ج.م\n\n`
      })
    }

    m += '━━━━━━━━━━━━━━━━━━━━\n'
    m += `🛒 *إجمالي المنتجات: ${fmt(total)} ج.م*\n`
    m += `🚚 *رسوم الشحن والتوصيل: ${fmt(shippingFee)} ج.م*\n`
    m += `✅ *الإجمالي الكلي (شامل الشحن): ${fmt(total + shippingFee)} ج.م*\n`
    m += '━━━━━━━━━━━━━━━━━━━━\n\n'

    if (customer.notes) m += `📝 *ملاحظات:* ${customer.notes}\n\n`
    m += '🙏 شكراً لاختياركم شيخ القهوة\n'
    m += '☕ نتشرف بخدمتكم'

    return m
  }

  const send = (items: CartItem[], customer: Customer, total: number, shippingFee: number) => {
    if (items.length === 0) return
    const msg = buildMessage(items, customer, total, shippingFee)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    if (import.meta.client) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return { send, buildMessage }
}
