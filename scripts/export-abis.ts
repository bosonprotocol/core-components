import fs from "fs";
import { execSync } from "child_process";
import prettier from "prettier";

async function main() {
  console.log("Compiling contracts...");
  execSync("cd contracts && npx hardhat export-abi");
  console.log("Contracts compiled ✅\n");

  const abisDirFiles = fs.readdirSync(
    `${process.cwd()}/packages/common/src/abis`
  );
  const abiJsonFiles = abisDirFiles
    .map((fileName) => {
      if (fileName.endsWith(".json")) {
        return fileName;
      }
      return null;
    })
    .filter((fileName) => fileName);

  const indexFileContent = [
    "/** auto-generated code: do not edit */",
    " ",
    abiJsonFiles.map((jsonFileName) => {
      return `import ${getAbiImportVarName(
        jsonFileName
      )} from "./${jsonFileName}"`;
    }),
    " ",
    `export {
      ${abiJsonFiles.map((jsonFileName) => getAbiImportVarName(jsonFileName))}
    }`
  ]
    .flat()
    .join("\n");

  const prettierConfig = await prettier.resolveConfig(
    `${process.cwd()}/.prettierrc`
  );
  fs.writeFileSync(
    `${process.cwd()}/packages/common/src/abis/index.ts`,
    prettier.format(indexFileContent, prettierConfig || {})
  );
}

function getAbiImportVarName(jsonFileName: string | null) {
  const [contractName] = (jsonFileName || "").split(".json");
  return `${contractName.replace("Mock", "")}ABI`;
}

main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
