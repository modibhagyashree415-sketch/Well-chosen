# ✨ Well Chosen — Thoughtful Curated Gift Recommendation & Commerce Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-success?style=for-the-badge&logo=github)](https://modibhagyashree415-sketch.github.io/Well-chosen/)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%2B%20JS-blue?style=for-the-badge)](https://developer.mozilla.org/en-US/)
[![Responsive](https://img.shields.io/badge/Responsive-Mobile%20%26%20Desktop-orange?style=for-the-badge)](https://modibhagyashree415-sketch.github.io/Well-chosen/)
[![Academic Project](https://img.shields.io/badge/Project-Industrial%20Training-purple?style=for-the-badge)](#-industrial-training-overview)

> **"Find the perfect gift, every time."**  
> A front-end web application that eliminates gifting stress through an interactive recommendation engine, curated artisanal catalog, occasion-based navigation, and seamless client-side state management.

🌐 **Live Website Link:** [https://modibhagyashree415-sketch.github.io/Well-chosen/](https://modibhagyashree415-sketch.github.io/Well-chosen/)

---

## 📌 Table of Contents

- [The Problem \& Solution](#-the-problem--solution)
- [Key Features](#-key-features)
- [Interactive Gift Finder Quiz Workflow](#-interactive-gift-finder-quiz-workflow)
- [Technology Stack](#-technology-stack)
- [Project Architecture \& Directory Structure](#-project-architecture--directory-structure)
- [Local Development Setup](#-local-development-setup)
- [GitHub Pages Deployment Instructions](#-github-pages-deployment-instructions)
- [Industrial Training Overview](#-industrial-training-overview)
- [Image Sources \& Creative Attribution](#-image-sources--creative-attribution)

---

## 💡 The Problem & Solution

### The Challenge
When shopping for gifts, users often experience decision paralysis due to endless unfiltered product listings, generic item descriptions, and unclear suitability for specific relationships or occasions.

### The Well Chosen Solution
**Well Chosen** bridges emotional intent with smart curation:
1. **Interactive 4-Step Quiz (`giftfinder.html`)**: Evaluates recipient relationship, celebration occasion, aesthetic vibe, and budget to calculate ranked match percentages.
2. **Curated Catalog (`shop.html`)**: Features handpicked artisanal gifts with multi-factor filtering (category chips, occasion dropdown, price-range pills, dynamic search, and price sorting).
3. **Optimized Performance**: Clean, lightweight architecture built purely with semantic HTML5, modern vanilla CSS3 design tokens, and modular JavaScript without heavy third-party framework overhead.

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **🧠 Smart Gift Finder Quiz** | Interactive 4-step selector that scores gifts based on relationship, occasion, vibe, and budget with instant match percentages. |
| **🛍️ Multi-Dimensional Catalog** | Filter products across 8 categories, 6 occasions, and 3 budget brackets with instant sorting and keyword search. |
| **🔍 Real-Time Global Search** | Modal-based live search overlay that queries gift titles, categories, occasions, and descriptions as you type. |
| **🛒 Cart & Wishlist System** | Client-side persistent state via browser `localStorage` with active badge counters and toast notifications. |
| **👁️ Interactive Quick View** | Glassmorphic popup modal displaying high-res photos, star ratings, discounts, and instant "Add to Cart". |
| **🎠 Autoplay Hero Slider** | Responsive carousel highlighting trending seasonal collections with pause-on-hover and touch swipe support. |
| **🎨 Luxury Visual Aesthetics** | Curated palette (`#6B2D5C` royal plum, `#FF6B6B` coral, `#E8B54D` warm gold) with glassmorphism and subtle micro-animations. |
| **📱 Mobile-First Responsive** | Hamburger navigation drawer, fluid typography using `clamp()`, and touch-friendly targets. |

---

## 🎯 Interactive Gift Finder Quiz Workflow

```
[ Step 1: Recipient ] 
  ├── Partner / Spouse 💍
  ├── Best Friend 👯
  ├── Parents / Family 🏡
  ├── Brother or Sister 🤝
  └── Colleague / Boss 💼
            │
            ▼
[ Step 2: Occasion ]
  ├── Birthday 🎂
  ├── Anniversary 🥂
  ├── Valentine's Day 💖
  ├── Wedding / Reception 🎊
  ├── Festive / Diwali / Rakhi 🪔
  └── Just Because / Thank You ✨
            │
            ▼
[ Step 3: Vibe & Interest ]
  ├── Aesthetic & Cozy (Candles & Home) 🕯️
  ├── Romantic & Floral (Roses & Bouquets) 🌹
  ├── Gourmet Sweets (Artisan Chocolates) 🍫
  ├── Personal Keepsake (Photo Mugs & Frames) 🖼️
  └── Luxury & Indulgent (Perfumes & Hampers) ✨
            │
            ▼
[ Step 4: Budget Range ]
  ├── Under ₹500
  ├── ₹500 - ₹1000
  ├── Above ₹1000
  └── Any Budget
            │
            ▼
[ Recommendation Engine ] ──► Calculates Weighted Match Score (e.g., "98% Match")
                              Displays Curated Recommendations + Direct "Add to Cart"
```

---

## 💻 Technology Stack

- **HTML5:** Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`) with structured heading hierarchies and SEO meta tags.
- **Vanilla CSS3:** 
  - CSS Custom Properties (Design Tokens for colors, spacing, radii, shadows)
  - CSS Flexbox & CSS Grid layouts
  - Glassmorphism effects (`backdrop-filter: blur(14px)`)
  - Smooth keyframe transitions and micro-interactions
- **Vanilla JavaScript (ES6+):**
  - Modular scripts (`products.js`, `app.js`, `shop.js`, `quiz.js`)
  - Browser `localStorage` API for cart and wishlist persistence
  - DOM Event Delegation and URLSearchParams routing
- **Typography & Icons:**
  - Google Fonts: [Outfit](https://fonts.google.com/specimen/Outfit), [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), and [Inter](https://fonts.google.com/specimen/Inter)
  - [Font Awesome 6 Free](https://fontawesome.com/) vector iconography

---

## 📂 Project Architecture & Directory Structure

```
Well-chosen/
├── index.html                  # Landing page (Hero, Occasion chips, Trending, Slider, CTA)
├── shop.html                   # Filterable product catalog with live search and sorting
├── giftfinder.html             # Smart 4-step interactive gift recommendation quiz
├── occasions.html              # Curated celebration gateway (Birthdays, Weddings, Rakhi, etc.)
├── about.html                  # Brand narrative, industrial training details, and image credits
├── contact.html                # Concierge support cards, form validation, and feedback
├── style.css                   # Complete design system & responsive styling tokens
├── js/
│   ├── products.js             # Central product catalog data array (15 curated items)
│   ├── app.js                  # Shared navbar toggle, global live search, cart/wishlist, toasts
│   ├── quiz.js                 # Multi-factor quiz algorithm and dynamic results engine
│   └── shop.js                 # Dynamic shop filter controls and catalog renderer
├── images/                     # Standardized lowercase-hyphenated image assets
│   ├── aesthetic-scented-candles.jpg
│   ├── artisan-chocolate-box.jpg
│   ├── cozy-candle-decor.jpg
│   ├── custom-floral-memory-frame.jpg
│   ├── diwali-hamper.jpg
│   ├── family-collage-mug.jpg
│   ├── festive-gift-hamper.jpg
│   ├── heart-chocolate-box.jpg
│   ├── luxury-perfume-set.jpg
│   ├── luxury-red-roses.jpg
│   ├── peacock-rakhi-combo.jpg
│   ├── pet-portrait-mug.jpg
│   ├── soap-flower-frame.jpg
│   ├── sunflower-rose-bouquet.jpg
│   └── sunshine-flower-bouquet.jpg
└── README.md                   # Comprehensive project documentation & live demo guide
```

---

## 🚀 Local Development Setup

To inspect and run the project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/modibhagyashree415-sketch/Well-chosen.git
   cd Well-chosen
   ```

2. **Serve with any local web server:**
   - **Using Python 3:**
     ```bash
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.
   - **Using VS Code Live Server:**  
     Right-click `index.html` and click **"Open with Live Server"**.
   - **Direct File Inspection:**  
     Double-click `index.html` to open directly in Google Chrome, Microsoft Edge, or Mozilla Firefox.

---

## 🌐 GitHub Pages Deployment Instructions

This repository is structured for zero-configuration, instant deployment on GitHub Pages:

1. Open your repository on GitHub: [`https://github.com/modibhagyashree415-sketch/Well-chosen`](https://github.com/modibhagyashree415-sketch/Well-chosen)
2. Click **Settings** (top right tab).
3. In the left navigation menu, click **Pages**.
4. Under **"Build and deployment"**:
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main` and folder `/ (root)`
   - Click **Save**.
5. Within 1–2 minutes, GitHub will publish your live website at:  
   👉 **`https://modibhagyashree415-sketch.github.io/Well-chosen/`**

> **Presentation Tip:** Always keep a local copy or short screen recording on your laptop as a backup during academic presentations in case of intermittent Wi-Fi connectivity.

---

## 🎓 Industrial Training Overview

- **Project Title:** Well Chosen — Curated Gifting & Recommendation Web Platform
- **Developer:** Bhagyashree Modi
- **Domain:** Web Development & Front-End Engineering
- **Objectives Fulfilled:**
  - Implemented responsive, component-based user interfaces following modern design standards.
  - Engineered client-side state persistence for cart and wishlist using modern browser Web Storage APIs.
  - Developed an interactive algorithmic recommendation quiz matching user inputs against product properties.
  - Followed production-grade version control practices with clean, modular, and descriptive Git commits.

---

## 📷 Image Sources & Creative Attribution

In alignment with educational portfolio guidelines and fair-use attribution best practices:
- **Photography:** Curated aesthetic mockups and lifestyle imagery from [Unsplash](https://unsplash.com/) and [Pexels](https://www.pexels.com/) under open creative licenses.
- **Handcrafted Keepsakes:** Photographic references of custom pet portrait ceramics, Kundan Rakhis, and floral memory shadow boxes credited to artisan craft portfolios for educational demonstration.
- **Standardized Optimization:** All assets have been moved from the root directory into `images/` and renamed using lowercase alphanumeric characters with hyphens to ensure zero broken links across POSIX and Windows file systems.

---

*© 2026 Well Chosen. Crafted with care by Bhagyashree Modi.*
