import { APIResponse } from '@playwright/test';
import test from '@playwright/test';

const processId = process.env.TEST_PARALLEL_INDEX || 0;
let response: APIResponse;
let groups = [];
let totalCount = 0;
const groupFilter = 'GGPN';

test('Clear Groups', async ({ request }, testInfo) => {
  await test.step('Get groups', async () => {
    response = await request.post('/api/v0/user-groups/list', {
      data: { searchText: groupFilter, filters: {}, sort: [] },
    });

    if (response.status() !== 200) {
      throw Error(response.statusText());
    }

    totalCount = (await response.json())?.totalCount;
    groups = (await response.json())?.data;
  });

  await test.step('Delete groups', async () => {
    for (let i = +processId; i < totalCount; i += testInfo.config.workers) {
      const group: any = groups[i];
      response = await request.delete(`/api/v0/user-group/${group.id}`, {});
      console.log(`${await response.text()} ${i + 1} из ${totalCount}`);
    }
  });
});
