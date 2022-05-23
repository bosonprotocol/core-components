/* eslint @typescript-eslint/no-var-requires: 0 */
const fs = require("fs");
const path = require("path");

const PACKAGES_PATH = path.resolve(process.cwd(), "packages");
const NYC_PATH = path.resolve(process.cwd(), ".nyc_output");

function combineCoverage() {
  if (!fs.existsSync(NYC_PATH)) {
    fs.mkdirSync(NYC_PATH);
  }

  fs.readdir(PACKAGES_PATH, (err, packages) => {
    if (err) console.log(err);
    else {
      packages.forEach((package) => {
        const packagePath = path.resolve(PACKAGES_PATH, package);
        fs.stat(packagePath, (err, stats) => {
          if (err) {
            console.log(err);
          }

          if (stats.isDirectory()) {
            try {
              try {
                require("child_process").execSync(
                  "npm run test --coverage --silent",
                  {
                    cwd: packagePath,
                    stdio: "inherit"
                  }
                );
              } catch (error) {
                console.error("Failed to run test coverage", error);
              }
              const report = path.resolve(
                packagePath,
                "coverage",
                "coverage-final.json"
              );
              if (fs.existsSync(report)) {
                const destPath = path.resolve(NYC_PATH, `${package}.json`);
                fs.copyFileSync(report, destPath);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      });
    }
  });
}

combineCoverage();
