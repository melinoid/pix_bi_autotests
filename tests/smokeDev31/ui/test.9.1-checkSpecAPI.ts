import { getMainUser } from '../../../utils/config';
import { test } from '../../../utils/fixtures';
import { expect } from '@playwright/test';

test('9.1. Специальные API', async ({ page, loginPage, commonPage }) => {
  await test.step('Авторизуемся', async () => {
    loginPage.goToAuthorizedPage('/login', getMainUser());
  });
  await test.step('Переходим в раздел "Администрирование"', async () => {
    await commonPage.sideMenu.adminBtn.click();
  });
  await test.step('Переходим в подраздел "Специальные API"', async () => {
    await commonPage.adminLinksMenu.specialApiLink.click();
    await page.waitForLoadState('load');
    await expect(commonPage.mainLoader).toBeHidden();
    await expect(commonPage.contentLoader).toBeHidden();
  });
  await test.step('Проверяем содержимое раздела', async () => {
    // Костыль для протекающих лицензий
    await expect(
      page.locator('div :has-text("Срок действия некоторых лицензии в системе заканчивается")').first()
    ).toBeHidden({ timeout: 6000 });
    // Упрощение логики через скриншот тестирование
    await expect(page).toHaveScreenshot('specialApiPage.png');
  });
});
