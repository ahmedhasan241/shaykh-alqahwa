// composables/useCheckout.ts
import type { CartItem, Customer } from '~/stores/cart'
import { encodeOrder, type CompactOrder } from '~/utils/crypto'

const WHATSAPP_NUMBER = '201102057503' // +20 110 205 7503

export const useCheckout = () => {
  const fmt = (n: number) => Math.round(n).toLocaleString('ar-EG')
  const fmtKg = (n: number) => n.toFixed(3).replace(/\.?0+$/, '')

  const buildMessage = (
    items: CartItem[],
    customer: Customer,
    total: number,
    shippingFee: number,
    verificationLink?: string
  ) => {
    const singles = items.filter(i => i.type === 'single')
    const blends = items.filter(i => i.type === 'blend')
    const now = new Date().toLocaleString('ar-EG', {
      dateStyle: 'medium',
      timeStyle: 'short',
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
        if ((b.quantity || 1) > 1) {
          m += `   × الكمية: ${b.quantity}\n`
        }
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
    m += `✅ *الإجمالي الكلي: ${fmt(total)} ج.م + مصاريف الشحن*\n`
    m += '━━━━━━━━━━━━━━━━━━━━\n\n'

    if (customer.notes) m += `📝 *ملاحظات:* ${customer.notes}\n\n`

    if (verificationLink) {
      m += '🔗 *رابط موثق لتأكيد تفاصيل وأسعار الطلب (للفريق):*\n'
      m += `${verificationLink}\n\n`
    }

    m += '🙏 شكراً لاختياركم شيخ القهوة\n'
    m += '☕ نتشرف بخدمتكم'

    return m
  }

  const send = (items: CartItem[], customer: Customer, total: number, shippingFee: number) => {
    if (items.length === 0) return

    let verificationLink = ''
    if (import.meta.client) {
      const compact: CompactOrder = {
        n: customer.name,
        p: customer.phone,
        a: customer.address || '',
        nt: customer.notes || '',
        i: items.map(item => {
          if (item.type === 'single') {
            return {
              t: 's',
              id: item.productId || '',
              n: item.name,
              w: item.weight,
              pr: item.price,
              img: item.image,
              gr: item.gradient,
              ac: item.accent
            }
          } else {
            return {
              t: 'b',
              id: item.id,
              n: item.name,
              w: item.weight,
              q: item.quantity || 1,
              pr: item.price,
              img: item.components?.[0]?.image || item.image,
              gr: item.components?.[0]?.gradient || item.gradient,
              ac: item.components?.[0]?.accent || item.accent,
              c: item.components?.map(c => ({
                n: c.name,
                w: c.weight
              })) || []
            }
          }
        }),
        t: total,
        sf: shippingFee,
        ts: Date.now()
      }
      const { data, sig } = encodeOrder(compact)
      const origin = window.location.origin
      verificationLink = `${origin}/order/verify?d=${encodeURIComponent(data)}&s=${sig}`
    }

    const msg = buildMessage(items, customer, total, shippingFee, verificationLink)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
    if (import.meta.client) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return { send, buildMessage }
}
