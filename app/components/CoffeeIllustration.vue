<!-- components/CoffeeIllustration.vue -->
<script setup lang="ts">
defineProps<{ variant: string; accent?: string }>()
</script>

<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
    <!-- Saucer + Cup (default) -->
    <g v-if="['yirgacheffe','mattari','santos','supremo','italian','french'].includes(variant)">
      <!-- Saucer -->
      <ellipse cx="100" cy="155" rx="65" ry="10" fill="rgba(0,0,0,0.25)"/>
      <ellipse cx="100" cy="150" rx="62" ry="9" fill="#F8F5F0"/>
      <ellipse cx="100" cy="148" rx="55" ry="6" fill="#EDE6DA"/>
      <!-- Cup body -->
      <path d="M58 95 L142 95 L135 148 Q135 152 130 152 L70 152 Q65 152 65 148 Z" fill="#F8F5F0"/>
      <path d="M58 95 L142 95 L135 148 Q135 152 130 152 L70 152 Q65 152 65 148 Z" fill="none" stroke="#D9C9B0" stroke-width="1"/>
      <!-- Handle -->
      <path d="M142 105 Q165 110 165 125 Q165 140 142 140" fill="none" stroke="#F8F5F0" stroke-width="6" stroke-linecap="round"/>
      <path d="M142 105 Q165 110 165 125 Q165 140 142 140" fill="none" stroke="#D9C9B0" stroke-width="1"/>
      <!-- Coffee surface -->
      <ellipse cx="100" cy="98" rx="40" ry="8" :fill="accent || '#5C4126'"/>
      <ellipse cx="100" cy="97" rx="35" ry="6" fill="#3E2723"/>
      <!-- Steam -->
      <path d="M85 80 Q80 70 88 60 Q95 50 87 40" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M100 75 Q95 65 103 55 Q110 45 102 35" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M115 80 Q110 70 118 60 Q125 50 117 40" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Cezve (Turkish pot) -->
    <g v-else-if="variant === 'turkish'">
      <ellipse cx="100" cy="170" rx="50" ry="6" fill="rgba(0,0,0,0.3)"/>
      <!-- Pot body -->
      <path d="M70 80 L130 80 L125 160 Q125 165 120 165 L80 165 Q75 165 75 160 Z" fill="#D4A85A"/>
      <path d="M72 85 L128 85" stroke="#B0701F" stroke-width="1.5"/>
      <path d="M75 100 L125 100" stroke="#B0701F" stroke-width="0.8"/>
      <!-- Top rim -->
      <ellipse cx="100" cy="80" rx="30" ry="5" fill="#E5A84C"/>
      <ellipse cx="100" cy="80" rx="26" ry="3" fill="#3E2723"/>
      <!-- Handle -->
      <rect x="125" y="105" width="55" height="6" fill="#5C4126" rx="3"/>
      <rect x="170" y="100" width="8" height="16" fill="#3E2723" rx="2"/>
      <!-- Steam -->
      <path d="M90 65 Q85 55 93 45" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M110 65 Q105 55 113 45" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Dallah (Arabic coffee pot) -->
    <g v-else-if="variant === 'saudi'">
      <ellipse cx="100" cy="170" rx="40" ry="5" fill="rgba(0,0,0,0.3)"/>
      <!-- Base -->
      <rect x="80" y="160" width="40" height="8" fill="#B0701F" rx="2"/>
      <!-- Body -->
      <path d="M75 95 Q75 80 100 80 Q125 80 125 95 L120 160 L80 160 Z" fill="#E5A84C"/>
      <path d="M78 100 L122 100" stroke="#B0701F" stroke-width="1"/>
      <!-- Spout -->
      <path d="M75 100 L55 85 L52 95 L75 110 Z" fill="#E5A84C" stroke="#B0701F" stroke-width="1"/>
      <!-- Lid + finial -->
      <path d="M80 75 L120 75 L115 65 L85 65 Z" fill="#D08A2C"/>
      <circle cx="100" cy="60" r="5" fill="#B0701F"/>
      <circle cx="100" cy="55" r="2" fill="#F0C674"/>
      <!-- Handle -->
      <path d="M125 105 Q145 115 145 135 Q145 155 125 150" fill="none" stroke="#D08A2C" stroke-width="6" stroke-linecap="round"/>
    </g>

    <!-- Coffee beans cluster -->
    <g v-else-if="['kenya','guatemala','mexican','costarica'].includes(variant)">
      <!-- Center bean -->
      <ellipse cx="100" cy="100" rx="35" ry="50" fill="#3E2723" transform="rotate(15 100 100)"/>
      <path d="M100 60 Q100 100 100 140" stroke="#1A100E" stroke-width="3" fill="none" transform="rotate(15 100 100)"/>
      <!-- Top left bean -->
      <ellipse cx="55" cy="65" rx="22" ry="32" fill="#5C4126" transform="rotate(-30 55 65)"/>
      <path d="M55 40 Q55 65 55 90" stroke="#3E2723" stroke-width="2" fill="none" transform="rotate(-30 55 65)"/>
      <!-- Top right bean -->
      <ellipse cx="150" cy="70" rx="20" ry="28" fill="#5C4126" transform="rotate(25 150 70)"/>
      <path d="M150 50 Q150 70 150 95" stroke="#3E2723" stroke-width="2" fill="none" transform="rotate(25 150 70)"/>
      <!-- Bottom left -->
      <ellipse cx="50" cy="145" rx="20" ry="28" fill="#2A1A17" transform="rotate(40 50 145)"/>
      <path d="M50 125 Q50 145 50 165" stroke="#0F0807" stroke-width="2" fill="none" transform="rotate(40 50 145)"/>
      <!-- Bottom right -->
      <ellipse cx="155" cy="140" rx="22" ry="30" fill="#2A1A17" transform="rotate(-20 155 140)"/>
      <path d="M155 115 Q155 140 155 165" stroke="#0F0807" stroke-width="2" fill="none" transform="rotate(-20 155 140)"/>
      <!-- Highlights -->
      <ellipse cx="92" cy="80" rx="6" ry="10" fill="rgba(255,255,255,0.1)" transform="rotate(15 92 80)"/>
    </g>

    <!-- Default fallback: coffee bag -->
    <g v-else>
      <ellipse cx="100" cy="175" rx="50" ry="6" fill="rgba(0,0,0,0.3)"/>
      <rect x="55" y="50" width="90" height="120" rx="6" :fill="accent || '#8C6D47'"/>
      <rect x="55" y="50" width="90" height="20" rx="6" fill="#3E2723"/>
      <circle cx="100" cy="110" r="20" fill="#F8F5F0" opacity="0.9"/>
      <text x="100" y="118" text-anchor="middle" font-size="16" font-weight="bold" fill="#3E2723">☕</text>
    </g>
  </svg>
</template>
