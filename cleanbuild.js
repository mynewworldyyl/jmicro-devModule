const fs = require('fs');
const path = require('path');

const dirs = ['arduino', 'jmicro', 'sensor'];
const baseDir = __dirname;

dirs.forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  if (!fs.existsSync(dirPath)) return;

  fs.readdirSync(dirPath).forEach(file => {
    if (!file.endsWith('.js')) return;
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const original = content;
    content = content.replace(/^\s*module\.exports\s*=\s*\w+;\s*$/gm, '');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[clean] removed: ${dir}/${file}`);
    }
  });
});
