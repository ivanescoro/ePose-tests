import { Page } from '@playwright/test';

export async function login(page: Page, credentials?: { email?: string | "", password?: string | "" }) {

    await page.goto('https://app-stg.epose.com/login', { waitUntil: 'domcontentloaded' });

    const closeButton = page.locator('button', { hasText: 'とじる' });
    if (await closeButton.isVisible()) {
        await closeButton.click();
    }

    await page.getByRole('textbox', { name: 'メールアドレス' }).fill(credentials?.email ?? "bestivulle40@yopmail.com");
    await page.getByRole('textbox', { name: 'パスワード' }).fill(credentials?.password ?? "qwert6y7u");
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.waitForTimeout(5000);

    const continueButton = page.getByRole('button', { name: '続行する' });
    if (await continueButton.isVisible()) {
        await continueButton.click();
    }
    await page.waitForURL(/customers/, { waitUntil: "domcontentloaded" });

    const nextButton = page.locator('#next');
    if (await nextButton.isVisible()) {
        while (await nextButton.isVisible()) {
            await nextButton.click();
        }
        await page.getByText('利用を開始する').click();
        await page.getByText('OK').click();
    }
}