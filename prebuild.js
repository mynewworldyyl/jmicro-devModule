const fs = require('fs');
const path = require('path');

const dirs = ['arduino', 'jmicro', 'sensor'];
const baseDir = __dirname;
const buildSrcDir = path.join(baseDir, 'build_src');

function emptyDir(dir) {
    if (!fs.existsSync(dir)) return;
    try {
        fs.readdirSync(dir).forEach(f => {
            const p = path.join(dir, f);
            try {
                if (fs.lstatSync(p).isDirectory()) emptyDir(p);
                else fs.unlinkSync(p);
            } catch (e) {
                console.warn(`[prebuild] cannot delete ${p}: ${e.message}`);
            }
        });
        fs.rmdirSync(dir);
    } catch (e) {
        console.warn(`[prebuild] cannot remove dir ${dir}: ${e.message}`);
    }
}

function copyDir(src, dst) {
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    fs.readdirSync(src).forEach(f => {
        const s = path.join(src, f);
        const d = path.join(dst, f);
        try {
            if (fs.lstatSync(s).isDirectory()) copyDir(s, d);
            else fs.copyFileSync(s, d);
        } catch (e) {
            console.warn(`[prebuild] cannot copy ${s} -> ${d}: ${e.message}`);
        }
    });
}

function processAsyncMethods(content) {
    let result = content;
    const asyncIndices = [];
    let idx = 0;

    while ((idx = result.indexOf('@async', idx)) !== -1) {
        asyncIndices.push(idx);
        idx += 6;
    }

    for (let i = asyncIndices.length - 1; i >= 0; i--) {
        const pos = asyncIndices[i];

        const commentEnd = result.indexOf('*/', pos);
        if (commentEnd === -1) continue;

        const methodMatch = result.slice(commentEnd).match(/(\w+)\s*:\s*function\s*\(/);
        if (!methodMatch) continue;

        const methodDefStart = commentEnd + methodMatch.index;
        const methodName = methodMatch[1];
        const methodDefLength = methodMatch[0].length;

        result =
            result.slice(0, methodDefStart) +
            methodName + ': async function (' +
            result.slice(methodDefStart + methodDefLength);

        const bodyStart = result.indexOf('{', methodDefStart);
        if (bodyStart === -1) continue;

        let depth = 1;
        let p = bodyStart + 1;
        while (p < result.length && depth > 0) {
            if (result[p] === '{') depth++;
            else if (result[p] === '}') depth--;
            p++;
        }
        const bodyEnd = p;

        const methodBody = result.slice(bodyStart + 1, bodyEnd - 1);
        let newBody = methodBody.replace(/(var\s+\w+\s*=\s*)jm\.s\(/g, '$1await jm.s(');
        if (newBody === methodBody) {
            newBody = methodBody.replace(/(return\s*)jm\.s\(/g, '$1await jm.s(');
        }

        if (newBody !== methodBody) {
            result = result.slice(0, bodyStart + 1) + newBody + result.slice(bodyEnd - 1);
        }
    }

    return result;
}

function prepareBuildSrc() {
    if (fs.existsSync(buildSrcDir)) {
        emptyDir(buildSrcDir);
    }
    fs.mkdirSync(buildSrcDir, { recursive: true });

    const rootIndex = path.join(baseDir, 'index.js');
    if (fs.existsSync(rootIndex)) {
        fs.copyFileSync(rootIndex, path.join(buildSrcDir, 'index.js'));
    }

    dirs.forEach(dir => {
        const srcDir = path.join(baseDir, dir);
        const dstDir = path.join(buildSrcDir, dir);
        if (!fs.existsSync(srcDir)) return;
        copyDir(srcDir, dstDir);
    });
}

prepareBuildSrc();

dirs.forEach(dir => {
  const dirPath = path.join(buildSrcDir, dir);
  if (!fs.existsSync(dirPath)) return;

  fs.readdirSync(dirPath).forEach(file => {
    if (!file.endsWith('.js')) return;
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    const m = content.match(/^\s*var\s+(\w+)\s*=\s*\{/m);
    if (!m) return;
    const varName = m[1];

    const asyncContent = processAsyncMethods(content);
    if (asyncContent !== content) {
        fs.writeFileSync(filePath, asyncContent, 'utf8');
        console.log(`[prebuild] async transformed: build_src/${dir}/${file}`);
    }

    if (hasRealExport(content, varName)) return;

    const finalContent = fs.readFileSync(filePath, 'utf8');
    if (!hasRealExport(finalContent, varName)) {
        fs.appendFileSync(filePath, `\nmodule.exports = ${varName};\n`, 'utf8');
        console.log(`[prebuild] injected: build_src/${dir}/${file} -> ${varName}`);
    }
  });
});

function hasRealExport(content, varName) {
  const uncommented = content.replace(/^\s*\/\/.*$/gm, '');
  return uncommented.trimEnd().endsWith(`module.exports = ${varName};`);
}