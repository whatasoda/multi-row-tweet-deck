import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

const PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');

type PackageJson = {
  version: string;
};
const PackageJson = (() => {
  let memo: PackageJson | null = null;
  return async (): Promise<PackageJson> =>
    memo || (memo = JSON.parse((await readFile(PACKAGE_JSON_PATH)).toString('utf-8')));
})();

const Version = async () => {
  const { version } = await PackageJson();
  return version;
};

export { Version };
