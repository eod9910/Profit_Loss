const STORAGE_KEY = "profitLossCalculatorState";

const defaultState = {
  startingBalance: 0,
  trades: [],
  weekSort: "date-desc"
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC"
});

const elements = {
  balanceForm: document.querySelector("#balanceForm"),
  startingBalance: document.querySelector("#startingBalance"),
  currentBalance: document.querySelector("#currentBalance"),
  netProfitLoss: document.querySelector("#netProfitLoss"),
  totalFees: document.querySelector("#totalFees"),
  tradeCount: document.querySelector("#tradeCount"),
  tradeForm: document.querySelector("#tradeForm"),
  tradeDate: document.querySelector("#tradeDate"),
  tradeSymbol: document.querySelector("#tradeSymbol"),
  grossProfitLoss: document.querySelector("#grossProfitLoss"),
  roundTripFees: document.querySelector("#roundTripFees"),
  tradeNotes: document.querySelector("#tradeNotes"),
  weeklyTotals: document.querySelector("#weeklyTotals"),
  weekSort: document.querySelector("#weekSort"),
  tradeLog: document.querySelector("#tradeLog"),
  resetData: document.querySelector("#resetData"),
  exportCsv: document.querySelector("#exportCsv")
};

let state = structuredClone(defaultState);

init();

async function init() {
  state = await loadState();
  elements.tradeDate.value = getTodayDateValue();
  elements.startingBalance.value = state.startingBalance || "";
  elements.weekSort.value = state.weekSort;
  bindEvents();
  render();
}

function bindEvents() {
  elements.balanceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    state.startingBalance = parseMoney(elements.startingBalance.value);
    await saveState();
    render();
  });

  elements.tradeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const trade = {
      id: crypto.randomUUID(),
      date: elements.tradeDate.value,
      symbol: elements.tradeSymbol.value.trim().toUpperCase(),
      grossProfitLoss: parseMoney(elements.grossProfitLoss.value),
      roundTripFees: parseMoney(elements.roundTripFees.value),
      notes: elements.tradeNotes.value.trim(),
      createdAt: new Date().toISOString()
    };

    state.trades.push(trade);
    await saveState();
    elements.tradeForm.reset();
    elements.tradeDate.value = getTodayDateValue();
    render();
  });

  elements.weekSort.addEventListener("change", async () => {
    state.weekSort = elements.weekSort.value;
    await saveState();
    renderWeeklyTotals();
  });

  elements.tradeLog.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-trade]");
    if (!button) {
      return;
    }

    state.trades = state.trades.filter((trade) => trade.id !== button.dataset.deleteTrade);
    await saveState();
    render();
  });

  elements.resetData.addEventListener("click", async () => {
    if (!confirm("Reset account balance and all trade history?")) {
      return;
    }

    state = structuredClone(defaultState);
    await saveState();
    elements.startingBalance.value = "";
    elements.weekSort.value = state.weekSort;
    render();
  });

  elements.exportCsv.addEventListener("click", exportTrades);
}

function render() {
  renderSummary();
  renderWeeklyTotals();
  renderTradeLog();
}

function renderSummary() {
  const totals = getTotals(state.trades);
  const currentBalance = state.startingBalance + totals.netProfitLoss;

  elements.currentBalance.textContent = currency.format(currentBalance);
  elements.netProfitLoss.textContent = currency.format(totals.netProfitLoss);
  elements.totalFees.textContent = currency.format(totals.totalFees);
  elements.tradeCount.textContent = String(state.trades.length);

  setAmountClass(elements.currentBalance, currentBalance - state.startingBalance);
  setAmountClass(elements.netProfitLoss, totals.netProfitLoss);
}

