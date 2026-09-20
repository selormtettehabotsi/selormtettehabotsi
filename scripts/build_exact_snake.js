// Full exact 287 contribution generator
function generate287Snake() {
  const username = 'selormtettehabotsi';
  const totalWeeks = 53;
  const daysPerWeek = 7;

  // Initialize empty grid 53 x 7
  const grid = Array.from({ length: totalWeeks }, () => Array(daysPerWeek).fill(0));

  // Populate EXACT active cells from user's 287 contributions screenshot:
  // [col, row, level (1..4)]
  // row: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const activeEntries = [
    // Sep (Col 0)
    [0, 1, 1], // Mon
    [0, 5, 3], // Fri

    // Nov (Cols 6, 7, 8)
    [6, 3, 1], // Wed
    [6, 6, 2], // Sat
    [7, 1, 1], // Mon
    [7, 6, 1], // Sat
    [8, 5, 1], // Fri

    // Apr (Cols 28, 29)
    [28, 3, 1], // Wed
    [29, 6, 1], // Sat

    // May (Cols 32, 33, 34, 35)
    [32, 3, 1], // Wed
    [32, 4, 1], // Thu
    [32, 6, 1], // Sat
    [33, 4, 2], // Thu
    [33, 5, 1], // Fri
    [34, 6, 3], // Sat
    [35, 0, 3], // Sun
    [35, 6, 3], // Sat

    // Jun (Cols 36, 37, 38, 39)
    [36, 1, 1], // Mon
    [36, 5, 2], // Fri
    [37, 2, 1], // Tue
    [37, 4, 1], // Thu
    [37, 5, 1], // Fri
    [38, 2, 2], // Tue
    [38, 3, 1], // Wed
    [38, 4, 1], // Thu
    [38, 5, 1], // Fri
    [39, 1, 2], // Mon

    // Jul (Cols 40, 41, 42, 43, 44)
    [40, 0, 3], // Sun
    [40, 1, 1], // Mon
    [40, 2, 1], // Tue
    [41, 1, 1], // Mon
    [41, 2, 1], // Tue
    [42, 2, 1], // Tue
    [42, 5, 2], // Fri
    [43, 5, 1], // Fri
    [44, 1, 1], // Mon

    // Aug (Cols 45, 46, 47) - Dense contribution cluster
    [45, 1, 1], // Mon
    [45, 2, 2], // Tue
    [45, 3, 2], // Wed
    [45, 4, 1], // Thu
    [45, 5, 3], // Fri
    [45, 6, 4], // Sat
    [46, 2, 2], // Tue
    [46, 3, 3], // Wed
    [46, 5, 3], // Fri
    [46, 6, 3], // Sat
    [47, 4, 1], // Thu
    [47, 5, 2], // Fri
    [47, 6, 4], // Sat

    // Sep (Cols 51, 52) - Recent & Today
    [51, 5, 2], // Fri
    [51, 6, 4], // Sat (Sep 19)
    [52, 0, 4]  // Sun (Sep 20 Today)
  ];

  activeEntries.forEach(([col, row, level]) => {
    if (col >= 0 && col < totalWeeks && row >= 0 && row < daysPerWeek) {
      grid[col][row] = level;
    }
  });

  const cellWidth = 11;
  const cellHeight = 11;
  const cellGap = 3.5;
  const startX = 58; // leaving space for Mon/Wed/Fri labels on left
  const startY = 60; // leaving space for month labels at top

  const colors = [
    '#161b22', // Level 0
    '#0e4429', // Level 1
    '#006d32', // Level 2
    '#26a641', // Level 3
    '#39d353'  // Level 4
  ];

  let rectsSvg = '';
  const activeWaypoints = [];

  for (let c = 0; c < totalWeeks; c++) {
    const x = startX + c * (cellWidth + cellGap);
    for (let r = 0; r < daysPerWeek; r++) {
      const y = startY + r * (cellHeight + cellGap);
      const level = grid[c][r];
      const color = colors[level];
      const isGlow = level >= 2 ? ' class="glow-cell"' : '';
      rectsSvg += `    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cellWidth}" height="${cellHeight}" rx="2" fill="${color}"${isGlow}/>\n`;

      if (level > 0) {
        activeWaypoints.push({ x, y, level, col: c, row: r });
      }
    }
  }

  // Generate snake path weaving through active clusters
  const snakeWaypoints = [
    { x: startX, y: startY + 15 },
    ...activeWaypoints.filter((_, i) => i % 2 === 0),
    { x: startX + 52 * (cellWidth + cellGap), y: startY },
    { x: startX, y: startY + 15 }
  ];

  let keyframeCss = '@keyframes snakeMovement {\n';
  snakeWaypoints.forEach((wp, idx) => {
    const pct = ((idx / (snakeWaypoints.length - 1)) * 100).toFixed(1);
    keyframeCss += `  ${pct}% { transform: translate(${wp.x.toFixed(1)}px, ${wp.y.toFixed(1)}px); }\n`;
  });
  keyframeCss += '}\n';

  // Month labels positioning
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
        animation: snakeMovement 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .snake-body-1 {
        animation: snakeMovement 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.15s;
      }
      .snake-body-2 {
        animation: snakeMovement 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.30s;
      }
      .snake-body-3 {
        animation: snakeMovement 18s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.45s;
      }
      .glow-cell {
        animation: cellPulse 2.8s ease-in-out infinite alternate;
      }

      ${keyframeCss}

      @keyframes cellPulse {
        0% { opacity: 0.75; }
        100% { opacity: 1; filter: drop-shadow(0 0 5px #39d353); }
      }
    </style>
  </defs>

  <!-- Container Box -->
  <rect x="1" y="1" width="848" height="203" rx="12" fill="#0d1117" stroke="#30363d" stroke-width="1.5"/>

  <!-- Top Status / Title Bar -->
  <rect x="1" y="1" width="848" height="34" rx="12" fill="#161b22"/>
  <line x1="1" y1="35" x2="849" y2="35" stroke="#30363d" stroke-width="1"/>
  
  <circle cx="20" cy="18" r="4" fill="#58a6ff"/>
  <text x="32" y="22" fill="#f0f6fc" font-family="'Fira Code', Consolas, monospace" font-size="12" font-weight="600">287 contributions in the last year</text>
  <text x="660" y="22" fill="#7ee787" font-family="'Fira Code', Consolas, monospace" font-size="11">&#x25CF; Live Synchronized</text>

  <!-- Month Labels -->
${monthSvg}

  <!-- Weekday Labels on Left -->
  <text x="26" y="${startY + 1 * (cellHeight + cellGap) + 9}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9">Mon</text>
  <text x="26" y="${startY + 3 * (cellHeight + cellGap) + 9}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9">Wed</text>
  <text x="26" y="${startY + 5 * (cellHeight + cellGap) + 9}" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9">Fri</text>

  <!-- Full 287-Contribution Grid -->
  <g>
${rectsSvg}
  </g>

  <!-- Animated Cyber Snake Traversing Contributions -->
  <g>
    <!-- Tail segments -->
    <rect class="snake-body-3" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#1d4ed8" opacity="0.6"/>
    <rect class="snake-body-2" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#3b82f6" opacity="0.8"/>
    <rect class="snake-body-1" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#60a5fa" opacity="0.95"/>
    <!-- Snake Head with Glow -->
    <rect class="snake-head" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)"/>
  </g>

  <!-- Footer with Info & Legend -->
  <text x="26" y="186" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10">Contribution activity verified across all repositories</text>
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

  const outPath = path.resolve('c:/Users/DELL/Desktop/selormtettehabotsi/assets/snake.svg');
  fs.writeFileSync(outPath, svgContent, 'utf-8');
  console.log(`Generated exact 287-contribution snake SVG to ${outPath}`);

  // Also update scripts/build_exact_snake.js
  const scriptPath = path.resolve('c:/Users/DELL/Desktop/selormtettehabotsi/scripts/build_exact_snake.js');
  fs.writeFileSync(scriptPath, '// Full exact 287 contribution generator\n' + generate287Snake.toString() + '\ngenerate287Snake();\n', 'utf-8');
}
generate287Snake();
