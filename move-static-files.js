const fs = require('fs').promises;
const path = require('path');

async function findFilesRecursive(dir, collected = []) {
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      await findFilesRecursive(fullPath, collected);
    } else {
      collected.push(fullPath);
    }
  }

  return collected;
}

async function moveStaticFiles() {
  const rootDist = path.join(__dirname, 'dist');

  console.log("Scanning:", rootDist);

  const allFiles = await findFilesRecursive(rootDist);
  const targetDir = path.join(rootDist, 'static-build');

  await fs.mkdir(targetDir, { recursive: true });

  const patterns = ['main', 'polyfills', 'runtime', 'styles'];

  for (const p of patterns) {
    const file = allFiles.find(f =>
      path.basename(f).startsWith(p) &&
      (f.endsWith('.js') || f.endsWith('.css'))
    );

    if (!file) {
      console.log(`❌ Not found: ${p}.*`);
      continue;
    }

    const fileName = path.basename(file);
    const dest = path.join(targetDir, fileName);

    await fs.copyFile(file, dest);

    console.log(`✅ Copied: ${fileName}`);
  }
}

moveStaticFiles();
