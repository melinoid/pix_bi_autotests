import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

const processId = process.env.TEST_PARALLEL_INDEX || 0;
let response: APIResponse;
let users: any = [];
let totalCount = 0;
const userFilter = 'UGPN';

test('Clear Users', async ({ request }, testInfo) => {
  await test.step('Get users', async () => {
    response = await request.post('/api/v0/users/list', {
      data: { searchText: userFilter, filters: {}, sort: [] },
    });

    if (response.status() !== 200) {
      throw Error(response.statusText());
    }

    totalCount = (await response.json())?.totalCount;
    users = (await response.json())?.data;
  });

  await test.step('Delete users', async () => {
    for (let i = +processId; i < totalCount; i += testInfo.config.workers) {
      const user: any = users[i];
      response = await request.post(`/api/v0/admin/users/delete`, {
        data: { ids: [user.id] },
      });
      console.log(`${await response.text()} ${i + 1} из ${totalCount}`);
    }
  });
});
