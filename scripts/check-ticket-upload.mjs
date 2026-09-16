import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/load-desk', {
    waitUntil: 'networkidle',
  });
  await page.locator('input[type=file]').setInputFiles(process.argv[2]);
  await page
    .getByRole('button', { name: 'Extract tickets', exact: true })
    .click();
  await page
    .getByText('2 tickets ready for review.', { exact: true })
    .waitFor({ timeout: 180000 });
  for (let i = 1; i <= 2; i++) {
    if (i === 2)
      await page
        .getByRole('button', { name: 'Next ticket', exact: true })
        .click();
    const text = await page
      .getByRole('textbox', { name: 'Ticket text to parse' })
      .inputValue();
    writeFileSync(`tests/fixtures/browser-${i}.txt`, text);
    console.log(text.slice(0, 1700));
  }
} finally {
  await browser.close();
}
