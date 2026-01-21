import { test, expect } from '@playwright/test';
import { login } from "../../../utils/login";
import { apigateway } from 'googleapis/build/src/apis/apigateway';

test('payment with credit card', async ({ page }) => {
    test.setTimeout(500000);

    await login(page, {email: "llanfairpwllgwyngyllgoger11.1@gmail.com", password:"qwert6y7u"});

    await page.getByRole('img', { name: 'Menu' }).click();
    await page.getByText('設定').click();

    await expect(page.getByText('フリープラン')).toBeVisible();
    //date here varies from user to user
    await expect(page.getByText('/01/19~')).toBeVisible();

    await page.getByRole('button', { name: 'プランの確認・変更はこちら' }).click();

    await page.waitForURL('https://app-stg.epose.com/contract', { waitUntil: "domcontentloaded", timeout: 500000 });

    await expect(page.getByText('フリープラン')).toBeVisible();
    await expect(page.getByText('/01/19~')).toBeVisible();

    await page.getByRole('button', { name: 'プランを変更する' }).click();

    // 0 - 3 months, 1 - 6 months, 2 - 12 months
    const creditCardOption = page.getByText('このプランを選択');

    await creditCardOption.first().isEnabled();
    await creditCardOption.nth(1).isEnabled();
    await creditCardOption.nth(2).isEnabled();

    await expect(page.getByText('お支払い情報入力')).toBeDisabled();

    //3 Month Plan
    await creditCardOption.first().click();
    await expect(page.getByText('選択中')).toBeVisible();
    await expect(page.getByText('選択中')).toBeDisabled();

    await page.waitForTimeout(10000);
    await expect(page.locator('div').filter({ hasText: /^3 ヶ月プラン¥29,400$/ }).first()).toBeVisible();
    await expect(page.getByText('¥29,400').nth(2)).toBeVisible();
    await expect(page.getByRole('button', { name: 'お支払い情報入力' })).toBeEnabled();
    // check other footer elements
    await page.getByRole('button', { name: 'お支払い情報入力' }).click();

    await page.waitForURL('https://app-stg.epose.com/contract/payment-information', { waitUntil: "domcontentloaded", timeout: 50000});
    
    await expect(page.getByRole('textbox', { name: 'クーポンコードをお持ちの方はご入力ください' })).toBeVisible();
    await expect(page.getByRole('button', { name: '適用' })).toBeVisible();
    await expect(page.getByRole('button', { name: '適用' })).toBeEnabled();

    // await expect(page.locator('div').filter({ hasText: /^3 ヶ月プラン¥29,400$/ }).first()).toBeVisible();
    await expect(page.getByText('合計金額※消費税込')).toBeVisible();
    await expect(page.getByText('3ヶ月プラン')).toBeVisible();
    await expect(page.getByText('合計', { exact: true })).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: '¥' })).toBeVisible();

    await expect(page.getByText('クレジットカード'));
    await expect(page.getByText('銀行振込'));
    await expect(page.getByText('ご請求先名'));

    // //6 Month Plan
    // await creditCardOption.nth(1).click();
    // await expect(page.getByText('選択中')).toBeVisible();   
    // await expect(page.getByText('選択中')).toBeDisabled();

    // await page.waitForTimeout(10000);
    // await expect(page.locator('div').filter({ hasText: /^6 ヶ月プラン¥52,800$/ }).first()).toBeVisible();
    // await expect(page.getByText('¥52,800').nth(2)).toBeVisible();

    // await expect(page.getByRole('button', { name: 'お支払い情報入力' })).toBeEnabled();

    // //12 Month Plan
    // await creditCardOption.nth(2).click();
    // await expect(page.getByText('選択中')).toBeVisible();
    // await expect(page.getByText('選択中')).toBeDisabled();

    // await page.waitForTimeout(10000);
    // await expect(page.locator('div').filter({ hasText: /^12 ヶ月プラン¥81,600$/ }).first()  ).toBeVisible();
    // await expect(page.getByText('¥81,600').nth(2)).toBeVisible();

    // await expect(page.getByRole('button', { name: 'お支払い情報入力' })).toBeEnabled();
});