import { test, expect, request } from '@playwright/test';

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
});

