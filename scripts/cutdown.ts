// Monte le cutdown 30 s à partir du master haute qualité (mêmes images que la composition Cutdown30),
// en suivant les extraits de config.ts (cutdown30.extraits), avec un fondu sonore de 0,1 s à chaque coupe.
// Usage : npx tsx scripts/cutdown.ts [entrée=out/master_hq.mp4]
import { execFileSync } from "child_process";
import { cutdown30 } from "../src/config";

const input = process.argv[2] || "out/master_hq.mp4";
const out = "rendu/coopeo-ai-cutdown-30s.mp4";
const parts: string[] = [];
cutdown30.extraits.forEach(([debut, duree], i) => {
  const fin = debut + duree;
  parts.push(
    `[0:v]trim=start=${debut}:end=${fin},setpts=PTS-STARTPTS[v${i}];` +
      `[0:a]atrim=start=${debut}:end=${fin},asetpts=PTS-STARTPTS,afade=t=in:d=0.1,afade=t=out:st=${(duree - 0.1).toFixed(2)}:d=0.1[a${i}];`,
  );
});
const n = cutdown30.extraits.length;
const concat = Array.from({ length: n }, (_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${n}:v=1:a=1[v][a]`;
execFileSync(
  "ffmpeg",
  [
    "-y", "-loglevel", "error", "-i", input,
    "-filter_complex", parts.join("") + concat,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "slow", "-b:v", "12M", "-maxrate", "16M", "-bufsize", "24M",
    "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
    out,
  ],
  { stdio: "inherit" },
);
console.log(`${out} écrit`);
