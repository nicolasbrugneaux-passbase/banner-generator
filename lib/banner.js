const { join } = require("path");

const { createCanvas, loadImage } = require("canvas");

const [blankPromise, passbasePromise, passbaseLogoTypePromise] = [
  loadImage(join(__dirname, "..", "assets", "github-banner-blank.png")),
  loadImage(join(__dirname, "..", "assets", "passbase-logo.svg")),
  loadImage(join(__dirname, "..", "assets", "passbase-logotype.svg")),
];

// TODO: Remove this when this issue is resolved
// https://github.com/Automattic/node-canvas/issues/1474
const UPSCALE_RATIO = 20;

async function createBanner(lang) {
  const [blank, passbaseShield, passbaseLogoType, logo] = await Promise.all([
    blankPromise,
    passbasePromise,
    passbaseLogoTypePromise,
    loadImage(join(__dirname, "..", "logos", `${lang}.svg`)),
  ]);
  const { naturalWidth: width, naturalHeight: height } = blank;
  const passbaseLogoRatio =
    passbaseShield.naturalHeight / passbaseShield.naturalWidth;
  const passbaseLogoTypeRatio =
    passbaseLogoType.naturalWidth / passbaseLogoType.naturalHeight;
  const logoRatio = logo.naturalWidth / logo.naturalHeight;
  const logoSize = 150; // arbitrary

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  context.fillRect(0, 0, width, height);
  context.drawImage(blank, 0, 0);

  passbaseLogoType.width = UPSCALE_RATIO * logoSize * passbaseLogoTypeRatio;
  passbaseLogoType.height = UPSCALE_RATIO * logoSize;
  context.drawImage(
    passbaseLogoType,
    width / 2 - logoSize * passbaseLogoTypeRatio - 100,
    (height - logoSize) / 2,
    logoSize * passbaseLogoTypeRatio,
    logoSize
  );

  passbaseShield.width = UPSCALE_RATIO * logoSize;
  passbaseShield.height = UPSCALE_RATIO * logoSize * passbaseLogoRatio;

  // context.drawImage(
  //   passbaseShield,
  //   width / 2 - logoSize * passbaseLogoRatio - 150,
  //   (height - logoSize) / 2,
  //   logoSize,
  //   logoSize * passbaseLogoRatio
  // );

  logo.width = UPSCALE_RATIO * logoSize * logoRatio;
  logo.height = UPSCALE_RATIO * logoSize;
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
