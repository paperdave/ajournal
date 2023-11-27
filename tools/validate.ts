//! this script is useful if the dates on the filesystem are wrong.
//! it runs utimes
import assert from "node:assert";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data_dir = join(__dirname, "../data");

const audio_dir = join(data_dir, "audio");

const start = performance.now();

let i = 0;
for (const x of readdirSync(audio_dir)) {
  if (!x.toLowerCase().endsWith(".m4a")) continue;

  const [yyyy, mm, dd, hh, min, ss] = x
    .match(/(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})\.m4a/i)!
    .slice(1)
    .map((x) => parseInt(x, 10));
  assert(yyyy > 2004);
  assert(mm > 0 && mm < 13);
  assert(dd > 0 && dd < 32);
  assert(hh >= 0 && hh < 24);
  assert(min >= 0 && min < 60);
  assert(ss >= 0 && ss < 60);
  const stat = statSync(join(audio_dir, x));
  assert(stat.isFile());
  assert(stat.mtime.getTime() % 1000 == 0);
  const date_name = new Date(yyyy, mm - 1, dd, hh, min, ss);
  assert(stat.mtime.getTime() == date_name.getTime());
  i++;
}

const diff = performance.now() - start;
console.log("[%sms] audio journal files look valid", diff | 0);
console.log("there are %s entries", i);
