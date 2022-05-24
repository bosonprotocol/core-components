/* eslint @typescript-eslint/no-var-requires: 0 */
const fs = require("fs");
const path = require("path");

const PATHS = {
  PACKAGES: path.resolve(process.cwd(), "packages"),
  NYC: path.resolve(process.cwd(), ".nyc_output"),
  COVERAGE: path.resolve(process.cwd(), "coverage")
};

function copyFile({ packagePath, folder, name, dest, destName }) {
  const file = path.resolve(packagePath, folder, name);
  if (fs.existsSync(file)) {
    const destPath = path.resolve(dest, `${destName}.json`);
    fs.copyFileSync(file, destPath);
  }
}

function combineCoverage() {
  if (!fs.existsSync(PATHS.NYC)) {
    fs.mkdirSync(PATHS.NYC);
  }

  fs.readdir(PATHS.PACKAGES, (err, packages) => {
    if (err) console.error(err);
    else {
      packages.forEach((package) => {
        const packagePath = path.resolve(PATHS.PACKAGES, package);
        fs.stat(packagePath, (err, stats) => {
          if (err) {
            console.log(err);
          }

          if (stats.isDirectory()) {
            try {
              require("child_process").execSync("npm run test --silent", {
                cwd: packagePath,
                stdio: "inherit"
              });
            } catch (error) {
              console.log(error);
            }

            copyFile({
              packagePath,
              folder: "coverage",
              name: "coverage-final.json",
              dest: PATHS.NYC,
              destName: package
            });
            copyFile({
              packagePath,
              folder: "coverage",
              name: "coverage-summary.json",
              dest: PATHS.COVERAGE,
              destName: `${package}-summary`
            });
          }
        });
      });
    }
  });
}

combineCoverage();
