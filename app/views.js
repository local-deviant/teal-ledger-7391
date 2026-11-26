// Page renderers for NusaStat. One function per page; each returns HTML and
// wires up its own controls after it is placed in the document.

import {
  AGE_STRUCTURE_2024,
  GDP_SECTORS_2024,
  HEADLINE_KPIS_2024,
  INDICATORS,
  INFLATION_MONTHLY_2024,
  LABOUR_SNAPSHOT_2024,
  LATEST_RELEASES,
  POVERTY_CONTEXT_2024,
  TOP_PROVINCES_2024,
  ABOUT_TEXT,
  YEARS,
  indicatorById,
} from './data.js';
import { fmtIndicatorValue, fmtNumber, fmtPercent, fmtUsd, fmtYearRange } from './format.js';
import { drawBarChart, drawDonutChart, drawHorizontalBars, drawLineChart } from './charts.js';

function sourceLine(text) {
  return `<p class="source">Source: ${text}</p>`;
}

function kpiCards() {
  return `<section class="kpi-grid" aria-label="Headline figures, 2024">
    ${HEADLINE_KPIS_2024.map(
      (kpi) => `<a class="kpi-card" href="#/indicator/${kpi.indicator}">
        <span class="kpi-label">${kpi.label}</span>
        <span class="kpi-value">${kpi.value}</span>
        <span class="kpi-sub">${kpi.sub}</span>
      </a>`,
    ).join('')}
  </section>`;
}

function topicCards() {
  const topics = [
    { href: '#/population', title: 'Population', text: '283.5 million people, age structure and the largest provinces.' },
    { href: '#/economy', title: 'Economy', text: 'GDP growth, GDP per capita, sectors and foreign trade.' },
    { href: '#/prices', title: 'Prices', text: 'Monthly and annual inflation, and what it means for households.' },
    { href: '#/labour', title: 'Labour', text: 'Unemployment, participation and who is working.' },
    { href: '#/social', title: 'Society', text: 'Poverty, extreme poverty and human development.' },
    { href: '#/explore', title: 'Data explorer', text: 'Every indicator as a table for any year range, with CSV download.' },
  ];
  return `<section class="topic-grid" aria-label="Topics">
    ${topics.map(
      (topic) => `<a class="topic-card" href="${topic.href}">
        <span class="topic-title">${topic.title}</span>
        <span class="topic-text">${topic.text}</span>
      </a>`,
    ).join('')}
  </section>`;
}

function rangePicker(idPrefix, startYear, endYear) {
  const options = (selected) =>
    YEARS.map((year) => `<option value="${year}"${year === selected ? ' selected' : ''}>${year}</option>`).join('');
  return `<div class="range-picker">
    <label>From <select id="${idPrefix}-start" aria-label="Start year">${options(startYear)}</select></label>
    <label>to <select id="${idPrefix}-end" aria-label="End year">${options(endYear)}</select></label>
  </div>`;
}

function sliceYears(indicator, startYear, endYear) {
  const start = YEARS.indexOf(startYear);
  const end = YEARS.indexOf(endYear);
  const lo = Math.min(start, end);
  const hi = Math.max(start, end);
  return {
    labels: YEARS.slice(lo, hi + 1).map(String),
    values: indicator.values.slice(lo, hi + 1),
    startYear: YEARS[lo],
    endYear: YEARS[hi],
  };
}

