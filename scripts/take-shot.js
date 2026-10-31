const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = process.argv[2] || 'http://localhost:3000/register?role=seller';
const out = process.argv[3] || 'public/verified-register.png';

try {
  execSync(`"${edgePath}" --headless --disable-gpu --screenshot="${out}" --window-size=1280,850 "${url}"`);
  console.log(`Saved screenshot to ${out}`);
} catch (e) {
  console.error('Screenshot failed:', e.message);
}

