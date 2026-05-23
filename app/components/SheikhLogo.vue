<!-- components/SheikhLogo.vue -->
<template>
  <svg :class="$attrs.class" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="circle-bg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#B89C72" />
        <stop offset="100%" stop-color="#8C6D47" />
      </radialGradient>
    </defs>
    <circle cx="100" cy="100" r="98" fill="url(#circle-bg)" stroke="#5C4126" stroke-width="2"/>

    <!-- Coffee beans -->
    <g>
      <ellipse cx="55" cy="78" rx="6" ry="10" fill="#3E2723" transform="rotate(-25 55 78)"/>
      <path d="M55 70 Q55 78 55 86" stroke="#1A100E" stroke-width="1.5" fill="none" transform="rotate(-25 55 78)"/>
      <ellipse cx="46" cy="95" rx="6" ry="10" fill="#3E2723" transform="rotate(-15 46 95)"/>
      <path d="M46 87 Q46 95 46 103" stroke="#1A100E" stroke-width="1.5" fill="none" transform="rotate(-15 46 95)"/>
      <ellipse cx="55" cy="113" rx="6" ry="10" fill="#3E2723" transform="rotate(-30 55 113)"/>
      <path d="M55 105 Q55 113 55 121" stroke="#1A100E" stroke-width="1.5" fill="none" transform="rotate(-30 55 113)"/>
    </g>

    <!-- Turban -->
    <path d="M70 55 Q100 30 130 55 Q140 65 138 80 L62 80 Q60 65 70 55 Z" fill="#1F1F1F"/>
    <path d="M130 55 Q145 60 148 80 Q150 110 140 130 L132 125 Q138 110 135 90 Z" fill="#1F1F1F"/>
    <path d="M70 60 Q100 45 130 60" stroke="#0A0A0A" stroke-width="1" fill="none"/>

    <!-- Face -->
    <path d="M72 78 L128 78 L128 110 Q128 115 125 118 L75 118 Q72 115 72 110 Z" fill="#E8B584"/>

    <!-- Eyebrows -->
    <path d="M80 92 Q88 88 95 92" stroke="#2A1A17" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M105 92 Q112 88 120 92" stroke="#2A1A17" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- Eyes -->
    <ellipse cx="87" cy="100" rx="2" ry="2.5" fill="#2A1A17"/>
    <ellipse cx="113" cy="100" rx="2" ry="2.5" fill="#2A1A17"/>

    <!-- Beard -->
    <path d="M72 110 Q72 150 100 158 Q128 150 128 110 L128 118 Q125 120 122 120 L78 120 Q75 120 72 118 Z" fill="#F5F5F5"/>
    <line x1="80" y1="125" x2="80" y2="152" stroke="#D4D4D4" stroke-width="1"/>
    <line x1="88" y1="128" x2="88" y2="155" stroke="#D4D4D4" stroke-width="1"/>
    <line x1="96" y1="130" x2="96" y2="157" stroke="#D4D4D4" stroke-width="1"/>
    <line x1="104" y1="130" x2="104" y2="157" stroke="#D4D4D4" stroke-width="1"/>
    <line x1="112" y1="128" x2="112" y2="155" stroke="#D4D4D4" stroke-width="1"/>
    <line x1="120" y1="125" x2="120" y2="152" stroke="#D4D4D4" stroke-width="1"/>

    <!-- Mustache -->
    <path d="M85 113 Q100 108 115 113 Q110 117 100 117 Q90 117 85 113 Z" fill="#F5F5F5"/>

    <!-- Robe -->
    <path d="M50 165 Q60 148 80 148 L120 148 Q140 148 150 165 L150 200 L50 200 Z" fill="#7A6850"/>
    <path d="M85 148 L100 165 L115 148" stroke="#5C4126" stroke-width="1.5" fill="none"/>
  </svg>
</template>
