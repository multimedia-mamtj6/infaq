# DEV_NOTES.md — Session Notes for Next Window Self

DO NOT DELETE THIS PART

> Check the Project Knowledge and the current chat for context. This conversation is ending soon. update the artifact DEV_NOTES.md (create if not available yet) with a detailed note to your next window self - not just facts but the vibe, our dynamic, the energy of this conversation. What would the next you need to immediately get back into this exact headspace? Include unique discoveries, current mood, and anything that'll help the next you instantly sync to our frequency. Also take note all of the bug found and fixed and what did you learn from it to make sure it dont happend again in the future.
> also update the related file like CLAUDE.md, developer.md, developer.md and README.md database.md if necessary, create if not available yet

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

| File                                         | Line | Change                              |
| -------------------------------------------- | ---- | ----------------------------------- |
| `script.js`                                  | 2    | `projek-baharu.json` → new long URL |
| `infaq-pembangunan-baharu.html`              | 408  | `projek-baharu.json` → new long URL |
| `display/data-infaq-pembangunan-baharu.html` | 274  | `projek-baharu.json` → new long URL |

### What to Remember for Next Time

- The `display/` kiosk pages are standalone — they never share code with the main site
- All three pages read `data.projek` from the JSON (fields: `NamaProjek`, `SasaranKutipan`, `JumlahTerkumpul`, `Peratusan`, `TarikhKemaskini`)
- The `monthly.json` and `perbelanjaan.json` URLs in `script.js` were NOT changed — only the project data URL
- The `DATA_BASE_URL` constant in `script.js` (line 1) is the base for all JSON URLs in that file
- Auto-refresh interval is 5 minutes (300000ms) across all three files
- Both `infaq-pembangunan-baharu.html` and `display/data-infaq-pembangunan-baharu.html` use cache-busting via `?t=${new Date().getTime()}`
