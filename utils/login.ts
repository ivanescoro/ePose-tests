import { Page } from '@playwright/test';

export async function login(page: Page) {
    await page.goto('https://app-stg.epose.com/login');
    await page.getByRole('textbox', { name: 'メールアドレス' }).fill("bestivulle43@yopmail.com");
    await page.getByRole('textbox', { name: 'パスワード' }).fill("qwert6y7u");

    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForURL(/);
}