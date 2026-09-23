const { syncAllMetrics } = require('./sync_all_metrics');

if (require.main === module) {
  syncAllMetrics().catch(err => {
    console.error('[Sync] Error during execution:', err);
    process.exit(1);
  });
}

module.exports = { generateEatingSnake: syncAllMetrics, syncAllMetrics };
