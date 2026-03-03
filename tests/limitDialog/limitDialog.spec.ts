import { test, expect } from '@playwright/test';
import { login } from "../../utils/login";

test('login', async ({ page }) => {
    await login(page, {email:"limittest00001@yopmail.com", password:"qwert6y7u"});
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByText("プラン変更はこちら")).toBeVisible();
    await page.getByText("プラン変更はこちら").click();
    await expect(page.locator("div[role=dialog]")).toBeVisible();
    await page.getByText('あとで').click();
    await expect(page.getByText('クイック分析')).toBeVisible();
    await page.getByText('クイック分析').click();
    await expect(page.locator("div[role=dialog]")).toBeVisible();
    await page.getByText('あとで').click();
    await page.getByText('Spore').first().click();
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByText("新規分析")).toBeVisible();
    await page.getByText("新規分析").click();
    await expect(page.locator("div[role=dialog]")).toBeVisible();
});