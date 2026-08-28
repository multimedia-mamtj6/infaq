# DEV_NOTES.md — Internal Handoff for Next Claude Window

> Written at end of session, 2026-08-28. Read this before touching anything.
> Previous session's notes (2026-07-25) are preserved below under "Prior Session Archive" — still-relevant lessons were folded up into this top section.

---

## Sync Note — Read This First

If you're picking this up cold, here's the fastest way back to speed:

- This is a **mosque donation tracker**, real money, real community. The user runs both this repo (`multimedia-mamtj6/infaq`, this checkout) AND the sibling `multimedia-mamtj6/dev` repo that now publishes the actual data. They know the architecture end-to-end — you're the precise execution hand, not the architect.
- **The data source moved AGAIN this session** (see below) — from `raw.githubusercontent.com/.../dev/...` to the production `dev.mamtj6.com` Vercel domain. If you're about to touch `jsonDataUrl` anywhere, check what it currently says before assuming — it's changed twice across two sessions now.
- **The `display/` folder pages do NOT share `script.js`'s data URL.** Each kiosk page (`display/data-*.html`) hardcodes its own standalone `const jsonDataUrl = ...` in an inline `<script>` block. This bit everyone for a while — `script.js` got migrated to the `dev` repo back on 2026-07-25, but the two live `display/` pages were left pointing at the old `multimedia-mamtj6/infaq` repo the entire time, undiscovered until this session's full-repo inventory. **Lesson: never assume a URL change in `script.js` propagated anywhere else — grep the whole repo for `jsonDataUrl` before declaring a migration done.**
- The user's communication style hasn't changed from last time: short, direct, no preamble, tables over paragraphs, terse acknowledgments ("ok good"). New pattern observed this session: when given a choice via `AskUserQuestion`, the user picks the "(Recommended)" option almost instantly every time — they're trusting your judgment call, not looking for a debate. Keep making a clear recommendation and moving; don't present open-ended menus without a default.
- Also new this session: the user gave you a **fully pre-packaged migration spec** up front (exact prod vs raw URLs, why each exists, CORS/cache-control state, field→purpose mapping for all 4 JSON files, even the failure-mode fallback instructions) — like a brief handed off from their "other repo" self. When you get a spec that detailed, trust it and execute; the ambiguity that's left (which files are in/out of scope, cosmetic naming choices) is exactly what's worth one round of `AskUserQuestion`, not more.

---

## Current System State (as of 2026-08-28)

### Data Source — MIGRATED AGAIN (raw GitHub → production Vercel)

`script.js` line 1 now points to the **production** endpoint, not raw GitHub:
```javascript
const jsonDataUrl = "https://dev.mamtj6.com/admin/infaq/data/data.json";
```
This is served by the `multimedia-mamtj6/dev` repo's Vercel deployment, with `Cache-Control: no-store` and `Access-Control-Allow-Origin: *` confirmed live via curl (all 4 files — `data.json`, `monthly.json`, `perbelanjaan.json`, `daily.json` — return 200 with these headers). No fallback to raw GitHub needed right now, but if `dev.mamtj6.com` ever 404s or CORS-fails, that means the Vercel deploy of the CORS header change hasn't landed — temporary fallback is `https://raw.githubusercontent.com/multimedia-mamtj6/dev/main/admin/infaq/data/*.json` (same repo, just the raw-file route instead of the served route).

**This single line still controls everything in `script.js`** via `.replace('data.json', '...')` — `monthly.json`, `perbelanjaan.json` resolve automatically. `daily.json` still has zero consumers anywhere in the frontend (confirmed again this session via repo-wide grep — still true).

### `display/` kiosk pages — repointed AND expanded

Three live, linked kiosk pages now, all with their **own independent** `jsonDataUrl` (see Sync Note above for why this matters):

| File | Fetches | Status this session |
|---|---|---|
| `display/data-infaq-pembangunan.html` | `data.json` | Repointed from old `multimedia-mamtj6/infaq` repo → production `dev.mamtj6.com` |
| `display/data-tabung-bulanan.html` | `monthly.json` | Repointed, same as above |
| `display/data-perbelanjaan-bulanan.html` | `perbelanjaan.json` | **NEW this session** — built from scratch |

