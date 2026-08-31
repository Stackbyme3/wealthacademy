# Wealth Academy — Budsjett & formue

Course-branded budgeting tool for Stack Wealth Academy: monthly budget, 50/30/20 breakdown,
net-worth tracker and month-over-month history. All data is stored in the user's own browser
(localStorage) — there is no backend and nothing leaves the device.

## Stack

- React 18
- Vite 5
- Stack Design System tokens (plain CSS custom properties in `src/styles/`)

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # → dist/
npm run preview    # serve the build locally
```

## Deploy — GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. It builds on every push to
`main` and publishes `dist/` to Pages.

Setup once: **Settings → Pages → Source: GitHub Actions**.

For a *project* site (`user.github.io/<repo>/`) the workflow sets `VITE_BASE=/<repo>/`
automatically from the repo name. For a custom domain or user site, set `VITE_BASE=/`.

## Structure

```
src/
  main.jsx                 React entry
  App.jsx                  shell: onboarding gate, header, month bar, view router
  lib/
    constants.js           default line-item labels, month names, storage key
    format.js              NOK formatting, sum, percentage, sparkline points
    months.js              month sequencing + blank/carry-over month factory
    storage.js             localStorage load/save
  hooks/
    useBudget.js           the whole state machine (months, draft/locked, CRUD)
  components/
    Onboarding.jsx         name capture over the plum gradient
    Header.jsx             brand bar + view tabs
    MonthBar.jsx           current month, status pill, start/lock actions
    LineItems.jsx          editable label + amount + remove row, and add-row button
    views/
      Dashboard.jsx
      Budget.jsx
      Rule.jsx             50/30/20
      NetWorth.jsx
      History.jsx
  styles/                  design-system tokens + global reset
```

## Data model

```js
{
  profileName: "Celine",
  currentMonthId: "Mars-2026-1712…",   // null when no draft is open
  months: [{
    id, label: "Mars", year: 2026,
    status: "draft" | "locked",
    labels: { income: [], costs: [], buffer: [], assets: [], debts: [] },
    income: [], costs: [], buffer: [], assets: [], debts: [],
    extraDebt: 0
  }]
}
```

A month is editable only while `status === "draft"`. Locking it freezes the numbers and
feeds the history table; starting a new month carries over assets/debts and the label set.
