const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const BUILD_DIR = path.join(__dirname, "build/web-mobile");

const PACKAGE_URL = "http://localhost:8080/hotupdate/";

function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(fileBuffer).digest("hex");
}

function generateAssetData(dir, relativePath = "") {
  const files = fs.readdirSync(dir);
  let assets = {};

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const relPath = path.join(relativePath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(assets, generateAssetData(fullPath, relPath));
    } else {
      assets[relPath] = {
        md5: getFileHash(fullPath),
        size: fs.statSync(fullPath).size,
      };
    }
  });

  return assets;
}

const projectManifest = {
  packageUrl: PACKAGE_URL,
  remoteManifestUrl: PACKAGE_URL + "project.manifest",
  remoteVersionUrl: PACKAGE_URL + "version.manifest",
  version: "1.0.0",
  assets: generateAssetData(BUILD_DIR),
  searchPaths: [],
};

const versionManifest = {
  packageUrl: PACKAGE_URL,
  remoteManifestUrl: PACKAGE_URL + "project.manifest",
  remoteVersionUrl: PACKAGE_URL + "version.manifest",
  version: "1.0.0",
};

const OUTPUT_DIR = path.join(__dirname, "remote-assets");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

fs.writeFileSync(
  path.join(OUTPUT_DIR, "project.manifest"),
  JSON.stringify(projectManifest, null, 4)
);
fs.writeFileSync(
  path.join(OUTPUT_DIR, "version.manifest"),
  JSON.stringify(versionManifest, null, 4)
);
