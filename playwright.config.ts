import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173/",
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
  },
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
