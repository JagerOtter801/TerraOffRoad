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
Auth0 Setup Guide
This project uses Auth0 for authentication. To run this app locally, you'll need to set up your own Auth0 account and create the required environment variables.


##Step 1: Create Auth0 Account

Go to https://auth0.com
Sign up for a free account
Choose a tenant name (this becomes your domain)

##Step 2: Create Application

In your Auth0 Dashboard, go to Applications
Click Create Application
Name it something like "Terra Off Road Local"
Choose Native as the application type
Click Create

##Step 3: Configure Application Settings
In your new application's settings:

Allowed Callback URLs: Add terraoffroad://callback
Allowed Logout URLs: Add terraoffroad://logout
Allowed Web Origins: Can leave empty for mobile
Scroll down and click Save Changes

##Step 4: Get Your Credentials
From your application's Settings tab, copy these values:

Domain (looks like your-tenant.auth0.com)
Client ID (long string of letters and numbers)

##Step 5: Create Environment File
Create a file called .env in the project root
Add these lines (replace with your actual values):

REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your_client_id_here
Important: Never commit your .env file to git. It's already in .gitignore.



##Step 6: Test Users (Optional)
To test login without allowing public signup:

Go to User Management → Users in Auth0 Dashboard
Click Create User
Enter email and password for test accounts

##Step 7: Run the App
Now you can run the app with your own Auth0 configuration:
bashnpm install
npm start
Troubleshooting
"Invalid redirect URI" error:

Make sure you added terraoffroad://callback to Allowed Callback URLs
Check that your application type is set to "Native"

Build errors with missing env variables:

Make sure your .env file is in the project root
Restart your development server after creating .env

Authentication not working:

Double-check your Domain and Client ID values
Make sure you're using the values from the correct Auth0 application


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
