import { test, expect } from '@playwright/test';
import { login } from "../../utils/login";

test.describe('Updating of the profile', () => {
    test('Should be able to update the fields individually.', async({page}) => {
        test.setTimeout(120000);

        await login(page, {email: "avrilmax286@gmail.com", password:"Passw0rd"});

        await page.getByRole('img', { name: 'Menu' }).click();
        await page.getByText('マイページ').click();

        const names = ['Mariah', 'Mary', 'May'];

        for (const [i, name] of names.entries()) {
            // 1. Click the Edit button first for every iteration
            await page.getByRole('button', { name: '編 集' }).first().click();

            // 2. Select the specific textbox based on the current index (0, 1, 2...)
            const textbox = page.getByRole('textbox').nth(i);
            await textbox.click();
            await textbox.fill(name);

            // 3. Save
            await page.getByRole('button', { name: '保 存' }).click();

            await page.waitForURL('https://app-stg.epose.com/my-page', { waitUntil: "domcontentloaded", timeout: 500000 });
        }

    });

    test('Should be able to update the fields in bulk.', async({page}) => {
        test.setTimeout(120000);

        await login(page, {email: "avrilmax286@gmail.com", password:"Passw0rd"});

        await page.getByRole('img', { name: 'Menu' }).click();
        await page.getByText('マイページ').click();

        await page.getByRole('button', { name: '編 集' }).first().click();

        const newPersonInCharge = 'Jessi';
        const newFurigana = 'Joan';
        const newDisplayName ='James';

        await page.getByRole('textbox').first().fill(newPersonInCharge);
        await page.getByRole('textbox').nth(1).fill(newFurigana);
        await page.getByRole('textbox').nth(2).fill(newDisplayName);

        await page.getByRole('button', { name: '保 存' }).click();

        await page.waitForURL('https://app-stg.epose.com/my-page', { waitUntil: "domcontentloaded", timeout: 500000 });

    });
});

