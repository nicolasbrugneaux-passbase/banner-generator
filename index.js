const { join } = require("path");
const { readdirSync, writeFileSync, readFileSync } = require("fs");
const { fork } = require("child_process");

const LANGUAGES = readdirSync(join(__dirname, "logos"))
  .map((fileName) => fileName.split(".")[0])
  .filter(Boolean);

function exportHtml() {
  const html = readFileSync(join("assets", "index.html")).toString();

  writeFileSync(
    join("public", "index.html"),
    Buffer.from(
      html.replace(
        "{links}",
        LANGUAGES.map(
          (lang) => `    <a href="/${lang}.png"><img src="/${lang}.png"></a>`
        ).join("\n")
      )
    )
  );
}

const processes = LANGUAGES.map((lang) => {
  return fork(join(__dirname, "cli.js"), ["generate", lang, "public"], {
    stdio: [null, process.stdout, process.stdout, "ipc"],
  });
}).filter(Boolean);

let exited = 0;
processes.forEach((child) =>
  child.on("exit", () => {
    exited += 1;
    if (exited === processes.length) {
      exportHtml();
      console.log(`Generated banners for ${LANGUAGES.join(", ")}!`);
      process.exit();
    }
  })
);
