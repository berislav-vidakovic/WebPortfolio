// TestChatApp.spec.js
import { test, expect } from '@playwright/test';

test.only('get started link', async ({ page }) => {
  console.log("Hello world from ChatApp TAS! Navigating page...");
  await page.goto('/');
  console.log("...Page visited! Goodbye!");

  //await page.pause();
});