`display/index.html`'s "Menu Paparan Digital" kiosk chooser now has **3 buttons** (was 2) — grid changed from `md:grid-cols-2` to `md:grid-cols-3`. New button uses blue theme (`ph-chart-bar` icon) to stay distinct from amber (Dana Pembangunan) and emerald (Tabung Bulanan).

**Deliberately left untouched** (orphaned/archived, confirmed via `grep`-for-references that nothing links to them):
- `home.html` — an entirely different, unlinked alternate homepage design ("Infaq@MAMTJ6"), still on the ancient repo URL. Nobody navigates here. Don't "fix" it unless asked.
- `display/data-tabung-bulanan-ori.html` — unlinked backup copy of the tabung kiosk page, still on old repo URL.
- `display/old/*.html` (3 files) — explicitly archived, same old URL.

These three groups are why a `grep -r jsonDataUrl` across the repo will show URLs from **three different eras** side by side. That's expected, not a bug — check `display/index.html` and nav links to figure out what's actually live before "fixing" a URL you find.

### New page built: `display/data-perbelanjaan-bulanan.html`

Kiosk page for expenses, styled identically to `data-tabung-bulanan.html` (same fullscreen/normal adaptive-viewport JS, same dark gradient look), but the chart is ported inline from `renderExpenseMonthlyChart()` in `script.js` (blue `#3b82f6` line, flat fill — not the emerald gradient-fill style the donation kiosk chart uses).

**Key design constraint that shaped the layout**: `perbelanjaan.json` has no weekly breakdown (unlike `monthly.json`'s `Minggu1..Minggu5`) — expenses aren't logged per-week. So unlike the donation kiosk page's "5 week rows per month" layout, this page's Bulan Ini/Bulan Lepas cards are just one big total each, sourced from `ringkasan.perbelanjaan.bulanIni/bulanLepas = { bulan, jumlah }`. Don't try to force a weekly view here — the data doesn't support it.

Verified live against the real `perbelanjaan.json` before considering this done: August 2026 (`bulanIni`) currently shows `jumlah: 0` (legitimately — no expenses logged yet this month, not a bug), and the `graf["2026"].data` array correctly zero-fills months that haven't happened yet (Sep–Dec 2026).

---

## Architecture — The Non-Obvious Bits (carried forward + new)

### Standalone kiosk pages are standalone ON PURPOSE
Every `display/data-*.html` page is a self-contained HTML file with its own inline `<script>`, own `fetch`, own `formatCurrency()`, own Chart.js config — deliberately NOT importing `script.js`. This is a repeated pattern, not an oversight: kiosk/signage displays need to run standalone on a dedicated device without depending on the main site's JS bundle. When adding a new kiosk page, copy the pattern (inline everything) rather than "cleaning it up" to share code with `script.js`.

### The Dual-File Fetch (still true)
`loadDashboard()` fetches `data.json` (projek only) + `monthly.json` (everything else) in parallel. See prior notes below for the full breakdown — unchanged this session.

### Two Timestamps in data.json — still NOT redundant
`projek.TarikhKemaskini` (human update) vs root `tarikhKemaskini` (Apps Script sync). Unchanged.

### Repo topology oddity worth remembering
This checkout's git remote is `multimedia-mamtj6/infaq` (verified via `git remote -v`) — the consumer site. Yet it has an `admin/DEV_NOTES.md` (this file) sitting alone in an otherwise-empty `admin/` folder — not the full admin app (that lives in the *other* repo, `multimedia-mamtj6/dev`, under its own `admin/infaq/`). This file was placed here on purpose as a cross-repo-readable handoff note. Don't be confused into thinking this repo secretly contains the admin app — it doesn't; `Glob admin/**` returns only this one file.

---

## Bugs Found & Fixed (cumulative — evergreen lessons)

### This session: no code bugs found, but one process lesson
A background Explore subagent's inventory report mislabeled `home.html` as "`infaq-pembangunan.html` (repo root)" — wrong filename attached to correct line numbers/content. Caught by cross-checking with a direct `grep -n jsonDataUrl **/*.html` before acting on it. **Lesson: verify a subagent's file-identity claims with your own grep/read before editing anything it points to — trust the content, verify the label.**

### Prior sessions (still evergreen, condensed):
1. **Chart type inherited wrong from copy-paste template** — when building a new chart function by copying an existing one, always double check `type:` isn't leftover from the source. (Fixed: expense charts were `bar`, should've been `line`.)
2. **Google Sheets cells silently add trailing whitespace** — always `.trim()` string values read from Sheets via Apps Script (bit `Bulan` comparisons).
3. **Google Sheets auto-converts year-like numbers to Date objects** — force `String(tahun)` before comparing.
4. **Docs drift from code — code is authoritative.** `CLAUDE.md` had `data.json`'s pre-v3.0.0 schema for a while after the split happened; multiple other docs (`README.md`'s project structure tree, `DEVELOPER.md`'s "Display Pages" table) were found *still* stale as of this session (see doc sweep below). Always verify current file layout with `Glob`/`grep` before trusting any doc's description of "what files exist."