export function renderOverview(root) {
  const growth = indicatorById('gdp-growth');
  root.innerHTML = `
    <h1>Indonesia in numbers</h1>
    <p class="lede">The headline official statistics for Indonesia — population, the economy,
    prices, work and living standards — each figure with its source and year.</p>
    ${kpiCards()}
    <section class="panel">
      <h2 id="growth-title">Real GDP growth, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="growth-chart" height="260" aria-label="Line chart of real GDP growth 2015 to 2024"></canvas></div>
      ${sourceLine(growth.source)}
      <p>Growth stayed near 5% a year before the pandemic, fell 2.07% in 2020, then recovered:
      5.31% in 2022 and 5.03% in 2024. Household consumption is the largest driver; investment
      and exports supply the rest.</p>
    </section>
    <section class="panel">
      <h2>Who Indonesians are, 2024</h2>
      <div class="chart-wrap donut-wrap"><canvas class="chart" id="age-chart" height="220" aria-label="Donut chart of age structure 2024"></canvas></div>
      ${sourceLine('BPS, Statistics Indonesia; UN World Population Prospects 2024')}
      <p>More than two in three Indonesians are of working age (15–64). The median age is about 30,
      and the share aged 65 and over is still small — Indonesia is young, but ageing.</p>
    </section>
    <section class="panel">
      <h2>Latest releases</h2>
      <ul class="releases">
        ${LATEST_RELEASES.map((item) => `<li><strong>${item.date}:</strong> ${item.text}</li>`).join('')}
      </ul>
    </section>
    ${topicCards()}`;
  drawLineChart(
    root.querySelector('#growth-chart'),
    YEARS.map(String),
    growth.values,
    (value) => fmtPercent(value, 2),
  );
  drawDonutChart(
    root.querySelector('#age-chart'),
    AGE_STRUCTURE_2024.map((row, i) => ({
      label: row.group,
      share: row.share,
      centre: i === 0 ? '68,9%' : undefined,
      centreSub: i === 0 ? 'working age' : undefined,
    })),
    (share) => `${fmtNumber(share, 1)}%`,
  );
}

function provinceTableRows(sortKey, ascending) {
  const rows = TOP_PROVINCES_2024.map((row, i) => ({ ...row, rank: i + 1 }));
  rows.sort((a, b) => {
    if (sortKey === 'province') return ascending ? a.province.localeCompare(b.province) : b.province.localeCompare(a.province);
    return ascending ? a.population - b.population : b.population - a.population;
  });
  return rows
    .map(
      (row) => `<tr><td>${row.rank}</td><td>${row.province}</td><td>${fmtNumber(row.population, 1)} jt</td></tr>`,
    )
    .join('');
}

export function renderPopulation(root) {
  const population = indicatorById('population');
  let startYear = 2015;
  let endYear = 2024;
  let sortKey = 'population';
  let ascending = false;
  root.innerHTML = `
    <h1>Population</h1>
    <p class="lede">283.5 million people in 2024 — the world’s fourth-largest population — spread
    across 38 provinces, with Java home to more than half of them.</p>
    <section class="panel">
      <h2 id="pop-title">Population, 2015–2024</h2>
      ${rangePicker('pop', startYear, endYear)}
      <div class="chart-wrap"><canvas class="chart" id="pop-chart" height="260" aria-label="Line chart of population"></canvas></div>
      ${sourceLine(population.source)}
      <p>${population.note}</p>
    </section>
    <section class="panel">
      <h2>Age structure, 2024</h2>
      <div class="chart-wrap donut-wrap"><canvas class="chart" id="pop-age-chart" height="220" aria-label="Donut chart of age structure 2024"></canvas></div>
      ${sourceLine('BPS, Statistics Indonesia; UN World Population Prospects 2024')}
    </section>
    <section class="panel">
      <h2>Largest provinces, 2024</h2>
      <p>Click a column heading to sort. Jawa Barat alone holds about 50 million people —
      more than Spain or South Korea.</p>
      <table class="data-table" id="province-table">
        <thead><tr>
          <th>#</th>
          <th><button class="sort-btn" data-sort="province">Province</button></th>
          <th><button class="sort-btn" data-sort="population">Population ↓</button></th>
        </tr></thead>
        <tbody>${provinceTableRows(sortKey, ascending)}</tbody>
      </table>
      ${sourceLine('BPS, Statistics Indonesia (mid-year estimates, 2024)')}
    </section>`;
  const redraw = () => {
    const slice = sliceYears(population, startYear, endYear);
    root.querySelector('#pop-title').textContent = `Population, ${fmtYearRange(slice.startYear, slice.endYear)}`;
    drawLineChart(root.querySelector('#pop-chart'), slice.labels, slice.values, (v) => `${fmtNumber(v, 1)} jt`);
  };
  redraw();
  drawDonutChart(
    root.querySelector('#pop-age-chart'),
    AGE_STRUCTURE_2024.map((row, i) => ({
      label: row.group,
      share: row.share,
      centre: i === 0 ? '283,5 jt' : undefined,
      centreSub: i === 0 ? 'people, 2024' : undefined,
    })),
    (share) => `${fmtNumber(share, 1)}%`,
  );
  root.querySelector('#pop-start').addEventListener('change', (event) => {
    startYear = Number(event.target.value);
    redraw();
  });
  root.querySelector('#pop-end').addEventListener('change', (event) => {
    endYear = Number(event.target.value);
    redraw();
  });
  root.querySelectorAll('.sort-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.sort;
      if (sortKey === key) ascending = !ascending;
      else {
        sortKey = key;
        ascending = key === 'province';
      }
      root.querySelector('#province-table tbody').innerHTML = provinceTableRows(sortKey, ascending);
      root.querySelectorAll('.sort-btn').forEach((other) => {
        other.textContent = other.dataset.sort === 'province' ? 'Province' : 'Population';
      });
      button.textContent = `${key === 'province' ? 'Province' : 'Population'} ${ascending ? '↑' : '↓'}`;
    });
  });
}

