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
    if (data.user_crud !== undefined) {
      const responseData = await getList('/api/v0/users/list', data.user_crud.username);

      if (responseData.totalCount) {
        for (let i = 0; i < responseData.totalCount; i++) {
          const user: any = responseData.list[i];
          response = await request.post('/api/v0/users/delete', {
            headers: { authorization: process.env.BI_TOKEN || '' },
            data: { ids: [`${user.id}`] },
          });

          if (response.status() !== 200) {
            throw Error(response.statusText());
          } else {
            console.log(await response.json());
          }
        }
      }
    }
  });

  await teardown.step('Удаляем тестовые группы', async () => {
    if (data.group_crud !== undefined) {
      const responseData = await getList('/api/v0/user-groups/list', data.group_crud.name);

      if (responseData.totalCount) {
        for (let i = 0; i < responseData.totalCount; i++) {
          const group: any = responseData.list[i];
          response = await request.delete(`/api/v0/user-group/${group.id}`, {
            headers: { authorization: process.env.BI_TOKEN || '' },
          });
        }

        if (response.status() !== 200) {
          throw Error(response.statusText());
        } else {
          console.log(await response.json());
        }
      }
    }
  });

  await teardown.step('Удаляем тестовые распределения лицензий', async () => {
    if (data.license_rule_crud !== undefined) {
      const responseData = await getList('/api/v0/license/rules/list', data.license_rule_crud.name);

      if (responseData.totalCount) {
        for (let i = 0; i < responseData.totalCount; i++) {
          const licenseRule: any = responseData.list[i];
          response = await request.delete(`/api/v0/license/rule/${licenseRule.id}`, {
            headers: { authorization: process.env.BI_TOKEN || '' },
          });
        }

        if (response.status() !== 200) {
          throw Error(response.statusText());
        } else {
          console.log(await response.json());
        }
      }
    }
  });

  await teardown.step('Удаляем тестовые LDAP импорты', async () => {
    if (data.ldap_connector_crud !== undefined) {
      const responseData = await getList('/api/v0/settings/user-connector/ldap/list', data.ldap_connector_crud.name);

      if (responseData.totalCount) {
        for (let i = 0; i < responseData.totalCount; i++) {
          const ldapConnector: any = responseData.list[i];
          response = await request.delete(`/api/v0/settings/user-connector/${ldapConnector.id}`, {
            headers: { authorization: process.env.BI_TOKEN || '' },
          });
        }

        if (response.status() !== 200) {
          throw Error(response.statusText());
        } else {
          console.log(await response.json());
        }
      }
    }
  });

  await teardown.step('Удаляем тестовые директории', async () => {
    if (data.directory_crud !== undefined) {
      const responseData = await getList('/api/v0/admin/directories', data.directory_crud.name);

      if (responseData.totalCount) {
        for (let i = 0; i < responseData.totalCount; i++) {
          const directory: any = responseData.list[i];
          response = await request.post('/api/v0/admin/directories/delete', {
            headers: { authorization: process.env.BI_TOKEN || '' },
            data: { directoryIds: [directory.id] },
          });
        }

        if (response.status() !== 200) {
          throw Error(response.statusText());
        } else {
          console.log(await response.json());
        }
      }
    }
  });

  await teardown.step('Удаляем тестовые приложения', async () => {
    const apps = [data.application_crud, data.application_admin_crud];
    for (let app of apps) {
      if (app !== undefined) {
        const responseData = await getList('/api/v0/admin/applications', app.name);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const lApp: any = responseData.list[i];
            response = await request.post('/api/v0/admin/applications/delete', {
              headers: { authorization: process.env.BI_TOKEN || '' },
              data: { applicationIds: [lApp.id] },
            });
          }

          if (response.status() !== 200) {
            throw Error(response.statusText());
          } else {
            console.log(await response.json());
          }
        }
      }
    }
  });

  async function getList(path: string, query: string) {
    response = await request.post(path, {
      headers: { authorization: process.env.BI_TOKEN || '' },
      data: { searchText: query, filters: {}, sort: [] },
    });

    if (response.status() !== 200) {
      throw Error(response.statusText());
    }

    const totalCount: any = (await response.json()).totalCount;
    const list: any = (await response.json()).data;

    return { totalCount, list };
  }
});
