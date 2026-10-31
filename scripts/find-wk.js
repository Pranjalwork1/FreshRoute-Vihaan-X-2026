const fs = require('fs');
const path = 'C:/Users/Pranjal singh/.gemini/antigravity/brain/af71a0c6-49cb-43af-b864-1f351d72efbf/.user_uploaded/media_1793422084243_afcff236.html';
const html = fs.readFileSync(path, 'utf8');

const idx = html.indexOf('class="wk"');
console.log('=== HTML WK ===\n' + html.slice(idx, idx + 800));

// Also find JS where wk or sdn is manipulated
const jsIdx = html.indexOf('openWorkspace') > -1 ? html.indexOf('openWorkspace') : html.indexOf('sdn');
console.log('\n=== JS WK ===\n' + html.slice(jsIdx - 100, jsIdx + 1200));
