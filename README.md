# شيخ القهوة — Sheikh El Qahwa

A premium, fully RTL Arabic coffee shop e-commerce built with **Nuxt 4**, **Vue 3**, **Pinia**, and **Tailwind CSS**.

## ✦ Features

- 🌙 Full **Dark/Light mode** with persistence
- 🌍 100% **Arabic RTL** with elegant typography (Reem Kufi + Cairo)
- 📱 **Native mobile app feel** — bottom tab nav, slide-up sheets, app-style header
- 🖥️ Premium **desktop experience**
- 🛒 **Persistent cart** via Pinia + localStorage
- 📲 **WhatsApp checkout** — opens `wa.me/+201004513892` with a beautifully formatted Arabic receipt
- ⚖️ **Weight + Budget selectors** — pick ⅛, ¼, ½, 1 kg OR enter EGP budget → app calculates weight
- ✦ **"Make Your Blend"** builder — combine multiple coffees with individual weights, name your creation, add to cart as one item
- 🔍 Search, sort, and filter products

## 🚀 Setup

```bash
# Install dependencies
npm install
# or: pnpm install / yarn install / bun install

# Run dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
sheikh-coffee/
├── app/
│   ├── app.vue                    # Root entry
│   ├── assets/css/main.css        # Tailwind + global styles
│   ├── components/
│   │   ├── AppHeader.vue          # Sticky top header
│   │   ├── AppToast.vue           # Toast notifications
│   │   ├── BlendBuilder.vue       # Custom blend feature
│   │   ├── BottomNav.vue          # Mobile bottom tab nav
│   │   ├── CartSheet.vue          # Cart slide-up sheet
│   │   ├── CoffeeIllustration.vue # SVG product illustrations
│   │   ├── ProductCard.vue        # Single product card
│   │   ├── ProductSheet.vue       # Product detail modal
│   │   └── SheikhLogo.vue         # Brand logo SVG
│   ├── composables/
│   │   ├── useCheckout.ts         # WhatsApp message builder
│   │   ├── useFormat.ts           # Price/weight formatters
│   │   └── useProducts.ts         # Product data + types
│   ├── layouts/default.vue        # Layout wrapper
│   ├── pages/
│   │   ├── index.vue              # Home
│   │   ├── shop.vue               # Full catalog
│   │   ├── blend.vue              # Blend builder page
│   │   └── about.vue              # About + contact
│   └── stores/
│       ├── cart.ts                # Cart + customer state (persisted)
│       └── ui.ts                  # Theme + toasts
├── public/favicon.svg
├── nuxt.config.ts                 # Nuxt 4 config + RTL setup
├── tailwind.config.ts             # Custom palette + animations
├── package.json
└── tsconfig.json
```

## 🎨 Design Tokens

The palette lives in `tailwind.config.ts`:

- **`ink`** — coffee browns (50 → 900). `#3E2723` for light mode primary, `#1A100E` for dark.
- **`amber`** — gold accents (300 → 600). Used for highlights and CTAs in dark mode.
- **`cream`** — warm off-white background.

Typography:
- Display: **Reem Kufi** (for headlines)
- Body: **Cairo** (for UI text)
- Serif: **Amiri** (optional decorative)

## 📲 WhatsApp Integration

The order is sent as a beautifully formatted Arabic message to `+20 100 451 3892`. Edit the number in `app/composables/useCheckout.ts`:

```ts
const WHATSAPP_NUMBER = '201004513892'
```

## 🛒 Cart Persistence

Cart items + customer info persist to `localStorage` via `pinia-plugin-persistedstate`. Configured in `nuxt.config.ts` and `stores/cart.ts`.

## 📝 License

MIT — yours to ship.
