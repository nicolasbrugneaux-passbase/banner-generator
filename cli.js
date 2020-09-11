const { join } = require("path");
const { readdirSync, writeFileSync, mkdirSync } = require("fs");
const { createBanner } = require("./lib/banner");

require("yargs")
  .command(
    "generate [lang] [outDir]",
    "Generate a banner for specified language",
    (yargs) => {
      const availableLanguages = readdirSync(join(__dirname, "logos"));
      return yargs
        .option("lang", {
          describe: "language",
          choices: availableLanguages.map((fileName) => fileName.split(".")[0]),
          required: true,
        })
        .option("outDir", {
          describe: "output directory for image",
          type: "string",
          required: true,
        });
    },
    async (argv) => {
      const buffer = await createBanner(argv.lang);
      mkdirSync(argv.outDir, { recursive: true });
      writeFileSync(join(argv.outDir, `${argv.lang}.png`), buffer);
    }
  )
  .demandCommand(1).argv;
