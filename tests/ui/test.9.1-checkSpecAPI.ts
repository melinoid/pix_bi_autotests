import { getMainUser } from '../../utils/config';
import { test } from '../../utils/fixtures';
import { expect } from '@playwright/test';

/* Created 16.09.2025
https://pixrobotics.doqa.app/ru/home/detail/3/28/cases?selected=13159

1. Открыть подраздел "Специальные API"
- Отображается список специальных API */

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
    await page.waitForTimeout(3000)
    // Упрощение логики через скриншот тестирование
    await expect(page).toHaveScreenshot('specialApiPage.png', {
      animations: 'allow',
      caret: 'hide',
      maxDiffPixelRatio: 0.01,
      scale: 'css',
    });
  });
});
