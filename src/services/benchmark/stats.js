export function calculateStats(latencies) {
  if (!latencies.length) {
    return { min: 0, max: 0, mean: 0, median: 0, p95: 0, p99: 0, stdDev: 0 };
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const n = sorted.length;

  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const variance = sorted.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);

  const percentile = (p) => {
    const idx = Math.ceil((p / 100) * n) - 1;
    return sorted[Math.max(0, idx)];
  };

  return {
    min: sorted[0],
    max: sorted[n - 1],
    mean: Math.round(mean * 100) / 100,
    median: percentile(50),
    p95: percentile(95),
    p99: percentile(99),
    stdDev: Math.round(stdDev * 100) / 100,
    count: n,
  };
}

export function calculateSuccessRate(results) {
  if (!results.length) return 0;
  const successes = results.filter(r => r.success).length;
  return Math.round((successes / results.length) * 10000) / 100;
}

export function formatLatency(ms) {
  if (typeof ms !== 'number' || isNaN(ms)) return '-';
  if (ms < 1) return '<1ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatThroughput(rps) {
  if (typeof rps !== 'number') return '-';
  return `${rps.toFixed(1)} req/s`;
}
