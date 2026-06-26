# Profit/Loss Chrome Extension

Chrome extension popup for tracking an account balance, round-trip trading fees, and running profit/loss totals by week.

## Bootstrap Package

This project was instantiated from the `bootstrap` repo using the `small-node-static-web` package direction, adapted for a static Chrome extension popup instead of an Express-served web page. Bootstrap CSS is installed from npm and copied into `vendor/bootstrap.min.css` so the extension does not depend on a CDN.

## Features

- Save a starting account balance.
- Add round-trip trades with date, symbol, gross P/L, fees, and notes.
- Track current balance as starting balance plus net P/L.
- Track running gross P/L, fees, net P/L, and trade count.
- Group weekly totals and sort by newest, oldest, highest net P/L, or lowest net P/L.
- Delete trades, reset local data, and export trade history to CSV.

## Setup

```powershell
npm install
npm run prepare:vendor
npm run check
```

## Load In Chrome

1. Open `chrome://extensions`.
2. Turn on Developer mode.
3. Choose Load unpacked.
4. Select this `Profit_Loss` folder.

Data is stored in `chrome.storage.local` when running as an extension, with a `localStorage` fallback for basic browser testing.
