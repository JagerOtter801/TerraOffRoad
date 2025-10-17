// import 'dotenv/config';

// console.log('GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY);

export default {
  expo: {
    name: "TerraOffRoad",
    slug: "TerraOffRoad",
    scheme: "terraoffroad",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      eas: {
        projectId: "6259f25b-0f46-49c2-a26e-0e32f9bb9c65"
      }
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "This app needs access to your location to show maps and navigation.",
          isAndroidBackgroundLocationEnabled: false,
          isAndroidForegroundServiceEnabled: false
        }
      ]
    ],
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      permissions: [
        "CAMERA",
        "RECORD_AUDIO",
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      config: {
        auth0Domain: process.env.REACT_APP_AUTH0_DOMAIN,
        auth0Scheme: "terraoffroad",
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      package: "com.anonymous.TerraOffRoad"
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};