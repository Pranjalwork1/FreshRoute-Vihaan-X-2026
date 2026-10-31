import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputPath = path.resolve("public/header-spacing.png");

const args = [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1280,600",
  `--screenshot=${outputPath}`,
  "http://localhost:3000",
];

execFile(edgePath, args, (err) => {
  if (err) {
    console.error("Error running Edge:", err);
    return;
  }
  console.log("Edge screenshot executed.");
  if (fs.existsSync(outputPath)) {
    const stat = fs.statSync(outputPath);
    console.log(`Success! Header screenshot saved (${stat.size} bytes)`);
  }
});
