import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

test('6.5.2. Авторизация несуществующего пользователя', async ({ page, loginPage }) => {
  await test.step('Авторизуемся под несуществующим пользователем', async () => {
    await page.goto('/login');
    await loginPage.authorization({ username: 'biba-123', password: 'boba' });

    await expect(loginPage.loginForm.loader).toBeHidden();
  });

  await test.step('Проверяем неудачную авторизацию', async () => {
    // Ожидаем одно единственное уведомление
    await expect(
      page.getByRole('alert').locator('div').filter({ hasText: 'Неправильный логин или пароль' })
    ).toBeInViewport();
    await expect(loginPage.loginForm.loginInput).toBeVisible();
  });
});
