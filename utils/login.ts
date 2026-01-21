import { Page, expect } from '@playwright/test';

export async function login(page: Page, credentials?: { email?:string | "", password?:string | "" }) {
    await page.goto('https://app-stg.epose.com/login');

    await page.locator('button', { hasText: 'とじる' }).isVisible().then(async (isVisible) => {
        isVisible && await page.locator('button', { hasText: 'とじる' }).click();
    });

    await page.getByRole('textbox', { name: 'メールアドレス' }).fill(credentials?.email || "bestivulle40@yopmail.com");
    await page.getByRole('textbox', { name: 'パスワード' }).fill(credentials?.password || "qwert6y7u");

    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForTimeout(10000);
    await page.locator("div[role='dialog']").isVisible().then(async (isVisible) => {
        isVisible && await page.getByRole('button', { name: '続行する' }).click();
    });

    await page.waitForURL('https://app-stg.epose.com/customers', { waitUntil: "domcontentloaded", timeout: 500000 });
}