/* eslint @typescript-eslint/no-var-requires: 0 */
const fs = require("fs");
const path = require("path");
const COVERAGE = path.resolve(process.cwd(), "coverage");
const README_FILENAME = path.join(process.cwd(), "README.md");

function log(msg, type) {
  switch (type) {
    case "error":
      console.log("\x1b[31m%s\x1b[0m", msg);
      break;
    case "success":
      console.log("\x1b[32m%s\x1b[0m", msg);
      break;
    default:
      console.log("\x1b[34m%s\x1b[0m", msg);
      break;
  }
}

function readCoverage() {
  fs.readdir(COVERAGE, (err, items) => {
    if (err) log(err, "error");
    else {
      items.forEach((item) => {
        const itemPath = path.resolve(COVERAGE, item);
        fs.readFile(itemPath, "utf8", function (err, contents) {
          if (err) {
            log(err, "error");
          } else {
            const data = JSON.parse(contents);
            const coverage = parseInt(data.total.statements.pct) || 0;
            const name = item.split(".")[0];
            const badge = getCoverageBadge(coverage, name);
            console.log(badge);
            replaceCoverageInReadme(badge, name);
            return badge;
          }
        });
      });
    }
  });
}

function getColor(percent) {
  if (percent < 60) {
    return "red";
  }
  if (percent < 80) {
    return "yellow";
  }
  if (percent < 90) {
    return "green";
  }
  if (percent < 100) {
    return "brightgreen";
  }
}
function getCoverageBadge(pct, name) {
  const color = getColor(pct) || "lightgrey";
  return `https://img.shields.io/badge/Coverage-${pct}%25-${color}.svg?prefix=$${name}$`;
}

const availableColors = ["red", "yellow", "green", "brightgreen", "lightgrey"];
const availableColorsReStr = "(:?" + availableColors.join("|") + ")";

function replaceCoverageInReadme(badge, name) {
  const readme = fs.readFileSync(README_FILENAME, "utf8");
  const regex = new RegExp(
    `https://img\\.shields\\.io/badge/Coverage-\\d+(\\.?\\d+)?%25-${availableColorsReStr}.svg(\\?)prefix=(\\$)${name}(\\$)`
  );
  let updatedReadme = readme.replace(regex, () => badge);
  fs.writeFileSync(README_FILENAME, updatedReadme, "utf8");
}

readCoverage();
