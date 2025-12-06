import { execSync } from 'child_process';

// Functionality to check for connected physical device via ADB or default to emulator
function getConnectedDevice(): string | null {
  try {
    const devices = execSync('adb devices -l', { encoding: 'utf-8' });
    const lines = devices.split('\n').filter(line => line.includes('device') && !line.includes('List of'));
    
    if (lines.length > 0) {
      const udid = lines[0].split(/\s+/)[0];
      console.log(`Found physical device: ${udid}`);
      return udid;
    }
  } catch (error) {
    console.error('Error checking for devices:', error);
  }
  
  console.log('No physical device found, will use emulator');
  return null;
}

export const config = {  
  runner: 'local',

  specs: ['./android_tests/specs/**/*.spec.ts'],

  maxInstances: 1,

  services: [
    [
      'appium',
      {
        logPath: './appium-logs',
      },
    ],
  ],

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:app': 'C:/Users/jason/Documents/dev/TerraOffRoad/android/app/build/outputs/apk/debug/app-debug.apk',
    'appium:noReset': true,
    'appium:newCommandTimeout': 300,
    'appium:skipServerInstallation': false,
    'appium:systemPort': 8200,
    'appium:disableWindowAnimation': true,
    'appium:skipUnlock': true,
    'appium:ignoreHiddenApiPolicyError': true,
    'appium:autoGrantPermissions': true,
  }],

  onPrepare: function (_config: any, capabilities: any[]) {
    const deviceUdid = getConnectedDevice();
    
    if (deviceUdid) {
      capabilities[0]['appium:udid'] = deviceUdid;
      capabilities[0]['appium:deviceName'] = 'Physical Device';
    } else {
      capabilities[0]['appium:deviceName'] = 'Android Emulator';
      capabilities[0]['appium:avd'] = 'Pixel_6_API_33';
      delete capabilities[0]['appium:udid'];
    }
  },

  logLevel: 'info',
  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 180000
  },

  waitforTimeout: 20000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  suites: {
    smoke: [
      './android_tests/specs/smoke_tests/**/*.spec.ts'
    ],
    home: [
      './android_tests/specs/home_screen_tests/**/*.spec.ts'
    ],
    all: [
      './android_tests/specs/**/*.spec.ts'
    ]
  },
};