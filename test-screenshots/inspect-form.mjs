import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('/Users/mahir/Code/tbh/test-screenshots', { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

const consoleMessages = [];
page.on('console', msg => {
  consoleMessages.push({ type: msg.type(), text: msg.text() });
});

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
console.log('--- Page loaded, waiting 6s for loader ---');
await page.waitForTimeout(6000);

// Step 5: Take screenshot
await page.screenshot({ path: '/Users/mahir/Code/tbh/test-screenshots/form-debug.png' });
console.log('Screenshot saved: form-debug.png');

// Step 6: Full page screenshot
await page.screenshot({ path: '/Users/mahir/Code/tbh/test-screenshots/form-debug-full.png', fullPage: true });
console.log('Full page screenshot saved: form-debug-full.png');

// Inspect form elements
console.log('\n=== FORM INSPECTION ===');
const formResult = await page.evaluate(() => {
  const form = document.querySelector('form');
  const inputs = document.querySelectorAll('form input, form select, form textarea, form button');
  return {
    formExists: !!form,
    formHTML: form?.innerHTML?.substring(0, 500),
    formStyles: form ? {
      display: window.getComputedStyle(form).display,
      backgroundColor: window.getComputedStyle(form).backgroundColor,
      padding: window.getComputedStyle(form).padding,
      borderRadius: window.getComputedStyle(form).borderRadius,
      width: window.getComputedStyle(form).width,
      height: window.getComputedStyle(form).height,
      overflow: window.getComputedStyle(form).overflow,
    } : null,
    inputCount: inputs.length,
    inputs: Array.from(inputs).map(el => ({
      tag: el.tagName,
      type: el.type,
      visible: el.offsetParent !== null,
      display: window.getComputedStyle(el).display,
      width: window.getComputedStyle(el).width,
      height: window.getComputedStyle(el).height,
      backgroundColor: window.getComputedStyle(el).backgroundColor,
      border: window.getComputedStyle(el).border,
      borderRadius: window.getComputedStyle(el).borderRadius,
      placeholder: el.placeholder,
      className: el.className,
    })),
    sectionStyles: (() => {
      const section = document.querySelector('form')?.closest('section');
      return section ? {
        display: window.getComputedStyle(section).display,
        padding: window.getComputedStyle(section).padding,
        width: window.getComputedStyle(section).width,
      } : null;
    })(),
  };
});
console.log(JSON.stringify(formResult, null, 2));

// Check Tailwind utilities
console.log('\n=== TAILWIND CLASS INSPECTION ===');
const twResult = await page.evaluate(() => {
  const form = document.querySelector('form');
  return {
    hasRounded3xl: form?.classList.contains('rounded-3xl'),
    formClasses: form?.className,
    formMaxWidth: window.getComputedStyle(form?.parentElement || {}).maxWidth,
    wrapperDiv: form?.parentElement?.className,
    outerSection: form?.closest('section')?.className,
  };
});
console.log(JSON.stringify(twResult, null, 2));

// Check select dropdown
console.log('\n=== SELECT DROPDOWN INSPECTION ===');
const selectResult = await page.evaluate(() => {
  const select = document.querySelector('select');
  return {
    exists: !!select,
    width: select ? window.getComputedStyle(select).width : null,
    height: select ? window.getComputedStyle(select).height : null,
    display: select ? window.getComputedStyle(select).display : null,
    appearance: select ? window.getComputedStyle(select).appearance : null,
    border: select ? window.getComputedStyle(select).border : null,
    borderRadius: select ? window.getComputedStyle(select).borderRadius : null,
    className: select?.className,
    optionCount: select?.options?.length,
    selectedValue: select?.value,
  };
});
console.log(JSON.stringify(selectResult, null, 2));

// Console errors
console.log('\n=== CONSOLE MESSAGES ===');
console.log(`Total messages: ${consoleMessages.length}`);
for (const msg of consoleMessages) {
  console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
}

await browser.close();
console.log('\nDone.');
