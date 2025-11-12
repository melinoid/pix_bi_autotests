import fs from 'fs';

const dir = '.temp/';
const dataFile = `${dir}data.json`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

try {
  var jsonData = require(`../${dataFile}`);
} catch (e) {
  jsonData = {};
}

/**
 * Записать сущность во временный файл
 * @param name название сущности.
 * @param data объект с данными сущности.
 */
export function writeData(name: string, data: any) {
  // if (typeof jsonData[name] !== 'undefined') {
  //   console.log(`Объект с именем ${name} перезаписан в ${dataFile}`);
  // }
  jsonData[name] = data;
  fs.writeFileSync(dataFile, JSON.stringify(jsonData, null, 2));
}

/**
 * Перезаписать сущность по названию
 * @param name название сущности для перезаписи.
 * @param data объект с данными сущности.
 */
export function rewriteData(name: string, data: any) {
  if (typeof jsonData[name] === 'undefined') {
    throw Error(`Объект с именем ${name} не найден. Перезапись невозможна.`);
  }

  jsonData[name] = data;
  fs.writeFileSync(dataFile, JSON.stringify(jsonData, null, 2));
}

export const data = jsonData;
