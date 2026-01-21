import { test, expect } from '@playwright/test';
import { login } from "../../utils/login";

test('account register', async ({ page }) => {
    //change me
    const name = "Oaron Test";

    test.setTimeout(500000);

    await login(page);

    await page.getByText('新規登録').click();

    //Furigana
    await page.getByRole('textbox').nth(2).fill(`${name}`);

    //Height
    await page.locator('.ant-select-selector').first().click();
    await page.getByRole('option', { name: '142' }).click();

    //Sex
    await page.getByRole('radio', { name: '男性' }).click();
    // page.getByRole('radio', { name: '女性' })
    // page.getByRole('radio', { name: '無回答' })

    //Year
    await page.locator('.ant-select.ant-select-outlined.date-select > .ant-select-selector').first().click()
    await page.getByRole('option', { name: '2002' }).click();
    //Month
    await page.locator('div:nth-child(3) > .ant-select-selector').click();
    await page.getByRole('option', { name: '11' }).click();
    //Day
    await page.locator('div:nth-child(5) > .ant-select-selector').click();
    await page.getByRole('option', { name: '16' }).click();
    await page.getByRole('checkbox').click();
    //Submit
    await page.getByRole('button', { name: '保 存' }).click();
    await page.waitForTimeout(10000);

    await page.locator("div[role='dialog']").isVisible().then(async (isVisible) => {
        isVisible && await page.getByText('顧客一覧へもどる').click();
    });

    await expect(page.getByText(`${name}`)).toHaveCount(3);

    await page.getByText('顧客情報を表示').click();

    await expect(page.getByText('2002/11/16')).toBeVisible();
    await expect(page.getByText('142 cm')).toBeVisible();
    await expect(page.getByText('男性')).toBeVisible();
})