test.describe('Account Withdrawal', () => {
   test('Should be able to withdraw an account if User is in Free Plan.', async({page}) => {
        test.setTimeout(120000);

        const withdrawnEmail = "dammizeumafoi-8632@yopmail.com";
        const withdrawnPassword = "Passw0rd";

        await login(page, {email: withdrawnEmail, password: withdrawnPassword});

        await page.getByRole('img', { name: 'Menu' }).click();
        await page.getByText('マイページ').click();

        await page.getByText('退会のお手続きはこちら').click();

        await page.waitForURL(/unsubscribe|withdrawal|withdraw|退会/, { waitUntil: "domcontentloaded", timeout: 50000 });

        await expect(page.getByText('退会', { exact: true })).toBeVisible();

        
        await Promise.all([
            page.waitForURL('https://app-stg.epose.com/my-page/unsubscribe/reason', { waitUntil: "domcontentloaded", timeout: 50000 }),
            page.getByRole('button', { name: '退会する' }).click()
        ]);

        await page.waitForLoadState('domcontentloaded');
        await page.getByText('その他').click();
        await page.getByRole('textbox').fill('OTHERS');

        await expect(page.getByRole('button', { name: '次へ' })).toBeEnabled();
        await page.getByRole('button', { name: '次へ' }).click();
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: '退会する' }).click();

        try {
            await page.waitForURL(/login/, { waitUntil: "domcontentloaded", timeout: 15000 });
        } catch {
            await page.goto('https://app-stg.epose.com/login');
        }

        await page.waitForLoadState('domcontentloaded');

        const dialog = page.locator("div[role='dialog']");
        await dialog.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        if (await dialog.isVisible()) {
            const closeButton = dialog.locator('button').filter({ hasText: /とじる|OK|閉じる|了解/ });
            await closeButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
            if (await closeButton.isVisible()) {
                await closeButton.click();
                await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            }
        }

        await page.getByRole('textbox', { name: 'メールアドレス' }).fill(withdrawnEmail);
        await page.getByRole('textbox', { name: 'パスワード' }).fill(withdrawnPassword);
        await page.getByRole('button', { name: 'ログイン' }).click();

        await expect(page).toHaveURL(/login/, { timeout: 10000 });
        await expect(page.getByText('メールアドレスもしくはパスワードが正しくありません。')).toBeVisible();
    });

    test('Should be able to withdraw an account if User is in Paid Plan.', async({page}) => {
         test.setTimeout(120000);

        const withdrawnEmail = "neon@yopmail.com";
        const withdrawnPassword = "P@ssw0rd";

        await login(page, {email: withdrawnEmail, password: withdrawnPassword});

        await page.getByRole('img', { name: 'Menu' }).click();
        await page.getByText('マイページ').click();

        await page.getByText('退会のお手続きはこちら').click();

        const dialog = page.locator("div[role='dialog']");
        await expect(dialog).toBeVisible({ timeout: 5000 });

        await Promise.all([
            page.waitForURL('https://app-stg.epose.com/contract', { waitUntil: "domcontentloaded", timeout: 50000 }),
            dialog.locator('button', { hasText: 'ご契約情報へ' }).click({ force: true })
        ]);

        await expect(page.getByText('ご契約情報')).toBeVisible();
        await expect(page.getByText('お支払いの自動更新')).toBeVisible();

        await page.getByRole('button', { name: '自動更新を停止する(解約)' }).click();

        const stopAutoUpdateDialog = page.locator("div[role='dialog']");
        await stopAutoUpdateDialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        if (await stopAutoUpdateDialog.isVisible()) {
            await page.getByText('同意する').click();
            await stopAutoUpdateDialog.locator('button', { hasText: '停止する' }).click({ force: true });
        }

        await expect(page.getByText('自動更新を停止しました。')).toBeVisible({ timeout: 10000 });

        await page.getByRole('img', { name: 'Menu' }).click();
        await page.getByText('マイページ').click();

        await page.getByText('退会のお手続きはこちら').click();

        await page.waitForURL(/unsubscribe|withdrawal|withdraw|退会/, { waitUntil: "domcontentloaded", timeout: 50000 });

        await expect(page.getByText('退会', { exact: true })).toBeVisible();

        await Promise.all([
            page.waitForURL('https://app-stg.epose.com/my-page/unsubscribe/reason', { waitUntil: "domcontentloaded", timeout: 50000 }),
            page.getByRole('button', { name: '退会する' }).click()
        ]);

        await page.waitForLoadState('domcontentloaded');
        await page.getByText('その他').click();
        await page.getByRole('textbox').fill('OTHERS');

        await expect(page.getByRole('button', { name: '次へ' })).toBeEnabled();
        await page.getByRole('button', { name: '次へ' }).click();
        await page.waitForLoadState('domcontentloaded');
        await page.getByRole('button', { name: '退会する' }).click();

        try {
            await page.waitForURL(/login/, { waitUntil: "domcontentloaded", timeout: 15000 });
        } catch {
            await page.goto('https://app-stg.epose.com/login');
        }

        await page.waitForLoadState('domcontentloaded');

        const sessionDialog = page.locator("div[role='dialog']");
        await sessionDialog.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
        if (await sessionDialog.isVisible()) {
            const closeButton = sessionDialog.locator('button').filter({ hasText: /とじる|OK|閉じる|了解/ });
            await closeButton.waitFor({ state: 'visible', timeout: 5000 });
            await closeButton.click({ force: true });
            await sessionDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
            if (await sessionDialog.isVisible()) {
                await page.keyboard.press('Escape');
            }
        }

        await page.getByRole('textbox', { name: 'メールアドレス' }).fill(withdrawnEmail);
        await page.getByRole('textbox', { name: 'パスワード' }).fill(withdrawnPassword);
        await page.getByRole('button', { name: 'ログイン' }).click();

        await expect(page).toHaveURL(/login/, { timeout: 10000 });
        await expect(page.getByText('メールアドレスもしくはパスワードが正しくありません。')).toBeVisible();
    });

});