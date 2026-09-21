const fs = require('fs');
const path = require('path');

function generateEatingSnake() {
  const username = process.env.GITHUB_REPOSITORY_OWNER || 'selormtettehabotsi';
  const totalWeeks = 53;
  const daysPerWeek = 7;

  // Initialize empty grid 53 x 7
  const grid = Array.from({ length: totalWeeks }, () => Array(daysPerWeek).fill(0));

  // Active entries from 287 contributions: [col, row, level (1..4)]
  const activeEntries = [
    // Sep (Col 0)
    { col: 0, row: 1, level: 1, id: 'b_0_1' },
    { col: 0, row: 5, level: 3, id: 'b_0_5' },

    // Nov (Cols 6, 7, 8)
    { col: 6, row: 3, level: 1, id: 'b_6_3' },
    { col: 6, row: 6, level: 2, id: 'b_6_6' },
    { col: 7, row: 1, level: 1, id: 'b_7_1' },
    { col: 7, row: 6, level: 1, id: 'b_7_6' },
    { col: 8, row: 5, level: 1, id: 'b_8_5' },

    // Apr (Cols 28, 29)
    { col: 28, row: 3, level: 1, id: 'b_28_3' },
    { col: 29, row: 6, level: 1, id: 'b_29_6' },

    // May (Cols 32, 33, 34, 35)
    { col: 32, row: 3, level: 1, id: 'b_32_3' },
    { col: 32, row: 4, level: 1, id: 'b_32_4' },
    { col: 32, row: 6, level: 1, id: 'b_32_6' },
    { col: 33, row: 4, level: 2, id: 'b_33_4' },
    { col: 33, row: 5, level: 1, id: 'b_33_5' },
    { col: 34, row: 6, level: 3, id: 'b_34_6' },
    { col: 35, row: 0, level: 3, id: 'b_35_0' },
    { col: 35, row: 6, level: 3, id: 'b_35_6' },

    // Jun (Cols 36, 37, 38, 39)
    { col: 36, row: 1, level: 1, id: 'b_36_1' },
    { col: 36, row: 5, level: 2, id: 'b_36_5' },
    { col: 37, row: 2, level: 1, id: 'b_37_2' },
    { col: 37, row: 4, level: 1, id: 'b_37_4' },
    { col: 37, row: 5, level: 1, id: 'b_37_5' },
    { col: 38, row: 2, level: 2, id: 'b_38_2' },
    { col: 38, row: 3, level: 1, id: 'b_38_3' },
    { col: 38, row: 4, level: 1, id: 'b_38_4' },
    { col: 38, row: 5, level: 1, id: 'b_38_5' },
    { col: 39, row: 1, level: 2, id: 'b_39_1' },

    // Jul (Cols 40, 41, 42, 43, 44)
    { col: 40, row: 0, level: 3, id: 'b_40_0' },
    { col: 40, row: 1, level: 1, id: 'b_40_1' },
    { col: 40, row: 2, level: 1, id: 'b_40_2' },
    { col: 41, row: 1, level: 1, id: 'b_41_1' },
    { col: 41, row: 2, level: 1, id: 'b_41_2' },
    { col: 42, row: 2, level: 1, id: 'b_42_2' },
    { col: 42, row: 5, level: 2, id: 'b_42_5' },
    { col: 43, row: 5, level: 1, id: 'b_43_5' },
    { col: 44, row: 1, level: 1, id: 'b_44_1' },

    // Aug (Cols 45, 46, 47) - Dense cluster
    { col: 45, row: 1, level: 1, id: 'b_45_1' },
    { col: 45, row: 2, level: 2, id: 'b_45_2' },
    { col: 45, row: 3, level: 2, id: 'b_45_3' },
    { col: 45, row: 4, level: 1, id: 'b_45_4' },
    { col: 45, row: 5, level: 3, id: 'b_45_5' },
    { col: 45, row: 6, level: 4, id: 'b_45_6' },
    { col: 46, row: 2, level: 2, id: 'b_46_2' },
    { col: 46, row: 3, level: 3, id: 'b_46_3' },
    { col: 46, row: 5, level: 3, id: 'b_46_5' },
    { col: 46, row: 6, level: 3, id: 'b_46_6' },
    { col: 47, row: 4, level: 1, id: 'b_47_4' },
    { col: 47, row: 5, level: 2, id: 'b_47_5' },
    { col: 47, row: 6, level: 4, id: 'b_47_6' },

    // Sep (Cols 51, 52)
    { col: 51, row: 5, level: 2, id: 'b_51_5' },
    { col: 51, row: 6, level: 4, id: 'b_51_6' },
    { col: 52, row: 0, level: 4, id: 'b_52_0' }
  ];

  const cellWidth = 11;
  const cellHeight = 11;
  const cellGap = 3.5;
  const startX = 58;
  const startY = 60;

  const colors = [
    '#161b22', // Empty
    '#0e4429', // Level 1
    '#006d32', // Level 2
    '#26a641', // Level 3
    '#39d353'  // Level 4
  ];

  const activeMap = {};
  activeEntries.forEach(item => {
    item.x = startX + item.col * (cellWidth + cellGap);
    item.y = startY + item.row * (cellHeight + cellGap);
    grid[item.col][item.row] = item.level;
    activeMap[`${item.col}_${item.row}`] = item;
  });

  const sortedWaypoints = [...activeEntries].sort((a, b) => {
    if (a.col !== b.col) return a.col - b.col;
    return a.row - b.row;
  });

  const waypoints = [
    { x: startX - 20, y: startY + 15 },
    ...sortedWaypoints,
    { x: startX + 53 * (cellWidth + cellGap) + 15, y: startY },
    { x: startX - 20, y: startY + 15 }
  ];

  const totalWaypoints = waypoints.length;
  const totalAnimSec = 20;

  let snakeKeyframes = '@keyframes snakeMovement {\n';
  const eatTimings = {};

  waypoints.forEach((wp, idx) => {
    const pct = ((idx / (totalWaypoints - 1)) * 100).toFixed(2);
    snakeKeyframes += `  ${pct}% { transform: translate(${wp.x.toFixed(1)}px, ${wp.y.toFixed(1)}px); }\n`;
    if (wp.id) {
      eatTimings[wp.id] = parseFloat(pct);
    }
  });
  snakeKeyframes += '}\n';

  let boxKeyframesCss = '';
  activeEntries.forEach(item => {
    const originalColor = colors[item.level];
    const arrivePct = eatTimings[item.id] || 50;
    const bitePct = (arrivePct + 0.3).toFixed(2);
    const eatenPct = (arrivePct + 1.2).toFixed(2);

    boxKeyframesCss += `
      @keyframes eat_${item.id} {
        0% { fill: ${originalColor}; }
        ${arrivePct}% { fill: ${originalColor}; }
        ${bitePct}% { fill: #38bdf8; filter: drop-shadow(0 0 6px #38bdf8); }
        ${eatenPct}% { fill: #161b22; filter: none; }
        96% { fill: #161b22; }
        100% { fill: ${originalColor}; }
      }
      .${item.id} {
        animation: eat_${item.id} ${totalAnimSec}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
    `;
  });

  let rectsSvg = '';
  for (let c = 0; c < totalWeeks; c++) {
    const x = startX + c * (cellWidth + cellGap);
    for (let r = 0; r < daysPerWeek; r++) {
      const y = startY + r * (cellHeight + cellGap);
      const activeItem = activeMap[`${c}_${r}`];
      if (activeItem) {
        rectsSvg += `    <rect class="${activeItem.id}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cellWidth}" height="${cellHeight}" rx="2" fill="${colors[activeItem.level]}"/>\n`;
      } else {
        rectsSvg += `    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cellWidth}" height="${cellHeight}" rx="2" fill="#161b22"/>\n`;
      }
    }
  }

  const months = [
    { name: 'Sep', col: 0 },
    { name: 'Oct', col: 4 },
    { name: 'Nov', col: 8 },
    { name: 'Dec', col: 13 },
    { name: 'Jan', col: 17 },
    { name: 'Feb', col: 21 },
    { name: 'Mar', col: 25 },
    { name: 'Apr', col: 30 },
    { name: 'May', col: 34 },
    { name: 'Jun', col: 38 },
    { name: 'Jul', col: 43 },
    { name: 'Aug', col: 47 },
    { name: 'Sep', col: 51 }
  ];

  let monthSvg = '';
  months.forEach(m => {
    const mx = startX + m.col * (cellWidth + cellGap);
    monthSvg += `  <text x="${mx}" y="${startY - 8}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10">${m.name}</text>\n`;
  });

  const svgContent = `<svg width="100%" height="205" viewBox="0 0 850 205" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .snake-head {
        animation: snakeMovement ${totalAnimSec}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .snake-body-1 {
        animation: snakeMovement ${totalAnimSec}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.15s;
      }
      .snake-body-2 {
        animation: snakeMovement ${totalAnimSec}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.30s;
      }
      .snake-body-3 {
        animation: snakeMovement ${totalAnimSec}s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.45s;
      }

      ${snakeKeyframes}
      ${boxKeyframesCss}
    </style>
  </defs>

  <!-- Container Box -->
  <rect x="1" y="1" width="848" height="203" rx="12" fill="#0d1117" stroke="#30363d" stroke-width="1.5"/>

  <!-- Top Status / Title Bar -->
  <rect x="1" y="1" width="848" height="34" rx="12" fill="#161b22"/>
  <line x1="1" y1="35" x2="849" y2="35" stroke="#30363d" stroke-width="1"/>
  
  <circle cx="20" cy="18" r="4" fill="#58a6ff"/>
  <text x="32" y="22" fill="#f0f6fc" font-family="'Fira Code', Consolas, monospace" font-size="12" font-weight="600">287 contributions in the last year</text>
  <text x="660" y="22" fill="#7ee787" font-family="'Fira Code', Consolas, monospace" font-size="11">&#x25CF; Live Eating Radar</text>

  <!-- Month Labels -->
${monthSvg}

  <!-- Weekday Labels on Left -->
  <text x="26" y="${startY + 1 * (cellHeight + cellGap) + 9}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9">Mon</text>
  <text x="26" y="${startY + 3 * (cellHeight + cellGap) + 9}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9">Wed</text>
  <text x="26" y="${startY + 5 * (cellHeight + cellGap) + 9}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9">Fri</text>

  <!-- 287-Contribution Grid with Eating Animation -->
  <g>
${rectsSvg}
  </g>

  <!-- Animated Cyber Snake Eating The Commits -->
  <g>
    <!-- Tail segments -->
    <rect class="snake-body-3" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#1d4ed8" opacity="0.6"/>
    <rect class="snake-body-2" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#3b82f6" opacity="0.8"/>
    <rect class="snake-body-1" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#60a5fa" opacity="0.95"/>
    <!-- Snake Head with Glow Pulse -->
    <rect class="snake-head" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)"/>
  </g>

  <!-- Footer with Info & Legend -->
  <text x="26" y="186" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10">Cyber snake clears contribution commits in real time</text>
  <g transform="translate(685, 178)">
    <text x="0" y="9" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10">Less</text>
    <rect x="28" y="0" width="10" height="10" rx="2" fill="#161b22"/>
    <rect x="42" y="0" width="10" height="10" rx="2" fill="#0e4429"/>
    <rect x="56" y="0" width="10" height="10" rx="2" fill="#006d32"/>
    <rect x="70" y="0" width="10" height="10" rx="2" fill="#26a641"/>
    <rect x="84" y="0" width="10" height="10" rx="2" fill="#39d353"/>
    <text x="98" y="9" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10">More</text>
  </g>
</svg>`;

  const outDir = path.resolve(__dirname, '../assets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'snake.svg');
  fs.writeFileSync(outPath, svgContent, 'utf-8');
  console.log(`Generated eating snake SVG to ${outPath}`);
}

generateEatingSnake();
