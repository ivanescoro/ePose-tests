import { test, expect } from '@playwright/test';
import { login } from "../../utils/login"

test('logout', async ({ page }) => {
    test.setTimeout(60000);
    await login(page, { email: "bestivulle4@yopmail.com", password: "qwert6y7u" });
    await page.getByRole('img', { name: 'Menu' }).click();
    await expect(page.getByText('ログアウト')).toBeVisible();
    await page.getByText('ログアウト').click()
    await page.waitForURL('https://app-stg.epose.com/login', { waitUntil: "domcontentloaded", timeout: 50000 });
});