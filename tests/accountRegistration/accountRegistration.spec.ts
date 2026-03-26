import { test, expect } from '@playwright/test';
import { login } from "../../utils/login";

test('account register', async ({ page }) => {
    //can change name of the customer
    const name = `Phaeton Test`;

    test.setTimeout(1200000);

    await login(page, { email: "bestivulle36@yopmail.com", password: "qwert6y7u" });

    await page.getByText('新規登録').first().click();
    //Furigana
    await page.getByRole('textbox').nth(2).fill(name);

    //Height
    const heightSelect = page.locator('.ant-select-selector').first();
    await heightSelect.click();
    await page.getByRole('option', { name: '142' }).click();

    //Sex options 男性, 女性, 無回答
    await page.getByRole('radio', { name: '男性' }).check();

    //Year
    const yearSelect = page.locator('.date-select .ant-select-selector').first();
    await yearSelect.click();
    await page.getByRole('option', { name: '2002' }).click();
    //Month
    const monthSelect = page.locator('.date-select .ant-select-selector').nth(1);
    await monthSelect.click();
    await page.getByRole('option', { name: '11' }).click();
    //Day
    const daySelect = page.locator('.date-select .ant-select-selector').nth(2);
    await daySelect.click();
    await page.getByRole('option', { name: '16' }).click();

    await page.getByRole('checkbox').check();

    //Submit
    await page.getByRole('button', { name: '保 存' }).click();
    await page.waitForTimeout(10000);

    const dialog = page.locator("div[role='dialog']");
    if (await dialog.isVisible({ timeout: 5000 })) {
        await page.getByText('顧客一覧へもどる').click();
    }

    // await page.locator("div[role='dialog']").isVisible().then(async (isVisible) => {
    //     isVisible && await page.getByText('顧客一覧へもどる').click();
    // });

    await expect(page.getByText(`${name}`)).not.toHaveCount(0);

    await page.getByText('顧客情報を表示').click();

    await expect(page.getByText('2002/11/16')).toBeVisible();
    await expect(page.getByText('142 cm')).toBeVisible();
    await expect(page.getByText('男性')).toBeVisible();
})