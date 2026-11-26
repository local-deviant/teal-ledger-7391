// Number formatting for NusaStat: Indonesian conventions (comma decimal,
// dot thousands) so the figures read the way Indonesians write them.

export function fmtNumber(value, decimals = 0) {
  return value.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtPercent(value, decimals = 2) {
  return `${fmtNumber(value, decimals)}%`;
}

export function fmtUsd(value, decimals = 0) {
  return `US$${fmtNumber(value, decimals)}`;
}

// Format one indicator value the way its own page shows it.
export function fmtIndicatorValue(indicator, value) {
  if (indicator.format === '%') return fmtPercent(value, indicator.decimals);
  if (indicator.format === 'usd') return fmtUsd(value, indicator.decimals);
  if (indicator.format === 'bn') return `US$${fmtNumber(value, indicator.decimals)} mld`;
  if (indicator.format === 'jt') return `${fmtNumber(value, indicator.decimals)} jt`;
  return fmtNumber(value, indicator.decimals);
}

export function fmtYearRange(startYear, endYear) {
  return startYear === endYear ? String(startYear) : `${startYear}–${endYear}`;
}
