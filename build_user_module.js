const { spawnSync } = require('child_process');
const path = require('path');

const actId = process.env.ACT_ID || process.env.npm_config_actId;

if (!actId) {
  console.error('ERROR: ACT_ID is required for user module build.');
  console.error('Usage:');
  console.error('  Windows: set ACT_ID=809 && npm run buildUserModule');
  console.error('  Linux/Mac: ACT_ID=809 npm run buildUserModule');
  console.error('  Or: npm run buildUserModule -- --actId 809');
  process.exit(1);
}

process.env.ACT_ID = String(actId);

const moduleDir = path.resolve(__dirname);

function runCmd(cmd) {
  const result = spawnSync(cmd, [], {
    cwd: moduleDir,
    stdio: 'inherit',
    shell: true,
    env: process.env
  });
  return result.status;
}

console.log(`[buildUserModule] Building for actId: ${actId}`);

const prebuildStatus = runCmd('npm run prebuild');
if (prebuildStatus !== 0) {
  console.error('[buildUserModule] prebuild failed');
  process.exit(prebuildStatus);
}

const webpackStatus = runCmd('npx webpack --mode production');
if (webpackStatus !== 0) {
  console.error('[buildUserModule] webpack build failed');
  process.exit(webpackStatus);
}

console.log(`[buildUserModule] User module build completed: actId=${actId}`);
