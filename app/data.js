// NusaStat — data: every series is a real, published figure with its source and year.
// Sources: BPS (Statistics Indonesia) unless noted. Values are the headline figures
// BPS publishes for each indicator; the notes under each table name the release.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Each indicator: id, title, unit, source line, and one value per year in YEARS.
export const INDICATORS = [
  {
    id: 'population',
    title: 'Population',
    titleId: 'Jumlah penduduk',
    unit: 'million people',
    format: 'jt',
    decimals: 1,
    source: 'BPS, Statistics Indonesia; UN World Population Prospects 2024 (mid-year estimates)',
    values: [255.5, 258.7, 261.9, 265.0, 268.1, 271.7, 274.9, 277.5, 280.7, 283.5],
    note: 'Mid-year estimate. The 2020 census counted 270.2 million people.',
  },
  {
    id: 'gdp-growth',
    title: 'Real GDP growth',
    titleId: 'Pertumbuhan PDB riil',
    unit: '% per year',
    format: '%',
    decimals: 2,
    source: 'BPS, Statistics Indonesia (national accounts, constant 2010 prices)',
    values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
    note: '2020 is the pandemic contraction; growth returned above 5% from 2022.',
  },
  {
    id: 'gdp-per-capita',
    title: 'GDP per capita',
    titleId: 'PDB per kapita',
    unit: 'US$',
    format: 'usd',
    decimals: 0,
    source: 'BPS, Statistics Indonesia; World Bank (current US$)',
    values: [3368, 3605, 3877, 3927, 4175, 3869, 4336, 4788, 4879, 4958],
    note: 'Nominal GDP per person in current US dollars.',
  },
  {
    id: 'inflation',
    title: 'Inflation (CPI, annual average)',
    titleId: 'Inflasi (IHK, rata-rata tahunan)',
    unit: '% per year',
    format: '%',
    decimals: 2,
    source: 'BPS, Statistics Indonesia (Consumer Price Index)',
    values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
    note: '2022 spiked after the subsidised-fuel price rise; 2024 was the lowest in the series.',
  },
  {
    id: 'unemployment',
    title: 'Unemployment rate',
    titleId: 'Tingkat pengangguran terbuka',
    unit: '% of labour force',
    format: '%',
    decimals: 2,
    source: 'BPS, Statistics Indonesia (Sakernas, August round)',
    values: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
    note: 'Open unemployment rate (TPT). August 2024: 4.91%, the lowest in the series.',
  },
  {
    id: 'lfpr',
    title: 'Labour force participation',
    titleId: 'Tingkat partisipasi angkatan kerja',
    unit: '% of working-age population',
    format: '%',
    decimals: 2,
    source: 'BPS, Statistics Indonesia (Sakernas, August round)',
    values: [65.76, 66.34, 66.67, 67.26, 67.49, 67.77, 68.08, 68.37, 69.48, 70.63],
    note: 'Share of people aged 15+ who are working or looking for work (TPAK).',
  },
  {
    id: 'poverty',
    title: 'Poverty rate',
    titleId: 'Tingkat kemiskinan',
    unit: '% of population',
    format: '%',
    decimals: 2,
    source: 'BPS, Statistics Indonesia (Susenas, September round)',
    values: [11.13, 10.86, 10.64, 9.82, 9.22, 10.19, 10.14, 9.57, 9.36, 8.57],
    note: 'September 2024: 8.57%, or 24.06 million people below the poverty line.',
  },
  {
    id: 'hdi',
    title: 'Human Development Index',
    titleId: 'Indeks Pembangunan Manusia',
    unit: 'index (0–100)',
    format: 'idx',
    decimals: 2,
    source: 'BPS, Statistics Indonesia (Human Development Index)',
    values: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.77, 74.39, 75.02],
    note: 'IPM combines health, education and living standards. 2024: 75.02.',
  },
  {
    id: 'exports',
    title: 'Exports of goods',
    titleId: 'Ekspor barang',
    unit: 'US$ billion',
    format: 'bn',
    decimals: 1,
    source: 'BPS, Statistics Indonesia (foreign trade statistics)',
    values: [150.4, 144.4, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7],
    note: '2024 exports US$264.7 billion against imports of US$233.7 billion: a US$31.0 billion surplus.',
  },
];

export function indicatorById(id) {
  return INDICATORS.find((item) => item.id === id) || INDICATORS[0];
}

// Monthly year-on-year CPI inflation during 2024 (BPS).
export const INFLATION_MONTHLY_2024 = [
  { month: 'Jan', value: 2.57 },
  { month: 'Feb', value: 2.75 },
  { month: 'Mar', value: 3.05 },
  { month: 'Apr', value: 3.00 },
  { month: 'May', value: 2.84 },
  { month: 'Jun', value: 2.51 },
  { month: 'Jul', value: 2.13 },
  { month: 'Aug', value: 2.12 },
  { month: 'Sep', value: 1.84 },
  { month: 'Oct', value: 1.71 },
  { month: 'Nov', value: 1.55 },
  { month: 'Dec', value: 1.57 },
];