function renderWeeklyTotals() {
  const weeks = getWeeklyTotals();
  elements.weeklyTotals.replaceChildren();

  if (weeks.length === 0) {
    elements.weeklyTotals.append(emptyState("No weekly totals yet. Add a round trip to start tracking."));
    return;
  }

  for (const week of weeks) {
    const row = document.createElement("article");
    row.className = "weekly-row";

    const header = document.createElement("header");
    const title = document.createElement("strong");
    title.textContent = week.label;
    const amount = document.createElement("strong");
    amount.textContent = currency.format(week.netProfitLoss);
    setAmountClass(amount, week.netProfitLoss);
    header.append(title, amount);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${week.count} trade${week.count === 1 ? "" : "s"} | Gross ${currency.format(week.grossProfitLoss)} | Fees ${currency.format(week.totalFees)}`;

    row.append(header, meta);
    elements.weeklyTotals.append(row);
  }
}

function renderTradeLog() {
  const trades = [...state.trades].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  elements.tradeLog.replaceChildren();

  if (trades.length === 0) {
    elements.tradeLog.append(emptyState("No trades logged yet."));
    return;
  }

  for (const trade of trades) {
    const net = getTradeNet(trade);
    const row = document.createElement("article");
    row.className = "trade-row";

    const header = document.createElement("header");
    const title = document.createElement("strong");
    title.textContent = trade.symbol ? `${trade.symbol} round trip` : "Round trip";
    const amount = document.createElement("strong");
    amount.textContent = currency.format(net);
    setAmountClass(amount, net);
    header.append(title, amount);

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${formatDate(trade.date)} | Gross ${currency.format(trade.grossProfitLoss)} | Fees ${currency.format(trade.roundTripFees)}`;

    row.append(header, meta);

    if (trade.notes) {
      const notes = document.createElement("div");
      notes.textContent = trade.notes;
      row.append(notes);
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-sm btn-outline-danger delete-trade";
    deleteButton.type = "button";
    deleteButton.dataset.deleteTrade = trade.id;
    deleteButton.textContent = "Delete";
    row.append(deleteButton);

    elements.tradeLog.append(row);
  }
}

function getTotals(trades) {
  return trades.reduce(
    (totals, trade) => {
      totals.grossProfitLoss += trade.grossProfitLoss;
      totals.totalFees += trade.roundTripFees;
      totals.netProfitLoss += getTradeNet(trade);
      return totals;
    },
    { grossProfitLoss: 0, totalFees: 0, netProfitLoss: 0 }
  );
}

function getWeeklyTotals() {
  const byWeek = new Map();

  for (const trade of state.trades) {
    const week = getWeekInfo(trade.date);
    const current = byWeek.get(week.key) ?? {
      ...week,
      count: 0,
      grossProfitLoss: 0,
      totalFees: 0,
      netProfitLoss: 0
    };

    current.count += 1;
    current.grossProfitLoss += trade.grossProfitLoss;
    current.totalFees += trade.roundTripFees;
    current.netProfitLoss += getTradeNet(trade);
    byWeek.set(week.key, current);
  }

  return [...byWeek.values()].sort((a, b) => {
    switch (state.weekSort) {
      case "date-asc":
        return a.key.localeCompare(b.key);
      case "net-desc":
        return b.netProfitLoss - a.netProfitLoss;
      case "net-asc":
        return a.netProfitLoss - b.netProfitLoss;
      case "date-desc":
      default:
        return b.key.localeCompare(a.key);
    }
  });
}

function getWeekInfo(dateValue) {
  const date = parseDate(dateValue);
  const day = date.getUTCDay() || 7;
  const weekStart = new Date(date);
  weekStart.setUTCDate(date.getUTCDate() - day + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  return {
    key: weekStart.toISOString().slice(0, 10),
    label: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
  };
}

function getTradeNet(trade) {
  return trade.grossProfitLoss - trade.roundTripFees;
}

function parseMoney(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0;
}

function parseDate(dateValue) {
  return new Date(`${dateValue}T00:00:00.000Z`);
}

function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  const date = dateValue instanceof Date ? dateValue : parseDate(dateValue);
  return dateFormatter.format(date);
}

function setAmountClass(element, value) {
  element.classList.toggle("amount-gain", value > 0);
  element.classList.toggle("amount-loss", value < 0);
}

function emptyState(message) {
  const element = document.createElement("div");
  element.className = "empty-state";
  element.textContent = message;
  return element;
}

async function loadState() {
  const stored = await readStoredState();
  return normalizeState(stored);
}

function normalizeState(stored) {
  if (!stored || typeof stored !== "object") {
    return structuredClone(defaultState);
  }

  return {
    startingBalance: Number.isFinite(stored.startingBalance) ? stored.startingBalance : 0,
    weekSort: typeof stored.weekSort === "string" ? stored.weekSort : defaultState.weekSort,
    trades: Array.isArray(stored.trades)
      ? stored.trades.map(normalizeTrade).filter(Boolean)
      : []
  };
}

function normalizeTrade(trade) {
  if (!trade || typeof trade !== "object" || typeof trade.date !== "string") {
    return null;
  }

  return {
    id: typeof trade.id === "string" ? trade.id : crypto.randomUUID(),
    date: trade.date,
    symbol: typeof trade.symbol === "string" ? trade.symbol : "",
    grossProfitLoss: Number.isFinite(trade.grossProfitLoss) ? trade.grossProfitLoss : 0,
    roundTripFees: Number.isFinite(trade.roundTripFees) ? trade.roundTripFees : 0,
    notes: typeof trade.notes === "string" ? trade.notes : "",
    createdAt: typeof trade.createdAt === "string" ? trade.createdAt : new Date().toISOString()
  };
}

async function saveState() {
  await writeStoredState(state);
}

function readStoredState() {
  if (globalThis.chrome?.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => resolve(result[STORAGE_KEY]));
    });
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  return Promise.resolve(raw ? JSON.parse(raw) : null);
}

function writeStoredState(nextState) {
  if (globalThis.chrome?.storage?.local) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: nextState }, resolve);
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  return Promise.resolve();
}

function exportTrades() {
  if (state.trades.length === 0) {
    return;
  }

  const rows = [
    ["date", "symbol", "gross_profit_loss", "round_trip_fees", "net_profit_loss", "notes"],
    ...state.trades.map((trade) => [
      trade.date,
      trade.symbol,
      trade.grossProfitLoss.toFixed(2),
      trade.roundTripFees.toFixed(2),
      getTradeNet(trade).toFixed(2),
      trade.notes
    ])
  ];

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "profit-loss-trades.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