export function renderEconomy(root) {
  const growth = indicatorById('gdp-growth');
  const perCapita = indicatorById('gdp-per-capita');
  let startYear = 2015;
  let endYear = 2024;
  root.innerHTML = `
    <h1>Economy</h1>
    <p class="lede">Indonesia is Southeast Asia’s largest economy. Growth held near 5% a year,
    GDP per capita reached US$4,958 in 2024, and trade ran a US$31.0 billion surplus.</p>
    <section class="panel">
      <h2 id="econ-title">Real GDP growth, 2015–2024</h2>
      ${rangePicker('econ', startYear, endYear)}
      <div class="chart-wrap"><canvas class="chart" id="econ-chart" height="260" aria-label="Bar chart of real GDP growth"></canvas></div>
      ${sourceLine(growth.source)}
      <p>The 2020 bar is the pandemic contraction (−2.07%). Every other year in the decade grew
      between 3.70% and 5.31%.</p>
    </section>
    <section class="panel">
      <h2>GDP per capita, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="capita-chart" height="260" aria-label="Line chart of GDP per capita"></canvas></div>
      ${sourceLine(perCapita.source)}
      <p>GDP per person rose from US$3,368 in 2015 to US$4,958 in 2024 — up 47% in nine years,
      despite the 2020 dip.</p>
    </section>
    <section class="panel">
      <h2>What the economy makes, 2024</h2>
      <div id="sector-bars"></div>
      ${sourceLine('BPS, Statistics Indonesia (national accounts, current prices)')}
      <p>Manufacturing is the largest sector at 18.9% of GDP, ahead of trade (12.9%) and
      agriculture (12.5%).</p>
    </section>
    <section class="panel">
      <h2>Foreign trade, 2024</h2>
      <dl class="facts">
        <div><dt>Exports</dt><dd>US$264,7 mld</dd></div>
        <div><dt>Imports</dt><dd>US$233,7 mld</dd></div>
        <div><dt>Trade balance</dt><dd>US$31,0 mld surplus</dd></div>
      </dl>
      ${sourceLine('BPS, Statistics Indonesia (foreign trade statistics, 2024)')}
    </section>`;
  const redraw = () => {
    const slice = sliceYears(growth, startYear, endYear);
    root.querySelector('#econ-title').textContent = `Real GDP growth, ${fmtYearRange(slice.startYear, slice.endYear)}`;
    drawBarChart(root.querySelector('#econ-chart'), slice.labels, slice.values, (v) => fmtPercent(v, 2));
  };
  redraw();
  drawLineChart(
    root.querySelector('#capita-chart'),
    YEARS.map(String),
    perCapita.values,
    (value) => fmtUsd(value, 0),
  );
  drawHorizontalBars(
    root.querySelector('#sector-bars'),
    GDP_SECTORS_2024.map((row) => ({ label: row.sector, value: row.share })),
    (value) => `${fmtNumber(value, 1)}%`,
  );
  root.querySelector('#econ-start').addEventListener('change', (event) => {
    startYear = Number(event.target.value);
    redraw();
  });
  root.querySelector('#econ-end').addEventListener('change', (event) => {
    endYear = Number(event.target.value);
    redraw();
  });
}

