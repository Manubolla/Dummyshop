# Products App

A simple React Native app built with [Expo Dev Client](https://docs.expo.dev/development/introduction/), using the DummyJSON API to browse, filter, and sort products.

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Prebuild the native code

Run this once after installing dependencies or after adding native modules.

```bash
npm run prebuild
```

### 4. Start the development server

Use this to launch the Metro bundler. You'll open the app from the emulator or Dev Client afterward.

```bash
npm start
```

### 5. Run on iOS or Android emulator

This will compile and launch the app in the simulator/emulator using your Dev Client.

```bash
npx expo run:ios
# or
npx expo run:android
```

### 📱 Optional: Build for physical device (EAS Build)

You will need to make this instead of step 5 if you want to test notifications

```bash
npx eas build --profile development --platform ios
# or
npx eas build --profile development --platform android
```

> Make sure your project is linked to an Expo account and EAS is configured. Run npx expo login and npx eas build:configure if needed.

### Requirements

- Node.js >= 18
- Expo CLI: npm install -g expo-cli
- Expo Dev Client installed (via npx expo run:ios/android or EAS)
- Android Studio or Xcode for local emulation
- Optional: [EAS CLI](https://docs.expo.dev/eas/) for cloud builds

## Tech Stack

- **Expo SDK 53** with **Expo Dev Client**
- **React Native 0.79** + **React 19**
- **Expo Router 5** for file-based routing
- **Zustand** for state management
- **React Native Paper** for UI components
- **Expo Notifications**, **Device**, and **Splash Screen**
- **AsyncStorage** for persistence
- **TypeScript** for static typing

## Folder Structure

```txt
app/                  # Screens and routes (Expo Router)
  ├── [productId]/    # Dynamic product detail screen
  ├── _layout.tsx     # Shared layout for the stack
  ├── cart.tsx        # Cart screen
  ├── error.tsx       # Global error fallback screen
  └── index.tsx       # Home screen

src/                  # Source files
  ├── api/            # API services (DummyJSON)
  ├── components/     # Reusable UI components
  ├── data/           # Mappers and models
  ├── hooks/          # Custom hooks (e.g., debounce, notifications)
  ├── store/          # Zustand state management
  └── theme/          # Theme, colors, and styling

assets/               # Fonts, images, etc.
ios/                  # iOS native project folder (need to be generated)
android/              # Android native project folder (need to be generated)
```

---

## 🙋‍♂️ About the Author

Hi! I'm Manu, a software engineer from Argentina 🇦🇷 working with React Native.  
This app was built as part of a technical challenge for [Modak](https://www.modakmakers.com/).
If you had problems setting up the repo or want to give any feedback, feel free to connect.

- 💼 [LinkedIn](https://www.linkedin.com/in/manuel-bolla-agrelo/)

Thanks for checking out the project! 🚀
