import { APIResponse, expect } from '@playwright/test';
import { test as setup } from '../../../utils/fixtures';
import { getMainUser } from '../../../utils/config';
import { User } from '../../../data/data';
import UsersTD from '../../../data/data.users';
import { writeData } from '../../../data/data.common';
import AdminRuleTD from '../../../data/data.adminRule';
import AccessRuleTD from '../../../data/data.accessRule';

setup('Генирируем тестовые данные и пользователя', async ({ request }) => {
  let response: APIResponse;
  let mainUser: User = await UsersTD.createAdminUser();

  await setup.step('Получаем токен для запросов', async () => {
    const mainUser = getMainUser();

    response = await request.post('/api/v0/token', {
      data: { userName: mainUser.username, password: mainUser.password },
    });
    process.env['BI_TOKEN'] = `Bearer ${(await response.json())?.accessToken}`;
  });

  //
  await setup.step('Создаём пользователя', async () => {
    response = await request.post('/api/v0/user-create', {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        name: mainUser.username,
        displayName: mainUser.displayed_name,
        email: mainUser.email,
        password: mainUser.password,
        password_confirm: mainUser.password,
        inactive: !mainUser.active,
        forceChangeOnLogin: false,
        ActiveDirectoryUserName: null,
        ActiveDirectoryUserSid: null,
        roles: [],
      },
    });

    if (response.status() !== 200) {
      throw Error('Пользователь не создан: ' + response.statusText());
    }

    mainUser.id = (await response.json()).data.value.id;
    writeData('main_user', mainUser);
  });

  await setup.step('Назначаем пользователю лицензию', async () => {
    response = await request.post('/api/v0/license-allocation', {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        licenseType: 'pro',
        users: [mainUser.id],
      },
    });

    if (response.status() !== 200) {
      throw Error('Лицензия не назначена: ' + response.statusText());
    }
  });

  await setup.step('Создание правила администрирования для пользователя', async () => {
    let mainAdminRule = await AdminRuleTD.createAdminRule();

    response = await request.post('/api/v0/admin/access-rule', {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        name: mainAdminRule.name,
        enable: true,
        userFilter: [
          {
            attribute: 'UserName',
            values: [mainUser.username],
            filterType: 'in',
            join: null,
          },
        ],
        matrix: [
          {
            title: 'Пользователи',
            key: 1,
            sortOrder: 10,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Группы',
            key: 2,
            sortOrder: 20,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Импорт пользователей',
            key: 14,
            sortOrder: 30,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Распределение лицензий',
            key: 18,
            sortOrder: 40,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Назначение Pro',
            key: 4,
            sortOrder: 50,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }],
          },
          {
            title: 'Назначение Base',
            key: 5,
            sortOrder: 60,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }],
          },
          {
            title: 'Правила доступа',
            key: 10,
            sortOrder: 110,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Аудит доступов',
            key: 12,
            sortOrder: 120,
            modifiers: [{ modifier: 'R' }],
          },
          {
            title: 'RLS и OMIT',
            key: 13,
            sortOrder: 130,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Правила администрирования',
            key: 11,
            sortOrder: 140,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Журнал событий',
            key: 8,
            sortOrder: 150,
            modifiers: [{ modifier: 'R' }],
          },
          {
            title: 'Директории',
            key: 6,
            sortOrder: 210,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Приложения',
            key: 19,
            sortOrder: 220,
            modifiers: [{ modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Темы',
            key: 22,
            sortOrder: 221,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Внешние ссылки',
            key: 7,
            sortOrder: 230,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Геосерверы',
            key: 20,
            sortOrder: 230,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Рассылка',
            key: 16,
            sortOrder: 240,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Настройки',
            key: 9,
            sortOrder: 310,
            modifiers: [{ modifier: 'R' }, { modifier: 'U' }],
          },
          {
            title: 'Лицензирование',
            key: 3,
            sortOrder: 320,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }],
          },
          {
            title: 'Полезное',
            key: 15,
            sortOrder: 330,
            modifiers: [{ modifier: 'C' }, { modifier: 'R' }, { modifier: 'U' }, { modifier: 'D' }],
          },
          {
            title: 'Специальные API',
            key: 21,
            sortOrder: 999,
            modifiers: [{ modifier: 'C' }],
          },
        ],
        description: mainAdminRule.description,
      },
    });

    if (response.status() !== 200) {
      throw Error('Правило администрирования не создано: ' + response.statusText());
    }

    writeData('main_admin_rule', mainAdminRule);
  });

  await setup.step('Создаём правило доступа ко всем директориям', async () => {
    let mainDirAccessRule = await AccessRuleTD.createAccessRule();

    response = await request.post('/api/v0/rule', {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        name: mainDirAccessRule.name,
        resourceFilter: [
          {
            attribute: 'Name',
            values: [],
            filterType: 'notnull',
            join: null,
          },
        ],
        userFilter: [
          {
            attribute: 'UserName',
            values: [mainUser.username],
            filterType: 'in',
            join: null,
          },
        ],
        isEnabled: true,
        description: mainDirAccessRule.description,
        resourceType: 1,
        modifiers: [1, 3, 4, 7, 8, 2],
      },
    });

    if (response.status() !== 200) {
      throw Error('Правило доступа к директориям не создано: ' + response.statusText());
    }

    writeData('main_dir_access_rule', mainDirAccessRule);
  });

  await setup.step('Создаём правило доступа ко всем приложениям', async () => {
    let mainAppAccessRule = await AccessRuleTD.createAccessRule();

    response = await request.post('/api/v0/rule', {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: {
        name: mainAppAccessRule.name,
        resourceFilter: [
          {
            attribute: 'Name',
            values: [],
            filterType: 'notnull',
            join: null,
          },
        ],
        userFilter: [
          {
            attribute: 'UserName',
            values: [mainUser.username],
            filterType: 'in',
            join: null,
          },
        ],
        isEnabled: true,
        description: mainAppAccessRule.description,
        resourceType: 2,
        modifiers: [1, 3, 4, 7, 5, 6, 8, 9, 2],
      },
    });

    if (response.status() !== 200) {
      throw Error('Правило доступа к приложениям не создано: ' + response.statusText());
    }

    writeData('main_app_access_rule', mainAppAccessRule);
  });
});
