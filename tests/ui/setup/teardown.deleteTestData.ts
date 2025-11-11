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
    const users = [data.user_crud];
    for (let user of users) {
      if (user !== undefined) {
        const responseData = await getList('/api/v0/users/list', user.username);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const item: any = responseData.list[i];
            response = await request.post('/api/v0/users/delete', {
              headers: { authorization: process.env.BI_TOKEN || '' },
              data: { ids: [`${item.id}`] },
            });

            if (response.status() !== 200) {
              throw Error(response.statusText());
            } else {
              console.log(await response.json());
            }
          }
        }
      }
    }
  });

  await teardown.step('Удаляем тестовые группы', async () => {
    const groups = [data.group_crud];
    for (let group of groups) {
      if (group !== undefined) {
        const responseData = await getList('/api/v0/user-groups/list', group.name);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const item: any = responseData.list[i];
            response = await request.delete(`/api/v0/user-group/${item.id}`, {
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
    }
  });

  await teardown.step('Удаляем тестовые распределения лицензий', async () => {
    const licenseRules = [data.license_rule_crud];
    for (let licenseRule of licenseRules) {
      if (licenseRule !== undefined) {
        const responseData = await getList('/api/v0/license/rules/list', licenseRule.name);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const item: any = responseData.list[i];
            response = await request.delete(`/api/v0/license/rule/${item.id}`, {
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
    }
  });

  await teardown.step('Удаляем тестовые LDAP импорты', async () => {
    const LdapImports = [data.ldap_connector_crud];
    for (let ldapImport of LdapImports) {
      if (ldapImport !== undefined) {
        const responseData = await getList('/api/v0/settings/user-connector/ldap/list', ldapImport.name);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const item: any = responseData.list[i];
            response = await request.delete(`/api/v0/settings/user-connector/${item.id}`, {
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
    }
  });

  await teardown.step('Удаляем тестовые директории', async () => {
    const dirs = [data.directory_crud];
    for (let dir of dirs) {
      if (dir !== undefined) {
        const responseData = await getList('/api/v0/admin/directories', dir.name);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const item: any = responseData.list[i];
            response = await request.post('/api/v0/admin/directories/delete', {
              headers: { authorization: process.env.BI_TOKEN || '' },
              data: { directoryIds: [item.id] },
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

  await teardown.step('Удаляем тестовые приложения', async () => {
    const apps = [data.application_crud, data.application_admin_crud];
    for (let app of apps) {
      if (app !== undefined) {
        const responseData = await getList('/api/v0/admin/applications', app.name);

        if (responseData.totalCount) {
          for (let i = 0; i < responseData.totalCount; i++) {
            const item: any = responseData.list[i];
            response = await request.post('/api/v0/admin/applications/delete', {
              headers: { authorization: process.env.BI_TOKEN || '' },
              data: { applicationIds: [item.id] },
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
