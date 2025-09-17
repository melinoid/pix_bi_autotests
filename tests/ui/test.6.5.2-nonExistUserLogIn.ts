import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

/* Created 16.09.2025

  1. В поле "Логин" ввести логин несуществующего пользователя
  - Поле ввода активно, данные введены
  2. Заполнить поле “Пароль”
  - Поле заполнено. Введенные данные скрыты (проверяется в 6.5.1)
  3. Нажать "Войти"
  - Отображается ошибка "Неправильный логин или пароль" */

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
