# DEV_NOTES.md — Internal Handoff for Next Claude Window

> Written at end of session, 2026-07-25. Read this before touching anything.

---

## The Vibe of This Codebase

This is a **mosque donation tracker** — real money, real community, so be careful and deliberate. The user (multimedia-mamtj6) knows this system deeply. They built it. They're not asking you to explain obvious things; they're asking you to be a precise technical partner.

**Communication style that works:**
- Short. Direct. No preamble.
- When they say "ok make it" — just do it, no "I'll now proceed to..."
- Tables > paragraphs for comparisons
- When you're wrong, say so plainly then correct it
- They speak in short Malay-inflected English. Match that energy — not casual, but not stiff either.

**What they don't need:**
- You narrating your own thought process
- Lengthy explanations for simple things
- Asking permission before obvious next steps

---

## Current System State (as of 2026-07-25)

### Data Source — MIGRATED
`script.js` line 1 now points to the dev repo:
```javascript
const jsonDataUrl = "https://raw.githubusercontent.com/multimedia-mamtj6/dev/refs/heads/main/admin/infaq/data/data.json";
```
Previously pointed to `multimedia-mamtj6/infaq/main/data/data.json`. This single line controls ALL JSON file URLs — `monthly.json`, `perbelanjaan.json`, `daily.json` all resolve via `.replace('data.json', '...')`.

### Pages Built This Sprint
- `perbelanjaan/index.html` — expense cumulative report page (NEW, fully built)
- `perbelanjaan/bulanan.html` — expense monthly breakdown with past-years dropdown (NEW, fully built)

### Chart Types
All expense charts use **line** type (not bar). This was changed from bar this session for both:
- `renderExpenseMonthlyChart()` in `script.js`
- `renderPastYearExpenseMonthlyChart()` in `script.js`

---

## Architecture — The Non-Obvious Bits

### The Dual-File Fetch (Critical)
`loadDashboard()` fetches TWO files in parallel, not one:
```javascript
const [dataResponse, monthlyResponse] = await Promise.all([
    fetch(`${jsonDataUrl}?t=${timestamp}`),           // data.json → projek only
    fetch(`${jsonDataUrl.replace('data.json', 'monthly.json')}?t=${timestamp}`) // monthly.json → stats
]);
```
- `data.json` = ONLY `projek` block (name, target, total, percentage, TarikhKemaskini)
- `monthly.json` = `ringkasan` + `paparanBulanIni` + `paparanBulanLepas` + `graf`

**I initially got this wrong** — I thought `data.json` was missing fields. It's not missing anything; those fields moved to `monthly.json` in v3.0.0 (see CHANGELOG.md).

### Two Timestamps in data.json — NOT Redundant
```json
{
  "projek": { "TarikhKemaskini": "2026-07-25..." },  // when human updated the sheet (→ #status-update)
  "tarikhKemaskini": "2026-07-25..."                 // when Apps Script synced (→ #last-update footer)
}
```
Different display purposes. Don't merge them.

### Dev System vs Infaq Repo
| | Main (infaq) | Dev |
|---|---|---|
| GitHub repo | `multimedia-mamtj6/infaq` | `multimedia-mamtj6/dev` |
| Data path | `data/*.json` | `admin/infaq/data/*.json` |
| Admin URL | public | `dev.mamtj6.com/admin/` (403, auth required) |
| GitHub raw | public ✅ | public ✅ |

The admin URL returns 403 because `/admin/` path requires auth. Always use GitHub raw URLs for data access.

### normalizeYearGraphData() — Why It Exists
The main repo's `perbelanjaan.json` had a 2024 data bug: 36 entries instead of 12 (each month tripled due to duplicate rows in the Perbelanjaan sheet tab). `normalizeYearGraphData()` in `script.js` defensively dedupes by summing duplicate month labels and recomputing cumulative client-side. The dev data is cleaner, but this function stays as a safety net.

---

## Bugs Found & Fixed This Sprint

