import { getMainUser } from '../../../../utils/config';
import { test as setup } from '../../../../utils/fixtures';

//TODO: Не работает передача сессии через mainSession, надо разобраться
setup.skip('Login', async ({ page, loginPage }) => {
  await setup.step('Open login page', async () => {
    await page.goto('/login');
  });
  await setup.step('Get authorized', async () => {
    await loginPage.authorization(getMainUser());
  });
  await setup.step('Save session', async () => {
    await page.context().storageState({ path: '.temp/mainSession.json' });
  });
});
