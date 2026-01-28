// move-files.js
const fs = require("fs-extra");
const path = require("path");

const distPath = path.join(__dirname, "dist");
const tempPath = path.join(distPath, "temp");
const webfilesPath = path.join(distPath, "web-new");

async function restructureBuild() {
  await fs.remove(webfilesPath);
  await fs.ensureDir(webfilesPath);

  // Move all files except index.html
  const files = await fs.readdir(tempPath);
  for (const file of files) {
    if (file === "index.html") {
      await fs.copy(path.join(tempPath, file), path.join(distPath, file));
    } else {
      await fs.move(path.join(tempPath, file), path.join(webfilesPath, file));
    }
  }

  await fs.remove(tempPath);
  console.log("✅ Build files moved to /dist/web-new and index.html placed at /dist");
}

restructureBuild();
