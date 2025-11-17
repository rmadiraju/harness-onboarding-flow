import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,          // allow tests in a file to run in parallel
  // workers: '50%',            // optional: tune parallelism

  projects: [
    {
      name: 'chromium-admin',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/admin.json',
      },
      // Only run tests tagged @admin or @all
      grep: /@admin|@all/,
    },
    {
      name: 'chromium-manager',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/manager.json',
      },
      // Only run tests tagged @manager or @all
      grep: /@manager|@all/,
    },
    {
      name: 'firefox-admin',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/admin.json',
      },
      grep: /@admin|@all/,
    },
    {
      name: 'firefox-manager',
      use: {
        ...devices['Desktop Firefox'],
        storageState: '.auth/manager.json',
      },
      grep: /@manager|@all/,
    },
  ],
});
