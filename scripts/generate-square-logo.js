const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#04140c" />
      <stop offset="50%" stop-color="#072618" />
      <stop offset="100%" stop-color="#020a06" />
    </linearGradient>

    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#056138" />
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#10b981" flood-opacity="0.4" />
    </filter>
  </defs>

  <rect width="800" height="800" rx="140" fill="url(#bg)" />
  <rect width="780" height="780" x="10" y="10" rx="130" fill="none" stroke="#10b981" stroke-opacity="0.25" stroke-width="3" />

  <!-- Badge RCS -->
  <g transform="translate(400, 290)">
    <rect x="-140" y="-120" width="280" height="210" rx="55" fill="url(#badgeGrad)" filter="url(#glow)" stroke="#34d399" stroke-width="4" />
    <text x="0" y="30" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif" font-size="95" font-weight="900" fill="#ffffff" letter-spacing="6">
      RCS
    </text>
    <g transform="translate(-25, -78) scale(1.4)" stroke="#ffffff" fill="none" stroke-width="2.6">
      <path d="M24 37s-14-9-14-18.5C10 12.5 13.5 9 18 9c2.8 0 4.8 1.5 6 3.5 1.2-2 3.2-3.5 6-3.5 4.5 0 8 3.5 8 9.5C38 28 24 37 24 37z" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14 22h5l2.5-5 3 10 2.5-5H34" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </g>

  <!-- Nome -->
  <text x="400" y="495" text-anchor="middle" font-family="'DM Serif Display', Georgia, serif" font-size="52" font-weight="700" fill="#ffffff">
    Comunidade Saúde RCS
  </text>

  <!-- Tag Concursos da Saúde -->
  <g transform="translate(400, 560)">
    <rect x="-190" y="-20" width="380" height="40" rx="20" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="0" y="6" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif" font-size="15" font-weight="800" fill="#a7f3d0" letter-spacing="3">
      CONCURSOS DA SAÚDE
    </text>
  </g>

  <!-- Carreiras -->
  <text x="400" y="640" text-anchor="middle" font-family="'DM Sans', system-ui, sans-serif" font-size="20" font-weight="600" fill="#34d399" letter-spacing="1.5">
    Enfermagem • Radiologia Médica
  </text>
</svg>`;

async function main() {
  const pngPath = path.join(__dirname, '..', 'public', 'comunidade-saude.png');
  await sharp(Buffer.from(squareSvg))
    .resize(800, 800)
    .png({ quality: 95 })
    .toFile(pngPath);
  console.log('Successfully generated square comunidade-saude.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
