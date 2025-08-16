# Terra Off-Road 🏔️

A comprehensive navigation and adventure companion app built for the off-roading and overlanding community. Terra Off-Road helps adventurers explore trails safely with advanced route planning, real-time navigation, and essential resource tracking.

## ✨ Features

### 🧭 Navigation & Location
- **Real-time GPS tracking** - Always know your current location
- **Custom route creation** - Plan your off-road adventures on trail maps
- **Non-vocal turn-by-turn navigation** - Visual guidance without distracting voice prompts
- **Audio waypoint alerts** - Customizable sounds when reaching important points
- **Haptic feedback** - Vibration alerts for key navigation events

### 🗺️ Trail Management
- **Trail difficulty ratings** - Know what you're getting into before you start
- **Distance tracking** - See route distances and your total trail miles
- **Custom waypoint creation** - Mark important spots with personal images for memories
- **Offline map support** - Navigate even without cell service

### 🛠️ Safety & Resources
- **Resource proximity alerts** - Find nearest fuel, water, food, and medical facilities
- **Emergency location sharing** - Share your coordinates when needed
- **Trail conditions reporting** - Community-driven trail status updates

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

4. Set up environment variables
```bash
# Copy example environment file
cp .env.example .env
# Add your API keys for maps, weather, etc.
```

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

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── maps/          # Map-related components
│   │   ├── navigation/    # Navigation UI components
│   │   ├── waypoints/     # Waypoint creation/management
│   │   └── common/        # Shared UI components
│   ├── screens/
│   │   ├── MapScreen/     # Main map interface
│   │   ├── RouteScreen/   # Route planning and management
│   │   ├── ProfileScreen/ # User stats and settings
│   │   └── SettingsScreen/
│   ├── services/
│   │   ├── locationService.ts    # GPS and location handling
│   │   ├── routeService.ts       # Route calculation and management
│   │   ├── resourceService.ts    # Fuel/water/food/medical finder
│   │   └── storageService.ts     # Local data management
│   ├── utils/
│   │   ├── distanceCalculator.ts # Distance and navigation math
│   │   ├── trailDifficulty.ts    # Trail rating algorithms
│   │   └── coordinates.ts        # GPS coordinate utilities
│   └── types/
│       ├── navigation.ts         # Navigation type definitions
│       ├── waypoint.ts          # Waypoint and route types
│       └── resources.ts         # Resource location types
├── android/               # Android-specific code
├── ios/                  # iOS-specific code
└── assets/
    ├── maps/             # Offline map data
    ├── sounds/           # Waypoint alert sounds
    └── icons/            # Trail difficulty and waypoint icons
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Test location services (requires device)
npm run test:location
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

We welcome contributions from the off-roading community!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/TrailWeather`)
3. Commit your changes (`git commit -m 'Add weather integration'`)
4. Push to the branch (`git push origin feature/TrailWeather`)
5. Open a Pull Request

## 📝 Feature Requests

Have an idea for Terra Off-Road? We'd love to hear it!
- Open an issue with the "enhancement" label
- Join our community discussions
- Share your off-roading experiences that could improve the app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Community

- **Project Link**: [https://github.com/yourusername/terra-offroad](https://github.com/yourusername/terra-offroad)
- **Issues**: [Report bugs or request features](https://github.com/yourusername/terra-offroad/issues)
- **Discussions**: Join our community forum for tips and trail recommendations

---

**Happy Trails! 🚙💨**

*Built by off-roaders, for off-roaders. Stay safe out there!*
