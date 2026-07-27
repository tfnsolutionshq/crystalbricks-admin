// src/features/settings/mocks/settingsData.js
// Mock data for the Settings feature. Replace with real API/auth data later.

export const currentUser = {
  firstName: "Kelechi",
  lastName: "Nwachukwu",
  email: "kelechi@iil.com",
  emailVerified: true,
  phone: "+234 803 214 5567",
  jobTitle: "Software Engineer",
  department: "Engineering",
  avatarInitials: "KN",
};

export const securityOverview = {
  passwordLastChanged: "2026-04-12",
  twoFactorEnabled: false,
  twoFactorMethod: "email", // 'email' | 'sms'
};

export const devices = [
  {
    id: "DEV-001",
    deviceName: 'MacBook Pro 14"',
    browser: "Chrome on macOS",
    location: "Awka, Anambra State, NG",
    ip: "105.112.34.201",
    lastActive: "2026-07-27T09:14:00",
    current: true,
  },
  {
    id: "DEV-002",
    deviceName: "iPhone 14",
    browser: "Safari on iOS",
    location: "Awka, Anambra State, NG",
    ip: "105.112.34.198",
    lastActive: "2026-07-26T21:40:00",
    current: false,
  },
  {
    id: "DEV-003",
    deviceName: "Windows PC",
    browser: "Edge on Windows 11",
    location: "Enugu, Enugu State, NG",
    ip: "197.210.55.12",
    lastActive: "2026-07-20T15:02:00",
    current: false,
  },
  {
    id: "DEV-004",
    deviceName: "Samsung Galaxy S22",
    browser: "Chrome on Android",
    location: "Oba, Anambra State, NG",
    ip: "197.210.88.44",
    lastActive: "2026-07-11T08:55:00",
    current: false,
  },
];