export function renderPrices(root) {
  const inflation = indicatorById('inflation');
  root.innerHTML = `
    <h1>Prices</h1>
    <p class="lede">Inflation — how fast consumer prices rise — averaged 1.57% in 2024, the lowest
    in a decade. The monthly path shows the year cooling from 2.57% in January to 1.57% in December.</p>
    <section class="panel">
      <h2>Inflation by month, 2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="monthly-chart" height="260" aria-label="Line chart of monthly inflation 2024"></canvas></div>
      ${sourceLine('BPS, Statistics Indonesia (Consumer Price Index, year-on-year)')}
    </section>
    <section class="panel">
      <h2>Annual inflation, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="annual-chart" height="260" aria-label="Bar chart of annual inflation"></canvas></div>
      ${sourceLine(inflation.source)}
      <p>The 2022 spike to 5.51% followed the subsidised-fuel price rise. By 2024 inflation was
      back inside Bank Indonesia’s 1.5–3.5% target range.</p>
    </section>
    <section class="panel">
      <h2>What 1.57% means</h2>
      <ul class="plain-list">
        <li><strong>For households:</strong> a basket costing Rp100.000 at the start of 2024 cost about Rp101.570 at the end of it.</li>
        <li><strong>For savers:</strong> money kept its value far better than in 2022, when the same basket rose 5.51%.</li>
        <li><strong>For policy:</strong> low, stable inflation gives Bank Indonesia room to cut interest rates and support growth.</li>
      </ul>
    </section>`;
  drawLineChart(
    root.querySelector('#monthly-chart'),
    INFLATION_MONTHLY_2024.map((row) => row.month),
    INFLATION_MONTHLY_2024.map((row) => row.value),
    (value) => fmtPercent(value, 2),
  );
  drawBarChart(
    root.querySelector('#annual-chart'),
    YEARS.map(String),
    inflation.values,
    (value) => fmtPercent(value, 2),
  );
}

export function renderLabour(root) {
  const unemployment = indicatorById('unemployment');
  const lfpr = indicatorById('lfpr');
  root.innerHTML = `
    <h1>Labour</h1>
    <p class="lede">In August 2024, 144.85 million Indonesians were in work and open unemployment
    stood at 4.91% — the lowest in a decade. Participation keeps rising as more women enter the workforce.</p>
    <section class="panel">
      <h2>Unemployment &amp; participation, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="unemp-chart" height="260" aria-label="Line chart of unemployment rate"></canvas></div>
      ${sourceLine(unemployment.source)}
      <div class="chart-wrap"><canvas class="chart" id="lfpr-chart" height="220" aria-label="Line chart of labour force participation"></canvas></div>
      ${sourceLine(lfpr.source)}
      <p>Unemployment jumped to 7.07% in the pandemic year 2020, then fell every year after.
      Participation rose from 65.76% to 70.63% over the same decade.</p>
    </section>
    <section class="panel">
      <h2>The labour market in 2024</h2>
      <dl class="facts">
        <div><dt>People in work</dt><dd>${fmtNumber(LABOUR_SNAPSHOT_2024.working, 2)} jt</dd></div>
        <div><dt>Informal workers</dt><dd>${fmtNumber(LABOUR_SNAPSHOT_2024.informalShare, 1)}% of workers</dd></div>
        <div><dt>Youth unemployment (15–24)</dt><dd>${fmtNumber(LABOUR_SNAPSHOT_2024.youthUnemployment, 1)}%</dd></div>
      </dl>
      ${sourceLine(LABOUR_SNAPSHOT_2024.source)}
      <p>About six in ten workers are informal — own-account workers, casual workers and unpaid
      family workers — mostly in agriculture, trade and services. Young people face the hardest
      job search: roughly one in eight of the 15–24 labour force is unemployed.</p>
    </section>`;
  drawLineChart(
    root.querySelector('#unemp-chart'),
    YEARS.map(String),
    unemployment.values,
    (value) => fmtPercent(value, 2),
  );
  drawLineChart(
    root.querySelector('#lfpr-chart'),
    YEARS.map(String),
    lfpr.values,
    (value) => fmtPercent(value, 2),
  );
}

