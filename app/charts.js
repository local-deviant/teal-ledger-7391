// Hand-drawn canvas charts for NusaStat: line, bar and donut.
// No library, no network — just the canvas API. Every chart draws axes,
// labels and values, and shows a tooltip that follows the mouse.

const INK = '#1d3557';
const GRID = '#d9dee6';
const MUTED = '#5b6b7f';
const TEAL = '#0e7c6b';
const TEAL_SOFT = '#bfe3dc';
const AMBER = '#d98e04';
const RED = '#b3402e';
const SLATE = '#8fa3b8';

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width, height };
}

function niceMax(rawMax, rawMin) {
  const span = rawMax - rawMin || 1;
  const step = Math.pow(10, Math.floor(Math.log10(span)));
  const top = Math.ceil(rawMax / step) * step;
  const bottom = Math.floor(rawMin / step) * step;
  return { top, bottom: top === bottom ? bottom - step : bottom };
}

function drawAxes(ctx, box, labels, top, bottom) {
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.strokeStyle = GRID;
  ctx.lineWidth = 1;
  const ticks = 4;
  for (let i = 0; i <= ticks; i += 1) {
    const value = bottom + ((top - bottom) * i) / ticks;
    const y = box.y + box.h - (box.h * i) / ticks;
    ctx.beginPath();
    ctx.moveTo(box.x, y);
    ctx.lineTo(box.x + box.w, y);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.fillText(String(Math.round(value * 100) / 100), box.x - 6, y + 4);
  }
  ctx.textAlign = 'center';
  labels.forEach((label, i) => {
    const x = box.x + (box.w * (i + 0.5)) / labels.length;
    ctx.fillText(label, x, box.y + box.h + 16);
  });
}

function attachTooltip(canvas, points, formatPoint) {
  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.hidden = true;
  canvas.parentElement.style.position = 'relative';
  canvas.parentElement.appendChild(tip);
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    let best = null;
    let bestDist = Infinity;
    points.forEach((point) => {
      const dist = Math.hypot(point.x - x, point.y - y);
      if (dist < bestDist) {
        bestDist = dist;
        best = point;
      }
    });
    if (best && bestDist < 48) {
      tip.hidden = false;
      tip.textContent = formatPoint(best);
      tip.style.left = `${Math.min(Math.max(best.x + 10, 4), rect.width - 150)}px`;
      tip.style.top = `${Math.max(best.y - 14, 4)}px`;
    } else {
      tip.hidden = true;
    }
  });
  canvas.addEventListener('mouseleave', () => {
    tip.hidden = true;
  });
}

export function drawLineChart(canvas, labels, values, formatValue) {
  const { ctx, width, height } = setupCanvas(canvas);
  const box = { x: 48, y: 12, w: width - 60, h: height - 44 };
  const { top, bottom } = niceMax(Math.max(...values), Math.min(...values));
  drawAxes(ctx, box, labels, top, bottom);
  const px = (i) => box.x + (box.w * (i + 0.5)) / values.length;
  const py = (v) => box.y + box.h - ((v - bottom) / (top - bottom)) * box.h;
  ctx.strokeStyle = TEAL;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  values.forEach((value, i) => {
    if (i === 0) ctx.moveTo(px(i), py(value));
    else ctx.lineTo(px(i), py(value));
  });
  ctx.stroke();
  const points = [];
  values.forEach((value, i) => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px(i), py(value), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    points.push({ x: px(i), y: py(value), label: labels[i], value });
  });
  attachTooltip(canvas, points, (p) => `${p.label}: ${formatValue(p.value)}`);
}

export function drawBarChart(canvas, labels, values, formatValue) {
  const { ctx, width, height } = setupCanvas(canvas);
  const box = { x: 48, y: 12, w: width - 60, h: height - 44 };
  const top = Math.max(...values) * 1.08;
  const bottom = Math.min(0, Math.min(...values) * 1.08);
  drawAxes(ctx, box, labels, top, bottom);
  const slot = box.w / values.length;
  const zeroY = box.y + box.h - ((0 - bottom) / (top - bottom)) * box.h;
  const points = [];
  values.forEach((value, i) => {
    const barW = Math.min(46, slot * 0.62);
    const x = box.x + slot * i + (slot - barW) / 2;
    const y = box.y + box.h - ((value - bottom) / (top - bottom)) * box.h;
    ctx.fillStyle = value < 0 ? RED : TEAL;
    const barTop = Math.min(y, zeroY);
    const barH = Math.abs(zeroY - y);
    ctx.fillRect(x, barTop, barW, Math.max(barH, 1));
    ctx.fillStyle = INK;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatValue(value), x + barW / 2, barTop - 5);
    points.push({ x: x + barW / 2, y: barTop, label: labels[i], value });
  });
  attachTooltip(canvas, points, (p) => `${p.label}: ${formatValue(p.value)}`);
}

export function drawDonutChart(canvas, segments, formatShare) {
  const { ctx, width, height } = setupCanvas(canvas);
  const cx = width / 2;
  const cy = height / 2;
  const outer = Math.min(width, height) / 2 - 10;
  const inner = outer * 0.58;
  const colours = [TEAL, AMBER, SLATE, '#457b9d', '#e07a5f', '#81b29a'];
  let angle = -Math.PI / 2;
  const legend = [];
  segments.forEach((segment, i) => {
    const sweep = (segment.share / 100) * Math.PI * 2;
    ctx.fillStyle = colours[i % colours.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fill();
    legend.push({ colour: colours[i % colours.length], label: segment.label, share: segment.share });
    angle += sweep;
  });
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(segments[0].centre || '', cx, cy - 2);
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(segments[0].centreSub || '', cx, cy + 15);
  // Legend below the ring.
  const legendBox = document.createElement('div');
  legendBox.className = 'donut-legend';
  legend.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'donut-legend-row';
    const swatch = document.createElement('span');
    swatch.className = 'donut-swatch';
    swatch.style.background = item.colour;
    const text = document.createElement('span');
    text.textContent = `${item.label} — ${formatShare(item.share)}`;
    row.append(swatch, text);
    legendBox.appendChild(row);
  });
  canvas.parentElement.appendChild(legendBox);
}

export function drawHorizontalBars(container, rows, formatValue) {
  container.innerHTML = '';
  const max = Math.max(...rows.map((row) => row.value));
  rows.forEach((row) => {
    const line = document.createElement('div');
    line.className = 'hbar-row';
    const label = document.createElement('span');
    label.className = 'hbar-label';
    label.textContent = row.label;
    const track = document.createElement('span');
    track.className = 'hbar-track';
    const fill = document.createElement('span');
    fill.className = 'hbar-fill';
    fill.style.width = `${(row.value / max) * 100}%`;
    track.appendChild(fill);
    const value = document.createElement('span');
    value.className = 'hbar-value';
    value.textContent = formatValue(row.value);
    line.append(label, track, value);
    container.appendChild(line);
  });
}
