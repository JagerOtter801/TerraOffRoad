import type { Options } from '@wdio/types';

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
    'appium:udid': 'R5CY10WG6VM',
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