import { test } from '@playwright/test';
import { login } from "../../utils/login";

test('login', async ({ page }) => {
    await login(page)
});