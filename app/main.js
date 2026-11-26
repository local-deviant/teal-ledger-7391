// Hash router for NusaStat: one page per hash route, rendered into #page.
// Routes: #/ (overview), #/population, #/economy, #/prices, #/labour, #/social,
// #/explore, #/about, #/indicator/<id>, #/search?q=<text>.

import {
  renderAbout,
  renderEconomy,
  renderExplore,
  renderIndicator,
  renderLabour,
  renderOverview,
  renderPopulation,
  renderPrices,
  renderSearch,
  renderSocial,
} from './views.js';

const PAGE_TITLES = {
  overview: 'NusaStat — Indonesia in Numbers',
  population: 'Population — NusaStat',
  economy: 'Economy — NusaStat',
  prices: 'Prices — NusaStat',
  labour: 'Labour — NusaStat',
  social: 'Society — NusaStat',
  explore: 'Data explorer — NusaStat',
  about: 'About — NusaStat',
  search: 'Search — NusaStat',
};

const NAV_LINKS = [
  { href: '#/', label: 'Overview', key: 'overview' },
  { href: '#/population', label: 'Population', key: 'population' },
  { href: '#/economy', label: 'Economy', key: 'economy' },
  { href: '#/prices', label: 'Prices', key: 'prices' },
  { href: '#/labour', label: 'Labour', key: 'labour' },
  { href: '#/social', label: 'Society', key: 'social' },
  { href: '#/explore', label: 'Data explorer', key: 'explore' },
  { href: '#/about', label: 'About', key: 'about' },
];

function parseRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  return { parts, query: new URLSearchParams(queryPart || '') };
}

function render() {
  const { parts, query } = parseRoute();
  const root = document.querySelector('#page');
  const first = parts[0] || '';
  let navKey = 'overview';

  if (first === '' || first === undefined) {
    renderOverview(root);
    navKey = 'overview';
    document.title = PAGE_TITLES.overview;
  } else if (first === 'population') {
    renderPopulation(root);
    navKey = 'population';
    document.title = PAGE_TITLES.population;
  } else if (first === 'economy') {
    renderEconomy(root);
    navKey = 'economy';
    document.title = PAGE_TITLES.economy;
  } else if (first === 'prices') {
    renderPrices(root);
    navKey = 'prices';
    document.title = PAGE_TITLES.prices;
  } else if (first === 'labour') {
    renderLabour(root);
    navKey = 'labour';
    document.title = PAGE_TITLES.labour;
  } else if (first === 'social') {
    renderSocial(root);
    navKey = 'social';
    document.title = PAGE_TITLES.social;
  } else if (first === 'explore') {
    renderExplore(root);
    navKey = 'explore';
    document.title = PAGE_TITLES.explore;
  } else if (first === 'about') {
    renderAbout(root);
    navKey = 'about';
    document.title = PAGE_TITLES.about;
  } else if (first === 'indicator' && parts[1]) {
    renderIndicator(root, parts[1]);
    navKey = 'explore';
    document.title = `Indicator — NusaStat`;
  } else if (first === 'search') {
    renderSearch(root, query.get('q') || '');
    navKey = 'explore';
    document.title = PAGE_TITLES.search;
  } else {
    renderOverview(root);
    document.title = PAGE_TITLES.overview;
  }

  document.querySelectorAll('.site-nav a').forEach((link) => {
    const key = link.dataset.nav;
    if (key === navKey) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
}

function buildNav() {
  const nav = document.querySelector('.site-nav');
  nav.innerHTML = NAV_LINKS.map(
    (link) => `<a href="${link.href}" data-nav="${link.key}">${link.label}</a>`,
  ).join('');
}

function wireSearch() {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#search-input');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
  });
}

buildNav();
wireSearch();
window.addEventListener('hashchange', render);
render();