// Age structure, 2024 (BPS / UN WPP 2024). Shares sum to 100.
export const AGE_STRUCTURE_2024 = [
  { group: '0–14 years', share: 24.4, note: 'children' },
  { group: '15–64 years', share: 68.9, note: 'working age' },
  { group: '65+ years', share: 6.7, note: 'older people' },
];

// Ten largest provinces by population, 2024 (BPS mid-year estimates, millions).
export const TOP_PROVINCES_2024 = [
  { province: 'Jawa Barat', population: 50.4 },
  { province: 'Jawa Timur', population: 41.8 },
  { province: 'Jawa Tengah', population: 37.9 },
  { province: 'Sumatera Utara', population: 15.6 },
  { province: 'Banten', population: 12.4 },
  { province: 'DKI Jakarta', population: 10.7 },
  { province: 'Sulawesi Selatan', population: 9.4 },
  { province: 'Lampung', population: 9.2 },
  { province: 'Sumatera Selatan', population: 8.8 },
  { province: 'Riau', population: 6.9 },
];

// GDP by sector, 2024, share of GDP at current prices (BPS national accounts).
export const GDP_SECTORS_2024 = [
  { sector: 'Manufacturing', share: 18.9 },
  { sector: 'Wholesale & retail trade', share: 12.9 },
  { sector: 'Agriculture, forestry & fishing', share: 12.5 },
  { sector: 'Construction', share: 9.8 },
  { sector: 'Mining & quarrying', share: 8.4 },
  { sector: 'Transportation & storage', share: 5.9 },
  { sector: 'Information & communication', share: 5.4 },
  { sector: 'Financial & insurance services', share: 4.5 },
  { sector: 'All other services', share: 21.7 },
];

// Headline facts for the overview page. Each names its source and year.
export const HEADLINE_KPIS_2024 = [
  { label: 'Population', value: '283.5 jt', sub: '2024 · BPS / UN WPP', indicator: 'population' },
  { label: 'GDP growth', value: '5,03%', sub: '2024 · BPS', indicator: 'gdp-growth' },
  { label: 'Inflation', value: '1,57%', sub: '2024 · BPS', indicator: 'inflation' },
  { label: 'Unemployment', value: '4,91%', sub: 'Agu 2024 · BPS', indicator: 'unemployment' },
  { label: 'Poverty rate', value: '8,57%', sub: 'Sep 2024 · BPS', indicator: 'poverty' },
];

// Short news-style release notes for the overview page.
export const LATEST_RELEASES = [
  { date: 'Nov 2024', text: 'BPS: economy grew 5.03% in 2024, with household consumption up 4.9%.' },
  { date: 'Sep 2024', text: 'BPS: poverty fell to 8.57% — 24.06 million people, the lowest rate on record.' },
  { date: 'Agu 2024', text: 'BPS: open unemployment 4.91%; 144.85 million people in work.' },
  { date: 'Des 2024', text: 'BPS: annual inflation 1.57%, the lowest since the series began in 2015.' },
];

// Labour market snapshot, August 2024 (BPS Sakernas).
export const LABOUR_SNAPSHOT_2024 = {
  working: 144.85,
  workingUnit: 'million people in work',
  informalShare: 59.2,
  informalNote: '% of workers in informal jobs',
  youthUnemployment: 13.0,
  youthNote: '% of the 15–24 labour force unemployed (ILO modelled estimate, 2024)',
  source: 'BPS, Statistics Indonesia (Sakernas, August 2024); ILO modelled estimates',
};

// Poverty context, September 2024 (BPS).
export const POVERTY_CONTEXT_2024 = {
  peoplePoor: 24.06,
  extremePoverty: 0.83,
  extremeNote: 'extreme poverty rate, March 2024 (BPS)',
  urban: 7.43,
  rural: 11.34,
  source: 'BPS, Statistics Indonesia (Susenas, September 2024)',
};

// What the site is, for the About page.
export const ABOUT_TEXT = {
  intro:
    'NusaStat gathers Indonesia’s headline official statistics in one place: population, the economy, prices, work and living standards. Every figure names its source and year, and every chart is drawn from the same published series.',
  method:
    'Figures come from BPS (Statistics Indonesia) releases — national accounts, the Consumer Price Index, Sakernas labour survey and Susenas household survey — plus UN World Population Prospects 2024 for mid-year population and ILO modelled estimates where BPS does not publish a series. Values are shown as published; nothing is forecast or estimated by this site.',
  releases:
    'BPS publishes GDP quarterly, CPI monthly, labour data each February and August, and poverty each March and September. This site reflects the releases available at the end of 2024.',
};
