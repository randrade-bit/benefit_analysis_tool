export function fmtDollar(v) {
  if (v == null || isNaN(v)) return '$0';
  return '$' + Math.round(v).toLocaleString('en-US');
}

export function fmtPct(v) {
  if (v == null || isNaN(v)) return '0.0%';
  return v.toFixed(1) + '%';
}

export function fmtInt(v) {
  if (v == null || isNaN(v)) return '0';
  return Math.round(v).toLocaleString('en-US');
}

export function fmtNum(v) {
  if (v == null || isNaN(v)) return '0';
  return Number(v.toFixed(1)).toLocaleString('en-US');
}
