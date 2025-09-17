import { test as teardown} from "../../../utils/fixtures";
import { deleteData } from '../../../data/data.common';

teardown('Чистим тестовые данные', async () => {
  await deleteData();
});
