import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Verify Workflow: Owner creation, Box creation, Print, Status Update', async ({ page }) => {
  test.setTimeout(90000);

  const verificationDir = path.resolve('/home/jules/verification');
  if (!fs.existsSync(verificationDir)) {
    fs.mkdirSync(verificationDir, { recursive: true });
  }

  const takeScreenshot = async (name: string) => {
    await page.screenshot({ path: path.join(verificationDir, `${name}.png`), fullPage: true });
    console.log(`Saved screenshot: ${name}.png`);
  };

  page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));
  page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

  console.log('Navigating to login page...');
  await page.goto('http://localhost:5173/');

  await page.waitForTimeout(5000); // Wait for things to settle
  await takeScreenshot('0-initial-load');

  // Check if we are at auth or somewhere else
  const url = page.url();
  console.log(`Current URL: ${url}`);

  if (url.includes('/auth')) {
      await takeScreenshot('1-login-page');

      console.log('Switching to Register tab...');
      const registerTab = page.getByRole('tab', { name: 'Register' }); // Changed to getByRole tab
      if (await registerTab.isVisible()) {
        await registerTab.click();
      } else {
         // Fallback click
         await page.click('#tab-register');
      }

      console.log('Filling registration form...');
      await page.fill('#fullName', 'Jules Autobot');
      await page.fill('#email', 'Jules@Autobot.com');
      await page.fill('#password', 'password123');
      await page.fill('#confirmPassword', 'password123');

      const newMoveRadio = page.locator('#moveMode-new');
      if (await newMoveRadio.isVisible()) {
          await newMoveRadio.check();
      }

      await takeScreenshot('2-registration-form-filled');

      console.log('Submitting registration...');
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Wait for navigation to /app (Dashboard)
      await page.waitForURL('**/app', { timeout: 30000 });
      await takeScreenshot('3-dashboard-after-login');
      console.log('Logged in successfully.');
  } else if (url.includes('/app')) {
      console.log('Already logged in?');
      await takeScreenshot('3-dashboard-already-login');
  } else {
      console.log('Unexpected URL. Attempting to force navigate to /auth if not there.');
  }

  // 3. Navigate to Owners
  console.log('Navigating to Owners...');
  await page.goto('http://localhost:5173/app/owners');
  await page.waitForTimeout(2000);
  await takeScreenshot('4-owners-page-empty');

  // 4. Create Owner
  console.log('Creating Owner...');
  // Inspecting button text from previous knowledge or generic
  // Let's print the page content to debug if we can't find it
  // console.log(await page.content());

  const addOwnerButton = page.getByRole('button', { name: /Add Owner|New Owner|Create Owner/i });
  if (await addOwnerButton.isVisible()) {
    await addOwnerButton.click();
    await page.waitForTimeout(500);
    await takeScreenshot('4b-add-owner-modal');

    // Fill form
    await page.fill('input[name="name"], input[placeholder*="Name"]', 'Test Owner');

    // Submit
    const saveButton = page.getByRole('button', { name: /Save|Add|Create|Submit/i }).last();
    await saveButton.click();
    await page.waitForTimeout(1000);
    await takeScreenshot('5-owner-created');
  } else {
    console.log('Could not find Add Owner button.');
  }

  // 5. Navigate to Boxes
  console.log('Navigating to Boxes...');
  await page.goto('http://localhost:5173/app/boxes');
  await page.waitForTimeout(2000);
  await takeScreenshot('6-boxes-page');

  // 6. Create Box
  console.log('Creating Box...');
  const addBoxButton = page.getByRole('button', { name: /Add Box|New Box|Create Box/i });
  if (await addBoxButton.isVisible()) {
      await addBoxButton.click();
      await page.waitForTimeout(500);
      await takeScreenshot('6b-add-box-modal');

      await page.fill('input[name="name"], input[placeholder*="content"]', 'Kitchen Utensils');

      const createBoxConfirm = page.getByRole('button', { name: /Create|Save|Add/i }).last();
      if (await createBoxConfirm.isVisible()) await createBoxConfirm.click();
      await page.waitForTimeout(1000);
      await takeScreenshot('7-box-created');
  } else {
      console.log('Could not find Add Box button');
  }

  // 7. Print Label (Mock)
  console.log('Printing Label...');
  // Look for a print icon. Often these are icon-only buttons.
  // We can try to find by aria-label "Print" or similar.
  const printButton = page.locator('button').filter({ hasText: /Print/i }).first();
  // Or generic selector for icon

  if (await printButton.isVisible()) {
      await printButton.click();
      await page.waitForTimeout(2000);
      await takeScreenshot('8-print-dialog');
  } else {
      console.log('Could not find Print button');
      // Try finding an icon
      const printIconBtn = page.locator('button svg path[d*="print"], button svg title:text("Print")').first().locator('..').locator('..');
      // This is getting brittle. Let's see what the screenshot shows.
  }

  // 8. Update Status
  console.log('Updating Status...');
  // Try to find a badge or select that indicates status
  const statusTrigger = page.locator('button, div[role="button"]').filter({ hasText: /Packing|Transit|Unpacked/i }).first();
  if (await statusTrigger.isVisible()) {
      await statusTrigger.click();
      await page.waitForTimeout(500);
      await takeScreenshot('9a-status-dropdown');

      const nextStatus = page.getByRole('menuitem').filter({ hasText: /In Transit/i }).first();
      if (await nextStatus.isVisible()) {
          await nextStatus.click();
      } else {
          // Maybe it's a select option
           const option = page.getByRole('option', { name: /In Transit/i }).first();
           if (await option.isVisible()) await option.click();
      }
      await page.waitForTimeout(1000);
      await takeScreenshot('9b-status-updated');
  } else {
       console.log('Could not find status trigger');
  }

});
