# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This folder contains the Google Apps Script (bound to a Google Sheet) that acts as the CMS backend for the Infaq site. It reads donation and expense data from sheet tabs, computes derived stats, and publishes four JSON files to the `infaq` GitHub repo, which the static site (`script.js`) fetches at runtime.

There is no build/lint/test tooling here — `code.gs` is edited directly in the Google Apps Script editor (Extensions > Apps Script) bound to the spreadsheet, or synced via `clasp` if set up locally. There is no `.clasp.json` in this folder currently, so changes made locally must be manually copy-pasted into the Apps Script editor unless `clasp push`/`clasp pull` is configured.

## Architecture

### Trigger flow

1. Opening the spreadsheet runs `onOpen()`, which adds an **"Alat Khas"** menu with two actions:
   - **Simpan GitHub Token** — prompts for a GitHub PAT (`ghp_...`) and stores it in `PropertiesService.getUserProperties()` (per-user, not shared/exported with the sheet).
   - **Publish JSON ke GitHub** — runs `publishJsonToGithub()`, the main entry point.
2. `publishJsonToGithub()` collects data from several sheet tabs, builds four JSON payloads, and pushes each to GitHub via the Contents API (`uploadToGithub`).

### Sheet tabs read

- **Konfigurasi** — key/value config (`TahunSemasa`, `BulanSemasa`) read by `getConfig()`. Drives "current month/year" logic everywhere.
- **Projek** — key/value project info (`getProjectData()`) plus a per-row daily donation log read by column header (`Tarikh`, `RM`, `Keterangan`) via `getDailyData()`. `TarikhKemaskini` is read directly from cell `B5`.
- **KutipanBulanan** — one row per (Tahun, Bulan) with weekly breakdown (`Minggu1`-`Minggu5`) and `JumlahBulanan`, read generically via `getSheetData()`.
- **Perbelanjaan** — one row per (Tahun, Bulan) with `Jumlah` (expense amount) and an informational `JumlahKumulatif` column that is never read by the script — see "Cumulative totals" below.

`getSheetData(sheetName)` is the generic tab-to-JSON reader: it strips whitespace from headers, coerces a fixed list of numeric-looking columns (commas and `-` are treated as 0), and skips columns with blank headers. Any new numeric column added to a sheet must be added to the `numericHeaders` list in this function or it will be read as a string.

### Output files (pushed to `infaq` repo on GitHub)

| File | Built by | Contents |
|---|---|---|
| `data/data.json` (`FILE_PATH`) | `mainData` | `projek` (current totals/target) + `tarikhKemaskini` |
| `data/monthly.json` (`MONTHLY_FILE_PATH`) | `monthlyData` | `ringkasan` (yearly/monthly summary), `paparanBulanIni`, `paparanBulanLepas`, `graf` (per-year chart data) |
| `data/daily.json` (`DAILY_FILE_PATH`) | `dailyOnlyData` | trimmed `projek` totals + `paparanHarian` (daily log) |
| `data/perbelanjaan.json` (`PERBELANJAAN_FILE_PATH`) | `perbelanjaanData` | `ringkasan.perbelanjaan`, `paparanBulanIni`, `paparanBulanLepas`, `graf` (per-year `data` + `dataKumulatif`) |

This file split exists so the dashboard can fetch a small `data.json` for the headline numbers without pulling the full monthly/daily/expense history.

### "Safe" vs non-safe variants

`getCurrentMonthData`/`getYearlyGraphData` have `*Safe` counterparts (`getCurrentMonthDataSafe`, `getYearlyGraphDataSafe`) that return a zero-filled structure instead of an error object when no row exists yet for the current month/year. `publishJsonToGithub()` always uses the `Safe` versions — keep using those when extending the publish flow so a brand-new month/year doesn't break the site. The `Perbelanjaan` equivalents follow the same naming (`getCurrentMonthExpenseDataSafe`, `getYearlyExpenseGraphDataSafe`, `getExpenseGraphYears`).

### Cumulative totals (`Perbelanjaan` only)

`JumlahKumulatif`/`dataKumulatif` in the expense export is always computed in code by `computeCumulativeByMonth()` — a running sum of `Jumlah` per year, sorted by Malay month order, resetting at each year boundary. The sheet's own `JumlahKumulatif` column is purely informational for the spreadsheet user; the script never reads it. A missing mid-year row simply doesn't advance the running total, so cumulative naturally carries forward across gaps.

### GitHub upload mechanics (`uploadToGithub`)

- Looks up the file's current `sha` via a GET to the Contents API first (required by GitHub to update an existing file); if the GET fails/404s, `sha` stays `undefined` and the file is created instead of updated.
- Auth is a classic PAT passed as `Authorization: token <PAT>` (not `Bearer`), stored per-user via `showSetTokenPrompt()`/`saveToken()` — never hardcode a token in `code.gs`.
- Commit message is auto-generated with a Malaysian locale timestamp (`toLocaleString('en-MY')`).

### Month names

Months are matched as uppercase Malay strings (`"JANUARI"` … `"DISEMBER"`) in a fixed array (see `getPreviousMonth`, `getYearlyGraphDataSafe`, `getGraphYears`). `BulanSemasa` in the **Konfigurasi** tab must exactly match one of these (case-insensitive, whitespace-insensitive) names.