### 1. perbelanjaan/bulanan.html — Bar Chart Instead of Line
**Bug**: `renderExpenseMonthlyChart()` and `renderPastYearExpenseMonthlyChart()` used `type: 'bar'`.
**Fix**: Converted both to `type: 'line'` with full line styling (borderColor, fill, tension: 0.4, point styling).
**Lesson**: When building new chart functions by copying existing ones, double-check the `type` field isn't being inherited from the wrong template.

### 2. (Prior session) code.gs — Trailing Whitespace on Bulan Values
**Bug**: Google Sheets cells had trailing spaces on month names, causing string comparison failures.
**Fix**: `.trim()` on `Bulan` values in `code.gs`.
**Lesson**: Always `.trim()` values read from Google Sheets cells — Sheets editors silently add trailing spaces.

### 3. (Prior session) code.gs — Tahun Auto-Converting to Date Objects
**Bug**: Google Sheets auto-converts numeric values that look like years into Date objects when read via Apps Script.
**Fix**: Force string conversion: `String(tahun)` before comparison.
**Lesson**: Never trust raw cell values from Sheets for numeric year columns — always coerce explicitly.

### 4. data.json Schema Confusion (Claude's own mistake, not a code bug)
**Bug**: Mistakenly thought `data.json` was incomplete because it lacked `ringkasan`, `paparanBulanIni`, `graf`.
**Root cause**: CLAUDE.md had an outdated schema showing all fields in `data.json` (pre-v3.0.0 structure). The actual split happened in v3.0.0.
**Fix**: Updated CLAUDE.md with the correct split schema.
**Lesson**: Read `script.js` actual fetch calls before assuming what a JSON file should contain. The code is authoritative, not the docs.

---

## Current Data Files (data/ folder)

All pulled from `multimedia-mamtj6/dev` repo on 2026-07-25:

| File | Key Values | Notes |
|---|---|---|
| `data.json` | `JumlahTerkumpul: 197990`, `Peratusan: 79.2` | projek only |
| `monthly.json` | bulanIni: JULAI, tahunIni: 70079.8 | has 2024+2025+2026 |
| `perbelanjaan.json` | tahunLepas: 78152.43 (2025) | 2023+2024 are all zeros |
| `daily.json` | ~130+ entries, JumlahTerkumpul: 197990 | NOT consumed by any page yet |

**Note on `monthly.json`**: `bulanIni.bulan` is now full name "JULAI" not abbreviation "JUL". Display-only difference.

**Note on `perbelanjaan.json`**: 2023 and 2024 years exist in `graf` but are all zeros — the Perbelanjaan sheet in dev had no historical data for those years. They'll show in past-years dropdown as selectable but flat. Consider whether to filter out all-zero years in `renderPastYearsExpenseCharts()`.

---

## Pending / Unresolved

- `daily.json` is published but **no frontend page consumes it**. Reserved for future daily tracker. Don't wire it up unless asked.
- `perbelanjaan/` nav tabs on the other 8 pages still show "AKAN DATANG" disabled badge — deliberately out of scope per user decision. The page is reachable by direct URL only.
- 2023/2024 all-zeros in `perbelanjaan.json` past-years — may want to filter these out to avoid confusing empty charts.
- `data/daily.json` has the RM0 Pelancaran entry (`2024-03-28`) back in — it was removed in dev but appears to be back. Not breaking anything since `daily.json` is not consumed.

---

## Quick Reference

```
script.js line 1    → jsonDataUrl (THE single source of truth for all data)
script.js line 49   → loadDashboard() — fetches data.json + monthly.json
script.js line ~138 → loadReport() — fetches monthly.json for tabung-bulanan.html
script.js ~512      → renderExpenseMonthlyChart() — line chart, perbelanjaan/bulanan.html
script.js ~939      → renderPastYearExpenseMonthlyChart() — line chart, past years
perbelanjaan/index.html   → expense cumulative report
perbelanjaan/bulanan.html → expense monthly breakdown + past-years dropdown
```
