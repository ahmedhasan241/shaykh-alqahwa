<!-- pages/about.vue -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>

<template>
  <div class="animate-fade-in pt-6">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-10">
        <SheikhLogo class="w-32 h-32 sm:w-40 sm:h-40 mx-auto logo-glow" />
        <div class="flex items-center justify-center gap-2 mt-6 mb-2">
          <span class="ornament text-amber-400"></span>
          <span class="text-amber-500 text-xs tracking-[0.3em] font-semibold">EST. 1972</span>
          <span class="ornament text-amber-400"></span>
        </div>
        <h1 class="font-display text-4xl sm:text-5xl font-bold mb-2">شيخ القهوة</h1>
        <p class="text-ink-400">مذاق كما تهوى</p>
      </div>

      <div class="space-y-6 leading-loose text-ink-700 dark:text-ink-100">
        <p class="text-lg">
          منذ أكثر من نصف قرن، ونحن نُقدّم لعملائنا الكرام أجود أنواع البن المُحمّص بعناية فائقة.
          نختار حبوب القهوة من أفضل المزارع حول العالم — إثيوبيا، اليمن، البرازيل، كولومبيا —
          ونُحمّصها يومياً بأيدي خبراء.
        </p>
        <p>
          نؤمن أن لكل عميل ذوقه الخاص، ولهذا أتحنا لكم فرصة تصميم خلطتكم الفريدة
          من أنواع متعددة بالنسب التي تُحبّونها. كوب القهوة عندنا ليس مجرد مشروب،
          بل تجربة وذكرى.
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-3 sm:gap-4 mt-10">
        <div class="text-center p-5 bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700">
          <div class="text-2xl sm:text-3xl font-display font-bold text-amber-500">+٥٠</div>
          <div class="text-xs text-ink-400 mt-1">سنة خبرة</div>
        </div>
        <div class="text-center p-5 bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700">
          <div class="text-2xl sm:text-3xl font-display font-bold text-amber-500">+١٢</div>
          <div class="text-xs text-ink-400 mt-1">نوع قهوة</div>
        </div>
        <div class="text-center p-5 bg-white dark:bg-ink-800 rounded-2xl border border-ink-100 dark:border-ink-700">
          <div class="text-2xl sm:text-3xl font-display font-bold text-amber-500">+٢٠ك</div>
          <div class="text-xs text-ink-400 mt-1">عميل سعيد</div>
        </div>
      </div>

      <!-- Contact -->
      <div class="mt-10 p-6 bg-gradient-to-br from-ink-700 to-ink-800 dark:from-ink-800 dark:to-black rounded-3xl text-cream grain">
        <h2 class="font-display text-2xl font-bold mb-4">تواصل معنا</h2>
        <div class="space-y-3 text-sm">
          <a href="https://wa.me/201004513892" class="flex items-center gap-3 hover:text-amber-300 transition">
            <span class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">📱</span>
            <span dir="ltr">+20 100 451 3892</span>
          </a>
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">📍</span>
            <span>القاهرة، مصر</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">⏰</span>
            <span>يومياً من ٨ صباحاً حتى ١٢ منتصف الليل</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
