import fs from 'fs';

const dir = '.temp/';
const dataFile = `${dir}data.json`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

try {
  var jsonData = require(`../${dataFile}`);
} catch{
  jsonData = {};
}

export function writeData(name: string, data: any) {
  if (typeof jsonData[name] !== 'undefined') {
    console.log(
      `Объект с именем ${name} уже существует и будет перезаписан.` +
        ` Удалите файл ${dataFile} или измените название объекта.`
    );
  }
  jsonData[name] = data;
  fs.writeFileSync(dataFile, JSON.stringify(jsonData, null, 2));
}

export async function deleteData() {
  const entities = Object.keys(jsonData);
  for (let entity of entities) {
    // switch (entity) {
    //   case 'users':
    //     for (let user of jsonData.users) {
    //       await API.deleteUsers(user);
    //     }
    //     break;
    // }
  }
  if (!!!process.env.CI) fs.rmSync(dir, { recursive: true, force: true });
}

export const data = jsonData;
