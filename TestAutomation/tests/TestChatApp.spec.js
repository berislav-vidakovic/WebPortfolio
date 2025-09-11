// TestChatApp.spec.js
import { test, expect } from '@playwright/test';

test.only('get started link', async ({ page }) => {
  await page.goto('/');

  await page.pause();
});
