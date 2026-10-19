const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a8352" />
      <stop offset="100%" stop-color="#043822" />
    </linearGradient>
  </defs>

  <rect width="256" height="256" rx="64" fill="url(#bg)" />

  <!-- Texto RCS -->
  <text x="128" y="165" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif" font-size="88" font-weight="900" fill="#ffffff" letter-spacing="4">
    RCS
  </text>

  <!-- Coração & Traçado no topo -->
  <g transform="translate(128, 62) scale(1.1)" stroke="#ffffff" fill="none" stroke-width="2.6">
    <path d="M0 16s-12-7.5-12-15.5C-12 5.5 -9 2.5 -5 2.5c2.4 0 4.2 1.3 5 3 0.8-1.7 2.6-3 5-3 4 0 7 3 7 8C7 8.5 0 16 0 16z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M-9 10h4l2-4 2.5 8 2-4h4" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>`;

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const buf = Buffer.from(iconSvg);

  await sharp(buf).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(buf).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));

  console.log('Successfully generated apple-touch-icon.png and favicon.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
