<!-- components/AppToast.vue -->
<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
const ui = useUIStore()
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="ui.toast.show"
      class="fixed bottom-24 lg:bottom-8 right-1/2 translate-x-1/2 z-[60] px-5 py-3 rounded-full shadow-lift font-bold text-sm flex items-center gap-2"
      :class="{
        'bg-ink-900 dark:bg-amber-400 text-cream dark:text-ink-900': ui.toast.type === 'success',
        'bg-red-500 text-white': ui.toast.type === 'error',
        'bg-ink-700 text-white': ui.toast.type === 'info',
      }"
    >
      <svg v-if="ui.toast.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" d="M5 13l4 4L19 7"/>
      </svg>
      <svg v-else-if="ui.toast.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" d="M12 9v2m0 4h.01M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      {{ ui.toast.message }}
    </div>
  </Transition>
</template>
