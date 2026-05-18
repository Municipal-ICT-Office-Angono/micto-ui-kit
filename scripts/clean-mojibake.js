const fs = require('fs');
const path = require('path');

const filesToClean = [
  path.join(__dirname, '../registry/new-york/example/data-table-demo.tsx'),
  path.join(__dirname, '../registry/new-york/example/file-uploader-demo.tsx'),
  path.join(__dirname, '../registry/new-york/example/document-viewer-demo.tsx'),
  path.join(__dirname, '../registry/new-york/example/activity-timeline-demo.tsx'),
  path.join(__dirname, '../app/docs/components/micto/data-table/page.tsx'),
  path.join(__dirname, '../app/docs/components/micto/document-viewer/page.tsx'),
  path.join(__dirname, '../app/docs/components/micto/activity-timeline/page.tsx')
];

const replacements = [
  // Garbled dividers
  { pattern: /â”€â”€â”€/g, replacement: '---' },
  { pattern: /â”€â”€/g, replacement: '--' },
  { pattern: /â”€/g, replacement: '-' },
  
  // Garbled Emojis / Special characters
  { pattern: /ðŸš€/g, replacement: '🚀' },
  { pattern: /ðŸ“·/g, replacement: '📷' },
  { pattern: /ðŸ“ /g, replacement: '📁' },
  { pattern: /ðŸŽ‰/g, replacement: '🎉' },
  { pattern: /âœ…/g, replacement: '✅' },
  { pattern: /â Œ/g, replacement: '❌' },
  { pattern: /â‹®/g, replacement: '⋮' },
  
  // Garbled bullets & degree symbols
  { pattern: /Â·/g, replacement: '·' },
  { pattern: /Â°/g, replacement: '°' }
];

console.log('Starting Mojibake Clean-Up...');

filesToClean.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`Cleaning file: ${path.basename(filePath)}`);
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned: ${path.basename(filePath)}`);
  } else {
    console.log(`⚠️ File not found: ${filePath}`);
  }
});

console.log('Clean-up complete!');
