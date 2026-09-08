# DEV_NOTES.md — Session Notes for Next Window Self

## Session: 2026-09-07 | Data Source Migration

### Vibe & Dynamic
Chill, focused session. User knows their codebase well — they speak in file names and line numbers, not explanations. Trust level is high; they don't need hand-holding. When they say "update X to Y", they mean it literally. No ambiguity. The energy is "let's get this done and move on."

User reads code themselves before asking — they already understand the architecture. They came in with a specific task (switch the JSON data URL) and we nailed it in one pass.

### What Happened
1. **Explained data flow** across three files that fetch project data:
   - `infaq-pembangunan-baharu.html` (self-contained inline script)
   - `display/data-infaq-pembangunan-baharu.html` (self-contained kiosk page)
   - `index.html` (loads `script.js` which has the shared logic)

2. **Key discovery**: `script.js` line 2 had already been updated from `data.json` to `projek-baharu.json` at some point — so `index.html` was already on the same source as the Baharu pages. All three pointed to `projek-baharu.json`.

3. **Data URL swap**: User requested updating all three from `projek-baharu.json` to the new long-form URL:
   ```
   projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json
   ```
   This is for the "Projek Perolehan Tanah Perkuburan Kariah Masjid Al-Mukhlisin, Taman Jaya 6" — a cemetery land acquisition project.

4. **Updated all 3 files** in parallel:
   - `script.js:2` — `jsonDataUrl` line
   - `infaq-pembangunan-baharu.html:408` — inline `jsonDataUrl`
   - `display/data-infaq-pembangunan-baharu.html:274` — inline `jsonDataUrl`

### Bug Found & Fixed
**No actual bugs found this session.** The URL update was a configuration change, not a bug fix. But the session reinforced an important lesson:

### Critical Lesson: Multi-File Data Source Updates
**THE PATTERN**: When changing the JSON data URL, you MUST edit **three separate locations** because:
1. `script.js` — shared by `index.html`, `tabung-bulanan.html`, and other pages that import it
2. `infaq-pembangunan-baharu.html` — has its own inline `<script>` block, does NOT use `script.js`
3. `display/data-infaq-pembangunan-baharu.html` — standalone kiosk page, also has its own inline script

**WHY THIS IS DANGEROUS**: The display/kiosk pages are deliberately decoupled from `script.js` so a kiosk device isn't coupled to the main site's JS bundle. But this means every data URL change requires finding and updating ALL inline scripts. Missing one means the kiosk shows stale data while the website shows new data.

**PREVENTION RULE**: Before committing any data URL change, always `grep` for the old URL across the entire repo:
```bash
rg "projek-baharu.json" --include "*.html" --include "*.js"
```
If any results come back, those files also need updating.

### Files Modified This Session
| File | Line | Change |
|------|------|--------|
| `script.js` | 2 | `projek-baharu.json` → new long URL |
| `infaq-pembangunan-baharu.html` | 408 | `projek-baharu.json` → new long URL |
| `display/data-infaq-pembangunan-baharu.html` | 274 | `projek-baharu.json` → new long URL |

### What to Remember for Next Time
- The `display/` kiosk pages are standalone — they never share code with the main site
- All three pages read `data.projek` from the JSON (fields: `NamaProjek`, `SasaranKutipan`, `JumlahTerkumpul`, `Peratusan`, `TarikhKemaskini`)
- The `monthly.json` and `perbelanjaan.json` URLs in `script.js` were NOT changed — only the project data URL
- The `DATA_BASE_URL` constant in `script.js` (line 1) is the base for all JSON URLs in that file
- Auto-refresh interval is 5 minutes (300000ms) across all three files
- Both `infaq-pembangunan-baharu.html` and `display/data-infaq-pembangunan-baharu.html` use cache-busting via `?t=${new Date().getTime()}`

---

## Session: 2026-09-08 | "Invalid Date" Bug Fix

### Vibe & Dynamic
Short, surgical session. User spotted "Invalid Date" on the kiosk page and reported it. Quick diagnosis, one-line fix. The energy was "this is broken, fix it" — no preamble, no fluff. Trust level remains high; they already had the file open when they came in.

### What Happened
1. **Bug report**: `display/data-infaq-pembangunan-baharu.html` showed `Kemaskini sehingga: Invalid Date` in the "Kemaskini sehingga:" line.

2. **Root cause diagnosis**: Fetched the live JSON from the server and discovered the actual data structure differs from what the documentation claims:
   - **Actual JSON** from `projek-perolehan-tanah-...json`:
     ```json
     {
       "projek": { "NamaProjek": "...", "SasaranKutipan": 200000, "JumlahTerkumpul": 30000, "Peratusan": 15 },
       "paparanHarian": [...],
       "tarikhKemaskini": "2026-09-07T13:54:08.402Z"
     }
     ```
   - **No `TarikhKemaskini` inside `projek`** — it only exists at the root level.

