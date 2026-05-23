// stores/cart.ts
import { defineStore } from 'pinia'

export interface BlendComponent {
  productId: number
  name: string
  weight: number
  pricePerKg: number
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
  components?: BlendComponent[]
}

export interface Customer {
  name: string
  phone: string
  address: string
  notes: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    customer: { name: '', phone: '', address: '', notes: '' } as Customer,
    isOpen: false,
  }),

  getters: {
    count: (s) => s.items.length,
    totalWeight: (s) => s.items.reduce((sum, i) => sum + i.weight, 0),
    total: (s) => s.items.reduce((sum, i) => sum + i.price, 0),
  },

  actions: {
    add(item: Omit<CartItem, 'id'>) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      this.items.push({ ...item, id })
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