export function renderSocial(root) {
  const poverty = indicatorById('poverty');
  const hdi = indicatorById('hdi');
  root.innerHTML = `
    <h1>Society</h1>
    <p class="lede">Poverty fell from 11.13% in 2015 to 8.57% in 2024, and the Human Development
    Index rose from 69.55 to 75.02. The gains are real — and uneven between city and countryside.</p>
    <section class="panel">
      <h2>Poverty rate, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="poverty-chart" height="260" aria-label="Line chart of poverty rate"></canvas></div>
      ${sourceLine(poverty.source)}
      <p>${poverty.note}</p>
    </section>
    <section class="panel">
      <h2>Human Development Index, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="hdi-chart" height="260" aria-label="Line chart of Human Development Index"></canvas></div>
      ${sourceLine(hdi.source)}
      <p>${hdi.note}</p>
    </section>
    <section class="panel">
      <h2>Poverty in context, 2024</h2>
      <dl class="facts">
        <div><dt>People in poverty</dt><dd>${fmtNumber(POVERTY_CONTEXT_2024.peoplePoor, 2)} jt</dd></div>
        <div><dt>Extreme poverty</dt><dd>${fmtNumber(POVERTY_CONTEXT_2024.extremePoverty, 2)}%</dd></div>
        <div><dt>Urban poverty</dt><dd>${fmtNumber(POVERTY_CONTEXT_2024.urban, 2)}%</dd></div>
        <div><dt>Rural poverty</dt><dd>${fmtNumber(POVERTY_CONTEXT_2024.rural, 2)}%</dd></div>
      </dl>
      ${sourceLine(POVERTY_CONTEXT_2024.source)}
      <p>Rural poverty (11.34%) runs well above urban poverty (7.43%): the remaining poor are
      mostly in villages, working in agriculture. Extreme poverty — living below the international
      extreme line — is down to 0.83%.</p>
    </section>`;
  drawLineChart(
    root.querySelector('#poverty-chart'),
    YEARS.map(String),
    poverty.values,
    (value) => fmtPercent(value, 2),
  );
  drawLineChart(
    root.querySelector('#hdi-chart'),
    YEARS.map(String),
    hdi.values,
    (value) => fmtNumber(value, 2),
  );
}

export function renderIndicator(root, indicatorId) {
  const indicator = indicatorById(indicatorId);
  root.innerHTML = `
    <h1>${indicator.title}</h1>
    <p class="lede">${indicator.titleId} — ${indicator.unit}.</p>
    <section class="panel">
      <h2>${indicator.title}, 2015–2024</h2>
      <div class="chart-wrap"><canvas class="chart" id="ind-chart" height="260"></canvas></div>
      ${sourceLine(indicator.source)}
      <p>${indicator.note}</p>
      <table class="data-table">
        <thead><tr><th>Year</th><th>${indicator.title}</th></tr></thead>
        <tbody>
          ${YEARS.map(
            (year, i) => `<tr><td>${year}</td><td>${fmtIndicatorValue(indicator, indicator.values[i])}</td></tr>`,
          ).join('')}
        </tbody>
      </table>
    </section>
    <p><a href="#/explore">Open this indicator in the data explorer →</a></p>`;
  drawLineChart(
    root.querySelector('#ind-chart'),
    YEARS.map(String),
    indicator.values,
    (value) => fmtIndicatorValue(indicator, value),
  );
}