3. **Code bug** (line 390): `new Date(fullData.projek.TarikhKemaskini)` → `fullData.projek.TarikhKemaskini` is `undefined` → `new Date(undefined)` → `Invalid Date`.

4. **Fix applied**: Changed line 390 from `fullData.projek.TarikhKemaskini` to `fullData.tarikhKemaskini`.

### Bug Found & Fixed
**Bug: Invalid Date on Projek Baharu kiosk page**
- **File**: `display/data-infaq-pembangunan-baharu.html`, line 390
- **Cause**: Code referenced `fullData.projek.TarikhKemaskini` but the JSON doesn't have `TarikhKemaskini` inside the `projek` object
- **Symptom**: "Kemaskini sehingga: Invalid Date" displayed on the kiosk page
- **Fix**: Changed to `fullData.tarikhKemaskini` (root-level timestamp)
- **Impact**: Only affects display date — all other data (amount, percentage, target) loaded fine

### Critical Discovery: Documentation vs Reality Mismatch
**This is the big one.** The docs (CLAUDE.md, DATA_STRUCTURE.md, database.md, DEVELOPER.md) all claim `projek.TarikhKemaskini` exists in the JSON. It doesn't in the actual live data.

**What the docs say:**
```json
{
  "projek": {
    "NamaProjek": "...",
    "SasaranKutipan": number,
    "JumlahTerkumpul": number,
    "Peratusan": number,
    "TarikhKemaskini": "ISO 8601"  // ← CLAIMED
  },
  "tarikhKemaskini": "ISO 8601"
}
```

**What the actual JSON has:**
```json
{
  "projek": {
    "NamaProjek": "...",
    "SasaranKutipan": 200000,
    "JumlahTerkumpul": 30000,
    "Peratusan": 15
    // ← NO TarikhKemaskini
  },
  "paparanHarian": [...],  // ← Undocumented field!
  "tarikhKemaskini": "2026-09-07T13:54:08.402Z"
}
```

**Possible explanations:**
1. The Apps Script was changed at some point and stopped including `projek.TarikhKemaskini`
2. The Google Sheet's Projek sheet B5 cell is empty, so Apps Script skips it
3. This is a different JSON file (`projek-perolehan-tanah-...`) from the original `data.json` — maybe the Apps Script template for this file was never configured to include `projek.TarikhKemaskini`

**What this means for code:**
- `display/data-infaq-pembangunan.html` (non-baharu) was changed in v3.0.1 to use `fullData.projek.TarikhKemaskini` — it probably has the SAME BUG but nobody noticed because the non-baharu project might have a different JSON source that DOES include it. Or it's also broken and nobody reported it yet.
- `script.js` line ~96 uses `data.projek.TarikhKemaskini` for `#status-update` — might also be broken. Need to verify.
- `script.js` line ~109 uses `data.tarikhKemaskini` for `#last-update` — this one is fine (root level).

**Lesson learned:** Never trust documentation for JSON schema — always fetch the actual live JSON and verify field existence before coding against it. The docs were written when the schema was designed, but the Apps Script may have diverged.

### Files Modified This Session
| File | Line | Change |
|------|------|--------|
| `display/data-infaq-pembangunan-baharu.html` | 390 | `fullData.projek.TarikhKemaskini` → `fullData.tarikhKemaskini` |
| `script.js` | 101 | `data.projek.TarikhKemaskini` → `data.projek.TarikhKemaskini \|\| data.tarikhKemaskini` (safe fallback) |

### Files Updated (Documentation)
| File | Change |
|------|--------|
| `DEV_NOTES.md` | Added session notes |
| `CHANGELOG.md` | Added v3.3.1 entry |
| `database.md` | Corrected JSON schema (removed `projek.TarikhKemaskini`, noted root timestamp) |
| `CLAUDE.md` | Updated JSON schema to match actual data |
| `DATA_STRUCTURE.md` | Fixed schema examples |
| `DEVELOPER.md` | Fixed quick reference JSON shape |

### What to Remember for Next Time
1. **ALWAYS fetch the live JSON** before coding against it — docs lie, especially when Apps Script is involved
2. **`projek.TarikhKemaskini` does NOT exist** in the projek-perolehan JSON — any code referencing it will produce `Invalid Date`
3. **`data.json` DOES have `projek.TarikhKemaskini`** — different JSON files have different shapes!
4. **The root `tarikhKemaskini` is the only universal timestamp** — exists in both JSON files
5. **`display/data-infaq-pembangunan.html`** (non-baharu) uses `data.json` → has `projek.TarikhKemaskini` → no bug there
6. **`script.js`** now uses projek-perolehan URL → was broken, fixed with `||` fallback
7. **`paparanHarian`** is an undocumented field in the projek-perolehan JSON — not harmful but worth noting
8. **Different JSON files from the same Apps Script can have different shapes** — always verify per-file
