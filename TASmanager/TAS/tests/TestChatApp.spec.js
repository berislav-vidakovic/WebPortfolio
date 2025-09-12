// TestChatApp.spec.js
import { test, expect } from '@playwright/test';

test.only('Test Case 1001: Chat App testing', async ({ page, baseURL }) => {

  console.log("Hello world from ChatApp TAS! Navigating to:", baseURL);

  await test.step(`Step 1 - Loading page...`, async () => {
    const response = await page.goto(baseURL);
    console.log('Page loaded, status:', response.status());
    //console.log('HTML content:',await page.content()); // HTML content inside container
    console.log("...Page loaded - PASSED!", baseURL);
  }); 
  await page.waitForTimeout(2000);

  await test.step(`Step 2 - Logging in...`, async () => {
    const sel = 'button#btnLogin';
    
    //const locBtn = page.locator(sel, { timeout: 5000 });
    //await locBtn.click({timeout: 5000});
    await page.locator(sel).waitFor({ state: 'visible', timeout: 10000 });
    await page.click(sel);

    console.log("...Login clicked - PASSED!", baseURL);

  }); 
  
  

  //await page.pause();
});

// Run from PS: 
// docker run -e TESTING_CHATAPP_URL=http://host.docker.internal:5173 testautomation