//! this script is specificially to convert files out of dave's audio recorder.
//! if you do not use their specific device, this will likely fail with assertion.
//
//! input format is files "data/intake/{YYYY}{MM}{DD}{NNN}.WAV"
//! - **NOTE**: the canonical date is derived off the file's mtime, not the name
//! - The YYYYMMDD must match the mtime of the file
//! - NNN is a 3-digit number, it is ignored
//!
//! the input spec is weird because it is what my audio recorder outputs.
//! i would definetly accept PRs for other intake formats.
import assert from "node:assert";
import { readdirSync, rmSync, statSync, utimesSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data_dir = join(__dirname, "../data");

const intake_dir = join(data_dir, "intake");
const out_dir = join(data_dir, "audio");

const validated_list = readdirSync(intake_dir)
  .filter((x) => x.toLowerCase().endsWith(".wav"))
  .map((x) => {
    const [yyyy, mm, dd, number] = x
      .match(/(\d{4})(\d{2})(\d{2})(\d{3})\.wav/i)!
      .slice(1)
      .map((x) => parseInt(x, 10));
    assert(number > 0);
    const stat = statSync(join(intake_dir, x));
    assert(stat.isFile());
    const date_name = new Date(yyyy, mm - 1, dd);
    const date_file = stat.mtime;
    assert.strictEqual(date_name.getFullYear(), date_file.getFullYear());
    assert.strictEqual(date_name.getMonth(), date_file.getMonth());
    assert.strictEqual(date_name.getDate(), date_file.getDate());

    const month = mm.toString().padStart(2, "0");
    const day = dd.toString().padStart(2, "0");
    const hr = date_file.getHours().toString().padStart(2, "0");
    const min = date_file.getMinutes().toString().padStart(2, "0");
    const sec = date_file.getSeconds().toString().padStart(2, "0");

    return {
      date: date_name,
      input_file: join(intake_dir, x),
      output_file: join(
        out_dir,
        `${yyyy}-${month}-${day}-${hr}-${min}-${sec}.m4a`
      ),
    };
  });

console.log(validated_list);

const start = performance.now();
for (const { input_file, output_file, date } of validated_list) {
  const args = [
    "ffmpeg",
    "-hide_banner",
    "-i",
    input_file,
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    output_file,
  ];
  console.log("$ " + args.join(" "));
  const start = performance.now();
  const result = spawnSync(args[0], args.slice(1), { stdio: "inherit" });
  assert.strictEqual(result.status, 0);
  const diff = performance.now() - start;
  console.log("%ss -> %s", ((diff / 100) | 0) / 10, basename(output_file));
  utimesSync(output_file, date, date);
  rmSync(input_file);
}

const diff = performance.now() - start;
console.log(
  "%s: re-encoded %s files",
  ((diff / 100) | 0) / 10,
  validated_list.length
);
