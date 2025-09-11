# Terra Off-Road 🏔️

A comprehensive navigation and adventure companion app built for the off-roading and overlanding community. Terra Off-Road helps adventurers explore trails safely with advanced route planning, real-time navigation, and essential resource tracking.

## ✨ Features(Current and Under development)

### 🧭 Navigation & Location
- **Real-time GPS tracking** - Always know your current location
- **Custom route creation** - Plan your off-road adventures on trail maps
- **Non-vocal turn-by-turn navigation** - Visual guidance with sound or vibration without distracting voice prompts
- **Audio waypoint alerts** - Customizable sounds when reaching important points
- **Custom waypoint markers** - Customizable waypoint markers with icons or photos so users can have visual indicators of memorable visual points as they navigate. 
- **Haptic feedback** - Vibration alerts for key navigation events

### 🗺️ Trail Management
- **Trail difficulty ratings** - Know what you're getting into before you start
- **Distance tracking** - See route distances and your total trail miles
- **Custom waypoint creation** - Mark important spots with personal images for memories
- **Offline map support** - Navigate even without cell service

### 🛠️ Safety & Resources
- **Resource proximity alerts** - Find nearest fuel, water, food, and medical facilities
- **Offline location information** - Share/Save your coordinates for Overlanding base camps, water sources, and point of notability.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16.0 or higher)
- React Native CLI
- Android Studio
- Xcode (for iOS development)
- A physical device (recommended for GPS testing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/terra-offroad.git
cd terra-offroad
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Install iOS dependencies (if developing for iOS)
```bash
cd ios && pod install && cd ..
```

###IMPORTANT!!!
This application requires you have your own Google Maps API key. You can get it for Free(But note: you have to set your limits so you dont pay api charges)
# Google Maps API Setup

This app requires a Google Maps API key to function properly. Follow these steps to set it up:

## Getting Your Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Places API (if using places features)
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key (it will look like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)


## API Key Restrictions (Recommended)!!!!!!

For security, restrict your API key in the Google Cloud Console:

1. Go to your API key in **Credentials**
2. Click **Edit** 
3. Under **Application restrictions**:
   - For Android: Add your app's package name and SHA-1 fingerprint
   - For iOS: Add your app's bundle identifier
4. Under **API restrictions**: Select only the APIs you need

## Cost Information & Protection

Google Maps has a free tier, but it's important to protect yourself from unexpected charges:

### Free Tier Details
Google provides free monthly credits, but amounts and pricing can change. Always check the current details at [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing) before setting up your API key.

### Protecting Yourself from Charges
1. **Enable billing alerts** (see Quotas section above)
2. **Set conservative daily quotas** to limit usage (start low, increase if needed)
3. **Monitor usage** in Google Cloud Console under **APIs & Services** → **Enabled APIs**
4. **Consider disabling APIs** you're not using

**Important**: Start with low quotas and low budget alerts. You can always increase them later, but you can't undo unexpected charges.
## For Local Development

1. Clone this repository
2. Create a `.env` file in the root directory of the project
3. Add your API key to the `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
4. Make sure `.env` is in your `.gitignore` (it already should be)
5. Run `npm install` and start the app with `expo start` or `npm start`

## Troubleshooting

- **Maps not loading**: Double-check your API key is correct and the required APIs are enabled
- **"This page can't load Google Maps correctly"**: Your API key may be restricted or invalid
- **Quota exceeded**: Check your usage in Google Cloud Console and ensure billing is enabled for higher quotas


## 📱 Running the App

### Development Mode
```bash
# Start Metro bundler
npm start

# iOS (in a new terminal)
npm run ios

# Android (in a new terminal)
npm run android
```

### Testing on Device
```bash
# Build for device testing
npm run build:android
npm run build:ios
```

## 🛠️ Built With

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type safety and better development experience
- **React Navigation** - Navigation and routing
- **React Native Maps** - Interactive mapping functionality
- **React Native Geolocation** - GPS and location services
- **React Native AsyncStorage** - Local data persistence
- **React Native Sound** - Audio waypoint alerts
- **React Native Haptic Feedback** - Vibration alerts



```

## 🗺️ Key Features Usage

### Creating Custom Routes
1. Open the map screen
2. Tap "Plan Route" button
3. Add waypoints by tapping on the map
4. Set difficulty rating for each segment
5. Save route with custom name and description

### Setting Up Waypoints
1. Navigate to desired location
2. Tap "Add Waypoint" 
3. Take a photo or select from gallery
4. Add description and set alert preferences
5. Choose audio sound or vibration pattern

### Finding Resources
- The app automatically scans for fuel, water, food, and medical facilities
- View estimated distances from your current location
- Get turn-by-turn directions to selected resources

## ⚙️ Configuration

### Location Permissions
Make sure to grant location permissions for the app to work properly:
- **iOS**: Location services must be enabled in Settings
- **Android**: Grant "Precise Location" permission when prompted

### Offline Maps
Download map regions for offline use:
1. Go to Settings → Offline Maps
2. Select your adventure area
3. Download map data (requires WiFi)

## 🐛 Troubleshooting

### GPS Not Working
```bash
# Make sure location permissions are granted
# For iOS: Settings → Privacy → Location Services → Terra Off-Road → "While Using App"
# For Android: App Settings → Permissions → Location → "Precise Location"
```

### Maps Not Loading
```bash
# Check internet connection for online maps
# Verify offline maps are downloaded for remote areas
# Restart the app if maps appear blank
```

### Audio Alerts Not Playing
```bash
# Check device volume settings
# Verify notification permissions are enabled
# Test different alert sounds in Settings
```

## 📋 Upcoming Features

- [ ] Weather integration for trail conditions
- [ ] Community trail sharing and reviews
- [ ] Vehicle-specific route recommendations
- [ ] Emergency SOS functionality
- [ ] Trail photo sharing and memories
- [ ] Integration with popular overlanding forums
- [ ] Apple Watch and Android Wear support

## 🤝 Contributing


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Community

- **Project Link**: [https://github.com/yourusername/terra-offroad](https://github.com/yourusername/terra-offroad)
- **Issues**: [Report bugs or request features](https://github.com/yourusername/terra-offroad/issues)
- **Discussions**: Join our community forum for tips and trail recommendations

---

**Happy Trails! 🚙💨**

*Built by off-roaders, for off-roaders. Stay safe out there!*
