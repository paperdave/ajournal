//! this script is useful if the dates on the filesystem are wrong.
//! it runs utimes
import assert from "node:assert";
import { existsSync, readdirSync, rmSync, statSync, utimesSync } from "node:fs";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { userInfo } from "node:os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data_dir = join(__dirname, "../data");

const audio_dir = join(data_dir, "audio");
const whisper_dir = join(data_dir, "whisperx_raw");

const start = performance.now();

let transcribed_i = 0;
let done_i = 0;
let all_files = [];
for (const x of readdirSync(audio_dir)) {
  if (!x.toLowerCase().endsWith(".m4a")) continue;
  const base = basename(x, '.m4a');
  const transcribed = join(whisper_dir, base + '.json');
  if (existsSync(transcribed)) {
    console.log(`${base} : already transcribed`);
    done_i++;
    continue;
  }

  all_files.push(join(audio_dir, x));

  if (all_files.length > 5) {

    const args = [
      'python3',
      '-m',
      'whisperx',

      // File config
      "--language",
      "en",

      // Model config
      "--model",
      "large-v2",

      // --diarize?
      // --min_speakers --max_speakers

      // Output file config
      "--output_format",
      "json",
      "--output_dir",
      whisper_dir,

      // MacOS:
      "--compute_type",
      "int8",

      // All files
      ...all_files,
    ];
    const proc = Bun.spawnSync({
      cmd: args,
      stdio: ["inherit", "inherit", "inherit"],
      cwd: join(__dirname, "../whisperX")
    });
    if (!proc.success) {
      console.error("Transcription failed");
      process.exit(1);
    }

    console.log('finished batch', all_files);
    all_files = [];
  }
}

const diff = performance.now() - start;
console.log("[%sms] transcribed %s files", diff | 0, transcribed_i);
