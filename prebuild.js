const fs = require('fs');
const path = require('path');

const dirs = ['arduino', 'jmicro', 'sensor'];
const baseDir = __dirname;
const systemBuildSrcDir = path.join(baseDir, 'build_src');

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
        let newBody = methodBody.replace(/((?:let|var|const)\s+\w+\s*=\s*)jm\.s\(/g, '$1await jm.s(');
        if (newBody === methodBody) {
            newBody = methodBody.replace(/(return\s*)jm\.s\(/g, '$1await jm.s(');
        }

        if (newBody !== methodBody) {
            result = result.slice(0, bodyStart + 1) + newBody + result.slice(bodyEnd - 1);
        }
    }

    return result;
}

function hasRealExport(content, varName) {
  const uncommented = content.replace(/^\s*\/\/.*$/gm, '');
  return uncommented.trimEnd().endsWith(`module.exports = ${varName};`);
}

const actId = (process.env.ACT_ID || process.env.npm_config_actId || '').toString().trim();

if (actId) {
    // ========== 用户构建：只构建用户自己的模块 ==========
    const userBuildSrcDir = path.join(baseDir, 'userModules', actId, 'build_src');

    if (fs.existsSync(userBuildSrcDir)) {
        emptyDir(userBuildSrcDir);
    }
    fs.mkdirSync(userBuildSrcDir, { recursive: true });

    let indexContent = `// User build entry for actId: ${actId}\n`;
    const userImports = [];
    const userAssignments = [];
    const newUserModules = [];

    const userDir = path.join(baseDir, 'userModules', actId);
    if (fs.existsSync(userDir) && fs.lstatSync(userDir).isDirectory()) {
        const userFiles = fs.readdirSync(userDir).filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));

        for (const file of userFiles) {
            const fileName = file;
            const modName = file.replace(/^jm_/, '').replace(/\.js$/, '');
            let targetPath = null;
            
            for (const dir of dirs) {
                const candidate = path.join(userBuildSrcDir, dir, fileName);
                if (fs.existsSync(candidate)) {
                    targetPath = candidate;
                    break;
                }
            }
            
            if (targetPath) {
                fs.copyFileSync(path.join(userDir, fileName), targetPath);
                console.log(`[prebuild] user module override: ${path.relative(userBuildSrcDir, targetPath)}`);
            } else {
                const dstPath = path.join(userBuildSrcDir, fileName);
                fs.copyFileSync(path.join(userDir, fileName), dstPath);
                newUserModules.push({ fileName, modName, dstPath });
                console.log(`[prebuild] user module added: ${fileName} -> ${modName}`);
            }
        }
        
        for (const mod of newUserModules) {
            userImports.push(`import ${mod.modName} from "./${mod.fileName}"`);
            userAssignments.push(`Object.assign(jm, {${mod.modName}: ${mod.modName}})`);
            userAssignments.push(`Object.assign(window, {${mod.modName}: ${mod.modName}})`);

            const filePath = mod.dstPath;
            let content = fs.readFileSync(filePath, 'utf8');
            const m = content.match(/^\s*var\s+(\w+)\s*=\s*\{/m);
            const vName = m ? m[1] : mod.modName;

            const asyncContent = processAsyncMethods(content);
            if (asyncContent !== content) {
                fs.writeFileSync(filePath, asyncContent, 'utf8');
                console.log(`[prebuild] async transformed (user): ${mod.fileName}`);
            }

            const finalContent = fs.readFileSync(filePath, 'utf8');
            if (!hasRealExport(finalContent, vName)) {
                fs.appendFileSync(filePath, `\nmodule.exports = ${vName};\n`, 'utf8');
                console.log(`[prebuild] injected export (user): ${mod.fileName} -> ${vName}`);
            }
        }

        if (newUserModules.length > 0) {
            indexContent += '\n// ========== 用户模块 ==========\n';
            indexContent += userImports.join('\n') + '\n';
            indexContent += userAssignments.join('\n') + '\n';
        }
    }

    fs.writeFileSync(path.join(userBuildSrcDir, 'index.js'), indexContent);
    console.log(`[prebuild] user build_src ready: ${userBuildSrcDir}`);

} else {
    // ========== 系统构建：构建全部系统模块 ==========
    if (fs.existsSync(systemBuildSrcDir)) {
        emptyDir(systemBuildSrcDir);
    }
    fs.mkdirSync(systemBuildSrcDir, { recursive: true });

    const rootIndex = path.join(baseDir, 'index.js');
    if (fs.existsSync(rootIndex)) {
        fs.copyFileSync(rootIndex, path.join(systemBuildSrcDir, 'index.js'));
    }

    dirs.forEach(dir => {
        const srcDir = path.join(baseDir, dir);
        const dstDir = path.join(systemBuildSrcDir, dir);
        if (!fs.existsSync(srcDir)) return;
        copyDir(srcDir, dstDir);
    });

    dirs.forEach(dir => {
        const dirPath = path.join(systemBuildSrcDir, dir);
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
}
