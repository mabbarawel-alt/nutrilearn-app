# NutriLearn 🥑👶
> **E-Learning & Malnutrition Surveillance Application for Parents and Community Health Workers**

NutriLearn is an evidence-based mHealth and e-learning application designed to combat childhood malnutrition by bridging the gap between clinical nutrition recommendations (WHO / UNICEF IYCF standards) and practical, low-cost home feeding practices.

---

## 🌟 Key Features by Role

### 1. 🥑 Parent & Caregiver Portal
- **The 4-Star Diet Food Plate**: Interactive guide to ensure meals include Staples, Animal Protein, Legumes/Nuts, and Protective Fruits/Vegetables.
- **Daily Feeding & Supplement Tracker**: Log meals, high-calorie snacks, water, and micronutrient powders (MNP) / Vitamin A.
- **Interactive Micro-Lessons with Quiz & Audio**: Bite-sized lessons with voice narration for low-literacy caregivers.
- **Affordable Recovery Recipes**: Local, nutrient-dense recipes (Super Porridge, Mung Bean Purees, Banana-Peanut Mash).
- **Growth Recovery Curve**: Track child weight gain trajectory toward age-appropriate target recovery milestones.

### 2. 🩺 Community Health Worker (CHW) Toolkit
- **Digital Anthropometric Screening**: Rapid intake capturing Weight (kg), Height (cm), MUAC (Mid-Upper Arm Circumference with color scale: Red <115mm SAM, Yellow 115-124mm MAM, Green ≥125mm Normal), and Bilateral Pitting Edema.
- **Active Caseload Management**: Filter and triage children by severity (SAM, MAM, Improving, Recovered).
- **Home Visit & Progress Logger**: Record weight increments, appetite test, and mark clinical recovery transitions.
- **Counseling Script Aid**: Structured talking points for household visits.

### 3. 📊 Supervisor & Public Health Surveillance Dashboard
- **Real-Time Telemetry**: Total children screened, Active SAM/MAM caseload, and Program Recovery Rate (%).
- **Community / Barangay Breakdown**: Geographical surveillance table.
- **Official Surveillance Reporting**: Generate, print/save PDF, export CSV, and transmit surveillance reports to Ministry of Health.

---

## 🚀 How to Run Locally

To test the application immediately on your computer or local network:

```powershell
# Navigate to the project folder
cd C:\Users\Dwin\.gemini\antigravity-ide\scratch\nutrilearn-app

# Start a local web server
python -m http.server 8080
```

Then open your browser at:
`http://localhost:8080` (or `http://<your-computer-ip>:8080` on your mobile phone connected to the same Wi-Fi).

---

## 📱 How to Build the Android APK (.apk)

NutriLearn is pre-configured with **Capacitor** and **Native Android Project Files** for 1-click APK compilation:

### Option A: Using Capacitor & Android Studio (Recommended)

1. **Install Dependencies & Add Android Platform**:
   ```bash
   npm install
   npm install @capacitor/cli @capacitor/core @capacitor/android
   npx cap add android
   ```

2. **Sync Web Assets**:
   ```bash
   npx cap copy android
   npx cap sync android
   ```

3. **Open in Android Studio & Build APK**:
   ```bash
   npx cap open android
   ```
   - In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
   - Your `.apk` file will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`.

### Option B: Command-Line Gradle Build (If Android SDK / JDK installed)
```bash
cd android
./gradlew assembleDebug
```
The resulting debug APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📂 Project Structure

```
nutrilearn-app/
├── index.html                  # Main app shell & viewports
├── css/
│   └── styles.css              # Health-tech design system & mobile styles
├── js/
│   ├── storage.js              # Offline-first local database & seed data
│   ├── parent-portal.js        # Caregiver e-learning, recipes & tracker
│   ├── chw-toolkit.js          # Screening intake (MUAC), caseload & visits
│   ├── supervisor-dashboard.js # Surveillance KPIs & official report generator
│   └── app.js                  # Main controller, role switcher & speech audio
├── android/                    # Android Native Gradle & Manifest template
├── capacitor.config.json       # Mobile APK build configuration
├── package.json                # NPM project scripts
└── README.md                   # Documentation
```
