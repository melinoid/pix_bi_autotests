import { writeData } from '../../../data/data.common';
import UsersTD from '../../../data/data.users';
import { test as setup } from '../../../utils/fixtures';

setup('Генирируем тестовые данные', async () => {
  writeData('user_uno', await UsersTD.createUser());
});
