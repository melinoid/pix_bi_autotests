import { getMainUser } from '../../../utils/config';
import { test as teardown } from '../../../utils/fixtures';
import { APIResponse } from '@playwright/test';

// На случай, если сущности созданы, но не удалены из системы, удаляем их через api
teardown('Чистим тестовые данные', async ({ request, data }) => {
  let response: APIResponse;
  const mainUser = getMainUser();

  await teardown.step('Получаем токен для запросов', async () => {
    response = await request.post('/api/v0/token', {
      data: { userName: mainUser.username, password: mainUser.password },
    });
    process.env['BI_TOKEN'] = `Bearer ${(await response.json())?.accessToken}`;
  });

  await teardown.step('Удаляем тестовых пользователей', async () => {
    const responseData = await getList('/api/v0/users/list', data.user_uno.username);

    if (responseData.totalCount) {
      for (let i = 0; i < responseData.totalCount; i++) {
        const user: any = responseData.list[i];
        response = await request.post('/api/v0/users/delete', {
          data: { ids: [`${user.id}`] },
        });
      }
    }
  });

  await teardown.step('Удаляем тестовые группы', async () => {
    const responseData = await getList('/api/v0/user-groups/list', data.group_uno.name);

    if (responseData.totalCount) {
      for (let i = 0; i < responseData.totalCount; i++) {
        const group: any = responseData.list[i];
        response = await request.delete(`/api/v0/user-group/${group.id}`, {});
      }
    }
  });

  await teardown.step('Удаляем тестовые распределения лицензий', async () => {
    const responseData = await getList('/api/v0/license/rules/list', data.license_rule_uno.name);

    if (responseData.totalCount) {
      for (let i = 0; i < responseData.totalCount; i++) {
        const licenseRule: any = responseData.list[i];
        response = await request.delete(`/api/v0/license/rule/${licenseRule.id}`, {});
      }
    }
  });

  await teardown.step('Удаляем тестовые LDAP импорты', async () => {
    const responseData = await getList('/api/v0/settings/user-connector/ldap/list', data.ldap_connector_uno.name);

    if (responseData.totalCount) {
      for (let i = 0; i < responseData.totalCount; i++) {
        const ldapConnector: any = responseData.list[i];
        response = await request.delete(`/api/v0/settings/user-connector/${ldapConnector.id}`, {});
      }
    }
  });

  async function getList(path: string, query: string) {
    let totalCount = 0;
    let list: any = [];

    response = await request.post(path, {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: { searchText: query, filters: {}, sort: [] },
    });

    if (response.status() !== 200) {
      throw Error(response.statusText());
    }

    return { totalCount, list };
  }
});