export function renderExplore(root) {
  let indicatorId = 'poverty';
  let startYear = 2015;
  let endYear = 2024;
  root.innerHTML = `
    <h1>Data explorer</h1>
    <p class="lede">Every indicator in this site as a table, for any year range you choose.
    Download the table as a CSV file to use it yourself.</p>
    <section class="panel">
      <div class="explorer-controls">
        <label>Indicator
          <select id="explore-indicator">
            ${INDICATORS.map(
              (item) => `<option value="${item.id}"${item.id === indicatorId ? ' selected' : ''}>${item.title}</option>`,
            ).join('')}
          </select>
        </label>
        ${rangePicker('explore', startYear, endYear)}
        <button class="button" id="download-csv" type="button">Download CSV</button>
      </div>
      <h2 id="explore-title">Poverty rate, 2015–2024</h2>
      <table class="data-table" id="explore-table">
        <thead><tr><th>Year</th><th>Value</th></tr></thead>
        <tbody></tbody>
      </table>
      <p class="source" id="explore-source"></p>
    </section>`;
  const redraw = () => {
    const indicator = indicatorById(indicatorId);
    const slice = sliceYears(indicator, startYear, endYear);
    root.querySelector('#explore-title').textContent = `${indicator.title}, ${fmtYearRange(slice.startYear, slice.endYear)}`;
    root.querySelector('#explore-source').textContent = `Source: ${indicator.source}`;
    root.querySelector('#explore-table tbody').innerHTML = slice.labels
      .map(
        (label, i) =>
          `<tr><td>${label}</td><td>${fmtIndicatorValue(indicator, slice.values[i])}</td></tr>`,
      )
      .join('');
  };
  redraw();
  root.querySelector('#explore-indicator').addEventListener('change', (event) => {
    indicatorId = event.target.value;
    redraw();
  });
  root.querySelector('#explore-start').addEventListener('change', (event) => {
    startYear = Number(event.target.value);
    redraw();
  });
  root.querySelector('#explore-end').addEventListener('change', (event) => {
    endYear = Number(event.target.value);
    redraw();
  });
  root.querySelector('#download-csv').addEventListener('click', () => {
    const indicator = indicatorById(indicatorId);
    const slice = sliceYears(indicator, startYear, endYear);
    const lines = ['year,value'];
    slice.labels.forEach((label, i) => lines.push(`${label},${slice.values[i]}`));
    const blob = new Blob([`${lines.join('\n')}\n`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nusastat-${indicator.id}-${slice.startYear}-${slice.endYear}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

export function renderSearch(root, query) {
  const needle = query.trim().toLowerCase();
  const hits = [];
  if (needle) {
    INDICATORS.forEach((indicator) => {
      const haystack = `${indicator.title} ${indicator.titleId} ${indicator.source} ${indicator.note}`.toLowerCase();
      if (haystack.includes(needle)) {
        hits.push({
          href: `#/indicator/${indicator.id}`,
          title: indicator.title,
          text: `${indicator.titleId}, ${fmtIndicatorValue(indicator, indicator.values[9])} in 2024. ${indicator.note}`,
        });
      }
    });
    const pages = [
      { href: '#/population', title: 'Population', text: 'Population 2015–2024, age structure and the largest provinces.' },
      { href: '#/economy', title: 'Economy', text: 'GDP growth, GDP per capita, sectors and foreign trade.' },
      { href: '#/prices', title: 'Prices', text: 'Monthly and annual inflation, and what it means for households.' },
      { href: '#/labour', title: 'Labour', text: 'Unemployment, participation and who is working.' },
      { href: '#/social', title: 'Society', text: 'Poverty, extreme poverty and human development.' },
      { href: '#/explore', title: 'Data explorer', text: 'Every indicator as a table for any year range, with CSV download.' },
    ];
    pages.forEach((pageItem) => {
      const haystack = `${pageItem.title} ${pageItem.text}`.toLowerCase();
      if (haystack.includes(needle)) hits.push(pageItem);
    });
  }
  root.innerHTML = `
    <h1>Search</h1>
    <p class="lede">Results for “${query}” across indicators and pages.</p>
    ${hits.length === 0
      ? `<p>No match for “${query}”. Try “inflation”, “poverty”, “population” or “GDP”.</p>`
      : `<ul class="search-results">
        ${hits.map(
          (hit) => `<li><a href="${hit.href}">${hit.title}</a>
            <span> — ${hit.text}</span></li>`,
        ).join('')}
      </ul>`}
    <p><a href="#/explore">Browse all indicators in the data explorer →</a></p>`;
}

export function renderAbout(root) {
  root.innerHTML = `
    <h1>About NusaStat</h1>
    <p class="lede">${ABOUT_TEXT.intro}</p>
    <section class="panel">
      <h2>Where the numbers come from</h2>
      <p>${ABOUT_TEXT.method}</p>
    </section>
    <section class="panel">
      <h2>Release calendar</h2>
      <p>${ABOUT_TEXT.releases}</p>
      <ul class="plain-list">
        <li><strong>GDP:</strong> quarterly, about five weeks after the quarter ends.</li>
        <li><strong>Consumer prices:</strong> monthly, on the first working day of the month.</li>
        <li><strong>Labour (Sakernas):</strong> February and August each year.</li>
        <li><strong>Poverty (Susenas):</strong> March and September each year.</li>
      </ul>
    </section>
    <section class="panel">
      <h2>How to use this site</h2>
      <ul class="plain-list">
        <li>Use the menu to jump between topics, or search for an indicator by name.</li>
        <li>On the Population and Economy pages, change the year range to redraw the chart.</li>
        <li>On the Population page, click a column heading to sort the province table.</li>
        <li>On the Data explorer page, pick any indicator and year range, then download the CSV.</li>
        <li>Hover over any chart to read the exact value for a year.</li>
      </ul>
    </section>
    <section class="panel">
      <h2>About this site</h2>
      <p>NusaStat is an original design built for the make.fun “best national statistics site”
      bounty. It is a static site: no build step, no network requests, no libraries. Figures are
      the published headline values; for the full tables, see the BPS releases linked in each
      page’s source line.</p>
    </section>`;
}
