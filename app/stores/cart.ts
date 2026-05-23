// stores/cart.ts
import { defineStore } from 'pinia'

export const SHIPPING_AREAS = [
  { id: 'cairo-giza', label: 'القاهرة والجيزة', fee: 50 },
  { id: 'alex-delta', label: 'الإسكندرية والدلتا', fee: 70 },
  { id: 'canal', label: 'مدن القناة والساحل', fee: 90 },
  { id: 'upper-egypt', label: 'الصعيد والمحافظات البعيدة', fee: 120 },
] as const

export type ShippingAreaId = typeof SHIPPING_AREAS[number]['id']

export interface BlendComponent {
  productId: number
  name: string
  weight: number
  pricePerKg: number
  image?: string
  gradient?: string
  accent?: string
}

export interface CartItem {
  id: string
  type: 'single' | 'blend'
  productId?: number
  name: string
  image?: string
  gradient: string
  accent?: string
  weight: number
  pricePerKg?: number
  price: number
  quantity: number
  unitWeight?: number
  unitPrice?: number
  components?: BlendComponent[]
}

export interface Customer {
  name: string
  phone: string
  address: string
  shippingAreaId: '' | ShippingAreaId
  notes: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    customer: { name: '', phone: '', address: '', shippingAreaId: '', notes: '' } as Customer,
    isOpen: false,
  }),

  getters: {
    count: (s) => s.items.reduce((sum, i) => sum + (i.quantity || 1), 0),
    totalWeight: (s) => s.items.reduce((sum, i) => sum + i.weight, 0),
    total: (s) => s.items.reduce((sum, i) => sum + i.price, 0),
    shippingArea: () => undefined,
    shippingFee: () => 0,
    grandTotal: (s) => s.items.reduce((sum, i) => sum + i.price, 0),
  },

  actions: {
    add(item: Omit<CartItem, 'id' | 'quantity'> & Partial<Pick<CartItem, 'quantity' | 'unitWeight' | 'unitPrice'>>) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const quantity = item.quantity || 1
      const unitWeight = item.unitWeight || (item.type === 'blend' ? item.weight : undefined)
      const unitPrice = item.unitPrice || (item.type === 'blend' ? item.price : undefined)
      this.items.push({ ...item, id, quantity, unitWeight, unitPrice })
      this.isOpen = true
    },
    remove(id: string) {
      this.items = this.items.filter(i => i.id !== id)
    },
    adjustWeight(id: string, delta: number) {
      const item = this.items.find(i => i.id === id)
      if (!item || item.type === 'blend' || !item.pricePerKg) return
      const w = Math.max(0.125, +(item.weight + delta).toFixed(3))
      item.weight = w
      item.price = item.pricePerKg * w
    },
    adjustQuantity(id: string, delta: number) {
      const item = this.items.find(i => i.id === id)
      if (!item || item.type !== 'blend') return
      const quantity = Math.max(1, (item.quantity || 1) + delta)
      const unitWeight = item.unitWeight || item.weight / (item.quantity || 1)
      const unitPrice = item.unitPrice || item.price / (item.quantity || 1)
      item.quantity = quantity
      item.unitWeight = unitWeight
      item.unitPrice = unitPrice
      item.weight = +(unitWeight * quantity).toFixed(3)
      item.price = unitPrice * quantity
    },
    clear() {
      this.items = []
    },
    open() { this.isOpen = true },
    close() { this.isOpen = false },
  },

  persist: {
    pick: ['items', 'customer'],
  },
})
