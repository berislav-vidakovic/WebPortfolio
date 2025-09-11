// TestChatApp.spec.js
import { test, expect } from '@playwright/test';

test.only('get started link', async ({ page }) => {
  console.log("Hello world from ChatApp TAS!");
  await page.goto('/');

  //await page.pause();
});
