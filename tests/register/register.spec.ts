import { test, expect } from '@playwright/test';
import { waitForEmail } from '../../utils/gmail';

//storing global states in a separate file.

test('check default page on load', async ({ page }) => {
    // goes to the specified page
    await page.goto('https://app-stg.epose.com/application/start');

    // gets all favicon related elements
    const iconUrls = await page.evaluate(() => {
        const selectors = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]'
        ];

        // return values as array
        return Array.from(
            document.querySelectorAll<HTMLLinkElement>(selectors.join(',')),
            link => link.href
        );
    });

    // checks if the length of the returned array is not empty
    await expect(iconUrls.length).toBeGreaterThan(0);

    // checks page title
    await expect(page).toHaveTitle('ePose');

    // checks the current language. JA(Japanese) should be the only active text
    await expect(page.getByText('JA')).toHaveClass('active')
    await expect(page.getByText('EN')).toHaveClass('')

    //await expect(page.getByRole('checkbox').isChecked()).toBe(false);
});

test('register', async ({page}) => {
    let EMAIL_CODE:number = 0;
    let EMAIL_VERIFICATION_URL:string = '';
    const EMAIL = `llanfairpwllgwyngyl.lgoger111@gmail.com`

    //${Date.now()}
    const passwordFields = page.locator('input[type="password"]');

    await page.goto('https://app-stg.epose.com/application/start')

    // fills the email field and checks if the error message appears
    await page.fill('input[type="email"]', EMAIL);
    await page.keyboard.press('Tab');
    // checks if the error message is not visible
    await expect(page.locator('div[data-cy="error-label"]')).toBeHidden();
    await passwordFields.first().fill('qwert6y7u');
    await passwordFields.nth(1).fill('qwert6y7u');

    await expect(page.locator('text=qwert6y7u')).toHaveCount(0);

    await page.getByRole('checkbox').click();

    await page.getByRole('button', { name: '入力内容を確認' }).click();

    // Application Confirmation Page
    // checks URL since we are auto navigating this section
    const startConfirmation = await page.url();
    await expect(startConfirmation).toContain('https://app-stg.epose.com/application/start/confirmation');

    await expect(page.getByText('JA')).toHaveClass('active')
    await expect(page.getByText('EN')).toHaveClass('')

    //checks if the current email and password length matches
    await expect(page.getByText(EMAIL)).toBeVisible();
    await expect(page.getByText('●●●●●●●●●')).toBeVisible();

    await expect(page.getByText('送 信')).toBeEnabled();
    await expect(page.getByText('修正する')).toBeEnabled();

    await page.getByText('送 信').click();
    
    test.setTimeout(120000);
    const applicationSuccess = await page.url();
    await expect(applicationSuccess).toContain('https://app-stg.epose.com/application/start/');

    await page.getByText('メール認証へすすむ').click();

    /****************************************** Email Handling **************************************/
    // Email Checking
    const emailCheck = await waitForEmail(EMAIL, '認証コードをお送りします');
    await expect(emailCheck).not.toBeNull();
    await expect(emailCheck?.subject).toContain('認証コードをお送りします');
    await expect(emailCheck?.body).toContain('認証コード');

    await page.setContent(emailCheck?.body || '');

    // checks all divs inside table cells
    const divs = await page.locator('table tr td div');
    const counter = await divs.count();

    EMAIL_VERIFICATION_URL = await page.getByText('メール認証ページはこちら').getAttribute('href') || '';

    for (let i = 0; i < counter; i++) {
        const div = divs.nth(i);
         // Evaluate computed styles
        const { color, fontSize, text, fontWeight } = await div.evaluate(el => {
            const style = getComputedStyle(el);
            return {
                color: style.color, // e.g., "rgb(255, 255, 255)"
                fontSize: style.fontSize,       // e.g., "36px"
                fontWeight: style.fontWeight,
                text: el.textContent
            };
        });

        // Filter by color,font size,font weight and if its a number
        // Not future proof but works for now
        if (
            color === 'rgb(0, 0, 0)' && 
            fontSize === '36px' && 
            fontWeight === '500' && 
            text
        ) {
            EMAIL_CODE = parseFloat(text.replace(/[^\d.]/g, '')); // extract number
        }
    }
    console.log('EMAIL_CODE:', EMAIL_CODE);

    /************************** Email Verification Page **************************/
    await page.goto( 
        EMAIL_VERIFICATION_URL ? 
        EMAIL_VERIFICATION_URL : 
        'https://app-stg.epose.com/application/verification'
    );

    const fields = page.locator('input[type="text"]');

    await expect(page.getByText('JA')).toHaveClass('active')
    await expect(page.getByText('EN')).toHaveClass('')

    await expect(fields.first()).toBeVisible();
    await expect(fields.first()).toBeDisabled();
    await expect(fields.nth(1)).toBeVisible();

    await expect(page.getByText('送 信')).toBeDisabled();
    await fields.nth(1).fill(`${EMAIL_CODE}` || '00000000');

    await expect(page.getByText('送 信')).toBeEnabled({ timeout: 10000 });

    // https://app-stg.epose.com/application/start/success
    await page.getByText('送 信').click();

    if (await page.getByText('認証に失敗しました。ご入力情報をご確認の上、再度ご入力ください。').isVisible()) {
        test.fail();
    }

    const applicationVerification = await page.url();
    expect(applicationVerification).toContain('https://app-stg.epose.com/application/verification');


    /************************** Official Registration *********************************************/

    const emailVerification = await page.url();
    expect(emailVerification).toContain('https://app-stg.epose.com/application/verification');

    await expect(page.getByText('JA', {exact: true})).toHaveClass('active')
    await expect(page.getByText('EN', {exact: true})).toHaveClass('')

    await expect(page.getByRole('button', { name: '入力内容を確認' })).toBeDisabled();

    const fieldList = page.getByRole(('textbox'));
    const UID = Date.now();

    await (fieldList.first().fill(`Business`));
    await (fieldList.nth(1).fill(`Person`));
    await page.locator('input[name="telephoneNumber"]').fill(`09012345678`);
    await page.locator('#rc_select_0').click();
    await page.getByRole('option', { name: 'Australia' }).click();
    await (fieldList.nth(4).fill(`New Queensland`));
    await (fieldList.nth(5).fill(`Abbot Street`));

    await expect(page.getByRole('button', { name: '入力内容を確認' })).toBeEnabled()
});
