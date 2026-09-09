# 🌱 NutriLearn: E-Learning & Child Malnutrition Monitoring Platform

**NutriLearn** is a digital health and nutrition application designed for parents, community health workers (BNS/BHW), and Municipal Health Offices. It translates evidence-based public health nutrition guidelines into interactive, actionable feeding practices to achieve a **10% annual reduction in child stunting**.

---

## 🎨 Theme & Design System
- **Color Palette**: Dark Green (`#0E3D26`, `#14532D`), Mint Accents (`#22C55E`, `#86EFAC`), Clean Neutrals (`#F7FAF8`, `#FFFFFF`), and high-visibility status badges (Stunted, Wasted, Underweight, Normal, Improved).
- **Aesthetic**: Simple, uncluttered, highly accessible for community health workers in field settings and parents on mobile devices.

---

## 🚀 Key Modules & Role-Based Workflows

### 1. 👨‍👩‍👧 Parents Portal (Primary Users)
- **5 Evidence-Based Learning Modules**:
  1. *Understanding Malnutrition & Stunting*: Low height-for-age, lifelong cognitive impacts, 10% reduction benchmark.
  2. *The First 1,000 Days Golden Window*: Exclusive breastfeeding (0-6 months) and timely complementary foods.
  3. *Pinggang Pinoy: Local & Affordable Foods*: Malunggay, Monggo, Camote, Dilis, Tilapia, Saba banana, and Eggs.
  4. *Age-Appropriate Feeding (6-23 Months)*: Texture progression and portion control.
  5. *Hygiene, Water & Safe Food Prep*: WASH protocols preventing gut enteropathy and diarrhea.
- **Interactive Quizzes**: Instant answer verification and explanations for every question.
- **Certificate of Knowledge Mastery**: Awarded upon completing knowledge checks.
- **Budget-Friendly Meal Planner**: Pinggang Pinoy builder calculating healthy meals under ₱25–₱45 per serving.
- **Child Growth Tracker**: Monthly Height/Weight/MUAC monitoring.

### 2. 🩺 Community Health Worker (CHW / BNS / BHW) Tools
- **Child & Parent Malnutrition Registry**: Complete database with search and filters by Barangay and nutritional status.
- **Automated WHO Anthropometric Classification**:
  - Height-for-Age (Stunted / Normal)
  - Weight-for-Age (Underweight / Normal)
  - MUAC (Mid-Upper Arm Circumference) with color-coded band (<115mm Red, 115-124mm Yellow, ≥125mm Green).
- **Recovery Tracking**: Mark children whose nutritional status has improved or normalized.
- **Automated Reporting to Higher-Ups**: One-click electronic submission of aggregated malnutrition data to the Municipal Health Office.

### 3. 🏛️ Municipal Health Office (MHO / Higher-Ups) Dashboard
- **Executive Analytics**:
  - Progress tracker toward the **10% Stunting Reduction Goal**.
  - Current stunting prevalence vs baseline.
  - Malnutrition distribution breakdown.
- **Barangay Hotspot Table**: Prioritization of high-burden communities.
- **Incoming Reports Queue**: Review, endorse, and approve official health submissions.
- **Export & Printing**: Export registry and reports to CSV or print-ready formal health summaries.

---

## 📱 Cross-Platform Compatibility & Download

### 🖥️ Windows Compatibility
1. **1-Click Windows App**: Double click `NutriLearn-Windows.bat` to launch in dedicated standalone app mode.
2. **Direct Browser**: Double click `index.html` in any browser.
3. **PWA Desktop App**: Click the download button in the app header and choose *"Install as Web App (PWA)"* in Microsoft Edge or Chrome.

### 📱 Android Compatibility
1. **Downloadable APK**: Download `NutriLearn.apk` directly from the app's download modal or root folder and install on any Android phone.
2. **Instant Mobile PWA**: Open the web application in Android Chrome and select *"Add to Home Screen"* for a fullscreen offline-capable app.

---

## 📂 Project Structure
```
NUTRILEARN/
├── index.html                 # Single Page Application core
├── manifest.json              # Web App Manifest (PWA)
├── sw.js                      # Offline caching service worker
├── NutriLearn.apk             # Pre-built downloadable Android APK
├── NutriLearn-Windows.bat     # 1-click Windows desktop launcher
├── build_apk.py               # APK packaging script
├── css/
│   ├── styles.css             # Dark green design system & layout
│   └── components.css         # Cards, tables, quiz engine, meal builder
├── js/
│   ├── app.js                 # State, navigation, modals, and downloads
│   ├── data.js                # WHO standards, curricula, recipes, sample records
│   ├── healthWorker.js        # Registry, growth calculator, report submission
│   ├── parentLearning.js      # Lessons, quizzes, Pinggang Pinoy meal planner
│   ├── mhoDashboard.js        # MHO analytics, 10% stunting target, report approvals
│   └── exportUtils.js         # CSV export, printing, and LocalStorage persistence
└── assets/
    └── icons/
        ├── icon-192.svg       # 192x192 app icon
        └── icon-512.svg       # 512x512 app icon
```
