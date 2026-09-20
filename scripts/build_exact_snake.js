const fs = require('fs');
const path = require('path');

async function buildExactSnake() {
  const username = process.env.GITHUB_REPOSITORY_OWNER || 'selormtettehabotsi';
  console.log(`Fetching live GitHub contributions for user: ${username}`);
  
  const res = await fetch(`https://github.com/users/${username}/contributions`);
  const html = await res.text();

  // Extract all data-date and data-level pairs
  const tdRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*>/g;
  let match;
  const contributionsByDate = {};
  while ((match = tdRegex.exec(html)) !== null) {
    contributionsByDate[match[1]] = parseInt(match[2], 10);
  }

  const sortedDates = Object.keys(contributionsByDate).sort();
  if (sortedDates.length === 0) {
    console.error('No contribution dates found in response');
    process.exit(1);
  }

  const startDateStr = sortedDates[0];
  const endDateStr = sortedDates[sortedDates.length - 1];

  console.log(`Building calendar from ${startDateStr} to ${endDateStr}`);

  const startDate = new Date(startDateStr + 'T00:00:00Z');
  const startDayOfWeek = startDate.getUTCDay(); // 0 = Sunday

  const cellWidth = 11;
  const cellHeight = 11;
  const cellGap = 3.5;
  const startX = 35;
  const startY = 48;

  const colors = [
    '#161b22', // Level 0 (Empty)
    '#0e4429', // Level 1
    '#006d32', // Level 2
    '#26a641', // Level 3
    '#39d353'  // Level 4
  ];

  let rectsSvg = '';
  const activeCells = [];

  const currentDate = new Date(startDate);
  const endDate = new Date(endDateStr + 'T00:00:00Z');

  let dayIndex = 0;
  while (currentDate <= endDate) {
    const yyyy = currentDate.getUTCFullYear();
    const mm = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(currentDate.getUTCDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const totalDaysOffset = dayIndex + startDayOfWeek;
    const col = Math.floor(totalDaysOffset / 7);
    const row = totalDaysOffset % 7;

    const level = contributionsByDate[dateStr] || 0;
    const color = colors[level];

    const x = startX + col * (cellWidth + cellGap);
    const y = startY + row * (cellHeight + cellGap);

    const isGlow = level >= 2 ? ' class="glow-cell"' : '';
    rectsSvg += `    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cellWidth}" height="${cellHeight}" rx="2" fill="${color}"${isGlow} data-date="${dateStr}" data-level="${level}"/>\n`;

    if (level > 0) {
      activeCells.push({ col, row, x, y, level, date: dateStr });
    }

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    dayIndex++;
  }

  activeCells.sort((a, b) => a.col - b.col || a.row - b.row);

  const waypoints = [
    { x: startX + 5, y: startY + 20 }
  ];

  activeCells.forEach(ac => {
    waypoints.push({ x: ac.x, y: ac.y });
  });

  const lastActive = activeCells[activeCells.length - 1] || { x: startX + 750, y: startY + 40 };
  waypoints.push({ x: lastActive.x + 15, y: lastActive.y });
  waypoints.push({ x: startX + 5, y: startY + 20 });

  let keyframeCss = '@keyframes snakeMovement {\n';
  waypoints.forEach((wp, idx) => {
    const pct = ((idx / (waypoints.length - 1)) * 100).toFixed(1);
    keyframeCss += `  ${pct}% { transform: translate(${wp.x.toFixed(1)}px, ${wp.y.toFixed(1)}px); }\n`;
  });
  keyframeCss += '}\n';

  const svgContent = `<svg width="100%" height="185" viewBox="0 0 850 185" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .snake-head {
        animation: snakeMovement 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
      .snake-body-1 {
        animation: snakeMovement 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.15s;
      }
      .snake-body-2 {
        animation: snakeMovement 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        animation-delay: -0.30s;
      }
      .snake-body-3 {
        animation: snakeMovement 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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
  <rect x="1" y="1" width="848" height="183" rx="12" fill="#0d1117" stroke="#30363d" stroke-width="1.5"/>

  <!-- Top Status / Title Bar -->
  <rect x="1" y="1" width="848" height="34" rx="12" fill="#161b22"/>
  <line x1="1" y1="35" x2="849" y2="35" stroke="#30363d" stroke-width="1"/>
  
  <circle cx="20" cy="18" r="4" fill="#58a6ff"/>
  <text x="32" y="22" fill="#8b949e" font-family="'Fira Code', Consolas, monospace" font-size="11">CONTRIBUTION GRAPH // @${username} (EXACT REAL GITHUB DATA)</text>
  <text x="640" y="22" fill="#7ee787" font-family="'Fira Code', Consolas, monospace" font-size="11">&#x25CF; Live Synchronized</text>

  <!-- Real GitHub Contribution Grid with Exact Dates and Levels -->
  <g>
${rectsSvg}
  </g>

  <!-- Animated Cyber Snake Traversing Real Contribution Nodes -->
  <g>
    <!-- Tail segments -->
    <rect class="snake-body-3" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#1d4ed8" opacity="0.6"/>
    <rect class="snake-body-2" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#3b82f6" opacity="0.8"/>
    <rect class="snake-body-1" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#60a5fa" opacity="0.95"/>
    <!-- Snake Head -->
    <rect class="snake-head" x="0" y="0" width="${cellWidth}" height="${cellHeight}" rx="3" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)"/>
  </g>

  <!-- Legend in footer -->
  <g transform="translate(620, 160)">
    <text x="0" y="9" fill="#8b949e" font-family="'Fira Code', monospace" font-size="10">Less</text>
    <rect x="30" y="0" width="10" height="10" rx="2" fill="#161b22"/>
    <rect x="44" y="0" width="10" height="10" rx="2" fill="#0e4429"/>
    <rect x="58" y="0" width="10" height="10" rx="2" fill="#006d32"/>
    <rect x="72" y="0" width="10" height="10" rx="2" fill="#26a641"/>
    <rect x="86" y="0" width="10" height="10" rx="2" fill="#39d353"/>
    <text x="102" y="9" fill="#8b949e" font-family="'Fira Code', monospace" font-size="10">More</text>
  </g>
</svg>`;

  const outDir = path.resolve(__dirname, '../assets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'snake.svg');
  fs.writeFileSync(outPath, svgContent, 'utf-8');
  console.log(`Wrote exact real-data snake SVG to ${outPath}`);
}

buildExactSnake().catch(err => {
  console.error(err);
  process.exit(1);
});
