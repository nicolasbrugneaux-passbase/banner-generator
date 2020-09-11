const { join } = require("path");

const { createCanvas, loadImage } = require("canvas");

const [blankPromise, passbasePromise /*passbaseLogoTypePromise*/] = [
  loadImage(join(__dirname, "..", "assets", "github-banner-blank.png")),
  loadImage(join(__dirname, "..", "assets", "passbase-logo.svg")),
  //   loadImage(join(__dirname, "..", "assets", "passbase-logotype.svg")),
];

async function createBanner(lang) {
  const [blank, passbaseShield, /*passbaseLogoType,*/ logo] = await Promise.all(
    [
      blankPromise,
      passbasePromise,
      // passbaseLogoTypePromise,
      loadImage(join(__dirname, "..", "logos", `${lang}.svg`)),
    ]
  );
  const { naturalWidth: width, naturalHeight: height } = blank;
  const passbaseLogoRatio =
    passbaseShield.naturalHeight / passbaseShield.naturalWidth;
  //   const passbaseLogoTypeRatio =
  //     passbaseLogoType.naturalWidth / passbaseLogoType.naturalHeight;
  const logoRatio = logo.naturalWidth / logo.naturalHeight;
  const logoSize = 150; // arbitrary

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillRect(0, 0, width, height);
  context.drawImage(blank, 0, 0);

  //   context.drawImage(
  //     passbaseLogoType,
  //     100,
  //     (height - logoSize) / 2,
  //     logoSize * passbaseLogoTypeRatio,
  //     logoSize
  //   );

  passbaseShield.width = 10 * logoSize;
  passbaseShield.height = 10 * logoSize * passbaseLogoRatio;

  context.drawImage(
    passbaseShield,
    width / 2 - logoSize * passbaseLogoRatio - 150,
    (height - logoSize) / 2,
    logoSize,
    logoSize * passbaseLogoRatio
  );

  logo.width = 10 * logoSize * logoRatio;
  logo.height = 10 * logoSize;
  context.drawImage(
    logo,
    width / 2 + 150,
    (height - logoSize) / 2,
    logoSize * logoRatio,
    logoSize
  );

  const buffer = canvas.toBuffer("image/png");
  return buffer;
}

exports.createBanner = createBanner;
