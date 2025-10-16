# Terra Off-Road 🏔️

## Try it out here on your Android phone: [⬇️ Download latest APK](https://github.com/JagerOtter801/TerraOffRoad/releases/latest/download/app-release.apk)

IOS: FUTURE TBD 



🗺️ ## Plan Smarter, Adventure Better
Never Miss a Moment on the Trail
TerraOffRoad helps you plan and navigate your off-road adventures with confidence. Before you hit the trail, mark essential waypoints like gas stations, hospitals, grocery stores, and campsites. Use detailed topographical maps to scout elevation changes at your campsite or trailhead—because knowing the terrain makes all the difference.
Stay Prepared with Location-Based Weather
Tap any waypoint to see current conditions and a 3-day forecast for that exact location. Planning a weekend camp? Check the weather ahead of time so you know whether to pack rain gear or sunscreen. No more getting caught off guard by mountain weather.
Track Your Progress in Real-Time
Out on the trail, save waypoints for places you want to remember: stunning viewpoints, hidden landmarks, geocaching spots, or that perfect camping spot you stumbled upon. Watch your live location on the map as you get closer to your saved waypoints—you'll always know how far you are from that overlook or trailhead you're searching for.

## Pack Smart with Gear Management
Stop forgetting critical gear. Use the built-in gear list to track everything you need across organized categories: Vehicle Items, Shelter, Sleeping System, Emergency/Medical, Clothing, Cooking, Food, Lighting/Signaling, Electronics, and Misc. Check off items as you pack, and never wonder if you forgot your first aid kit or camp stove again.
Whether you're planning your next adventure or creating memories on the go, TerraOffRoad keeps you organized, prepared, and connected to the places that matter most.


## 🚀 Getting Started

### Prerequisites
- Node.js (version 16.0 or higher)
- React Native CLI
- Android Studio
- Xcode (for iOS development)
- A physical device (recommended for GPS testing)
- Expo Go application on the Device
- **Google Maps API Key** (required for map functionality)
  - NOTE: This is only needed for React Native Maps to initialize. The app uses OpenStreetMap tiles, not Google Maps tiles.
     I still set API Quotas to be safe, so you should too. App has defensive programming to prevent quota issues. I am just very cautious by nature as a human and years of bug hunting has taught me: "There are always bugs in 100% of software so be smart"


### Installation:
1. Clone the repository
```bash
git clone https://github.com/yourusername/terra-offroad.git
cd terra-offroad
```

2. **Configure Google Maps API Key**
   - Copy `.env.example` to `.env`
```bash
   cp .env.example .env
```
   - Open `.env` and add your Google Maps API key:
```
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Maps SDK for Android" and "Maps SDK for iOS" in the console

3. Install dependencies
```bash
npm install
```

4. Install iOS dependencies (if developing for iOS)
```bash
cd ios && pod install && cd ..
```

## 📱 Running the App

### For Local Development
1. Ensure you've completed all installation steps including the API key setup
2. Start Metro bundler:
```bash
npx expo start
```
3. Using your mobile phone, launch Expo Go and scan the QR code

**Note:** The app won't display maps without a valid Google Maps API key configured in your `.env` file.

## ⚙️ Configurations
### Location Permissions
Make sure to grant location permissions for the app to work properly:
- **iOS**: Location services must be enabled in Settings
- **Android**: Grant "Precise Location" permission when prompted

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


*Built by off-roaders, for off-roaders. Stay safe out there!*