---

## Current Data Files (verified live via curl, 2026-08-28)

| File | Key values right now | Notes |
|---|---|---|
| `data.json` | via `dev.mamtj6.com`, 200 OK | |
| `monthly.json` | via `dev.mamtj6.com`, 200 OK | |
| `perbelanjaan.json` | `bulanIni: {bulan: "OGO", jumlah: 0}`, `tahunIni: {tahun: 2026, jumlah: 83338.5}` | 2026 graf has real Jan–Jun data, correctly zero-filled Jul(partial)–Dec |
| `daily.json` | 200 OK, still zero frontend consumers | unchanged from last session |

All 4 confirmed served with `Cache-Control: no-store` + `Access-Control-Allow-Origin: *` from `dev.mamtj6.com/admin/infaq/data/*.json`.

---

## Documentation Sweep (this session)

User asked to "update all md files" after the two code changes above. Updated for URL/structure accuracy: `CLAUDE.md`, `DEVELOPER.md`, `DATA_STRUCTURE.md`, `README.md`, `CHANGELOG.md` (new `[3.3.0]` entry). **Deliberately left untouched** (no relevant content to update): `USER_GUIDE.md` (donor-facing, no data URLs), `MOSQUE_UPDATE_SUMMARY.md` (closed historical one-off), `images/README.md` (unrelated to data pipeline), `g-appscript/CLAUDE.md` (describes the Apps Script publish target, not the frontend fetch URL — out of scope). If a future session is asked to do a doc sweep again, this same triage logic applies: touch what references what changed, skip what doesn't.

Also flagged but **not fixed** (pre-existing, out of scope for a URL-repoint session): `DATA_STRUCTURE.md`'s "Complete Structure" JSON example still shows the pre-v3.0.0 merged schema (ringkasan/paparanBulanIni/graf all inside one object) — this is the same doc-drift bug `CLAUDE.md` already had fixed once. Worth a dedicated pass if anyone asks about `DATA_STRUCTURE.md` specifically. `APP_VERSION` in `script.js` is still `"3.1.0"` even though `CHANGELOG.md` has been at `3.2.0`/`3.3.0` for two sessions now — nobody bumps it when adding features via CHANGELOG; following that existing (inconsistent) precedent rather than fixing it unprompted.

---

## Quick Reference

```
script.js line 1                          → jsonDataUrl = https://dev.mamtj6.com/admin/infaq/data/data.json
display/data-infaq-pembangunan.html ~268  → own jsonDataUrl (data.json, production)
display/data-tabung-bulanan.html ~176     → own jsonDataUrl (monthly.json, production)
display/data-perbelanjaan-bulanan.html    → own jsonDataUrl (perbelanjaan.json, production) — NEW
display/index.html                        → kiosk chooser, now 3 buttons
script.js ~512  renderExpenseMonthlyChart() → blue line chart, ported inline into the new kiosk page
```

---

## Prior Session Archive (2026-07-25) — still-valid background

### Dev System vs Infaq Repo (historical — URL has since moved to production, but the repo split logic still applies)
| | Main (infaq) | Dev |
|---|---|---|
| GitHub repo | `multimedia-mamtj6/infaq` | `multimedia-mamtj6/dev` |
| Data path | `data/*.json` (legacy, no longer used) | `admin/infaq/data/*.json` (current, now served via Vercel too) |

### normalizeYearGraphData() — Why It Exists
Defensively dedupes duplicate month labels in `graf` entries (from a historical duplicate-row bug in the Perbelanjaan sheet tab) and recomputes cumulative client-side. Still present in `script.js` as a safety net even though current dev data is clean.

### Pages Built 2026-07-25 sprint
- `perbelanjaan/index.html` — expense cumulative report
- `perbelanjaan/bulanan.html` — expense monthly breakdown, source of the chart style ported into this session's new kiosk page
