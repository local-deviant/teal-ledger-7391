# NusaStat — Indonesia in Numbers

[![make.fun · best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/local-deviant/teal-ledger-7391/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/local-deviant/teal-ledger-7391/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=best-national-statistics-site-20261126-0539)

Indonesia's headline official statistics in one static site: population, the economy,
prices, labour and society — every figure with its source and year. Built for the
make.fun bounty **best-national-statistics-site-20261126-0539** ("Make the best national
statistics site", $50, closes 29 November 2026).

## What it is

A static site under `app/` — no build step, no network requests, no libraries.
Charts are hand-drawn on canvas; pages are hash routes rendered from published
BPS (Statistics Indonesia) figures, UN World Population Prospects 2024 and ILO
modelled estimates.

- **Overview** — five headline KPIs for 2024, GDP growth chart, age donut, latest releases.
- **Population** — 2015–2024 chart with a year-range picker, age structure, and a sortable table of the ten largest provinces.
- **Economy** — GDP growth bars, GDP per capita, sectors of GDP, and 2024 foreign trade.
- **Prices** — monthly inflation through 2024 and annual inflation 2015–2024, plus what the rate means for households, savers and policy.
- **Labour** — unemployment and participation 2015–2024, plus the 2024 labour market snapshot.
- **Society** — poverty and the Human Development Index 2015–2024, with urban/rural and extreme-poverty context.
- **Data explorer** — all nine indicators as tables for any year range, with CSV download.
- **Search & About** — search across indicators; sources, release calendar and method.

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`,
unchanged from the kit).

## License

MIT — see [LICENSE](LICENSE).
