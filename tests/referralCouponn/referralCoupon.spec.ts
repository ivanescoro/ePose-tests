import { test, expect, chromium } from '@playwright/test';
import { login } from "../../utils/login";
import { waitForEmail } from '../../utils/gmail';

test('referral', async () => {
    test.setTimeout(300000);

    const browser = await chromium.launch();
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();
    let codeExists = false;

    await login(page, { email: "bestivulle37@yopmail.com", password: "qwert6y7u" });


    await page.getByRole('img', { name: 'Menu' }).click();

    await expect(page.getByText('紹介クーポン', { exact: true })).toBeVisible();
    await page.getByText('紹介クーポン', { exact: true }).click();

    await expect(page.locator('.coupon-code-description > span')).toContainText('5');
    await expect(page.locator('.coupon-code-text')).toBeVisible();

    await expect(page.getByRole('button', { name: 'コピー' })).toBeVisible();
    await page.getByRole('button', { name: 'コピー' }).click();

    await expect(page.getByRole('button', { name: 'コピーしました' })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    await expect(clipboardText).toBe('RKH43080');

    await expect(page.getByRole('button', { name: 'メールで紹介する' })).toBeVisible();
    await page.getByRole('button', { name: 'メールで紹介する' }).click();

    await expect(page.getByPlaceholder('example@epose.com')).toBeVisible();
    await page.getByPlaceholder('example@epose.com').fill('llanfairpwllgwyngyllgoger111@gmail.com');

    await expect(page.getByRole('button', { name: '送信する' })).toBeVisible();
    await page.getByRole('button', { name: '送信する' }).click();

    const emailCheck = await waitForEmail('llanfairpwllgwyngyllgoger111@gmail.com', '紹介クーポンが届きました');
    //expect email to not be null to confirm existence
    await expect(emailCheck).not.toBeNull();
    //expect email for the following strings to confirm correct email
    await expect(emailCheck?.subject).toContain('紹介クーポンが届きました');
    await expect(emailCheck?.body).toContain('紹介クーポンコード');

    //set the fetched emails body OR set it to empty
    await page.setContent(emailCheck?.body || '');

    //checks all divs inside table cells
    const divs = await page.locator('table tr td div');
    const counter = await divs.count();

    for (let i = 0; i < counter; i++) {
        const div = divs.nth(i);
        if (await div.textContent() === 'RKH43080') {
            codeExists = true;
            break;
        }
    }

    expect(codeExists).toBeTruthy();
});