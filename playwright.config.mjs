import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  // Start Next.js dev server pointing at the test database before E2E tests.
  webServer: {
    command:
      "DATABASE_URL=postgresql://postgres:testpassword123@localhost:5432/bikeyard_test NEXTAUTH_SECRET=test-nextauth-secret-do-not-use-in-production-32chars NEXTAUTH_URL=http://localhost:3000 PORT=3000 npx next dev --port 3000",
    port: 3000,
    timeout: 120000,
    reuseExistingServer: true,
    env: {
      DATABASE_URL: "postgresql://postgres:testpassword123@localhost:5432/bikeyard_test",
      NEXTAUTH_SECRET: "test-nextauth-secret-do-not-use-in-production-32chars",
      NEXTAUTH_URL: "http://localhost:3000",
      PORT: "3000",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
