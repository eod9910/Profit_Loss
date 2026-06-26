import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const source = resolve("node_modules/bootstrap/dist/css/bootstrap.min.css");
const target = resolve("vendor/bootstrap.min.css");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);

console.log(`Copied ${source} to ${target}`);
