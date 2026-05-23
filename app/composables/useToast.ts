// composables/useToast.ts
import { useState } from '#app'

export interface Notification {
  id: string
  title?: string
  description?: string
  icon?: string
  avatar?: any
  closeButton?: any
  timeout?: number
  actions?: any[]
  click?: (notification: Notification) => void
  callback?: () => void
  color?: string
}

export function useToast() {
  const notifications = useState<Notification[]>('notifications', () => [])

  function add(notification: Omit<Notification, 'id'> & { id?: string }) {
    const body: Notification = {
      id: notification.id || new Date().getTime().toString(),
      ...notification
    }
    const index = notifications.value.findIndex((n) => n.id === body.id)
    if (index === -1) {
      notifications.value.push(body)
    }
    return body
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  function update(id: string, notification: Partial<Notification>) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      const previous = notifications.value[index]
      notifications.value.splice(index, 1, { ...previous, ...notification })
    }
  }

  function clear() {
    notifications.value = []
  }

  return {
    add,
    remove,
    update,
    clear
  }
}
