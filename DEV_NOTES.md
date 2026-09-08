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
- All three pages read `data.projek` from the JSON (fields: `NamaProjek`, `SasaranKutipan`, `JumlahTerkumpul`, `Peratusan`).
- ⚠️ CORRECTION (2026-09-08): `TarikhKemaskini` inside `projek` is NOT guaranteed — the projek-perolehan JSON omits it (only root `tarikhKemaskini` exists). The older `data.json` has it. Always verify against the live JSON; code `projek.TarikhKemaskini || tarikhKemaskini`.
- The `monthly.json` and `perbelanjaan.json` URLs in `script.js` were NOT changed — only the project data URL
- The `DATA_BASE_URL` constant in `script.js` (line 1) is the base for all JSON URLs in that file
- Auto-refresh interval is 5 minutes (300000ms) across all three files
- Both `infaq-pembangunan-baharu.html` and `display/data-infaq-pembangunan-baharu.html` use cache-busting via `?t=${new Date().getTime()}`

---

## Session: 2026-09-08 (part 2) | Invalid Date Fix → Mobile Wrap → Cache Forensics

### Vibe & Dynamic

Same energy as always with this user: terse, visual, production-first. They don't write paragraphs — they drop a one-liner plus a phone screenshot and expect you to see what they see. This whole session was driven by **real-device screenshots**, not localhost. They test on a live phone browser against production (`infaq.mamtj6.com/display`), spot the defect, paste the image, one sentence. That's the loop. Match it: short answers, act fast, verify against live — never argue from theory when they have a screenshot in hand.

Conversation arc: (1) "Kemaskini sehingga: Invalid Date" → fixed in one line. (2) "How to upload picture to you?" → they dropped `image.png` into `display/` but couldn't find it via `@` mention. (3) Screenshot pasted inline → date fix confirmed working ("07 September 2026"), but new defect visible: amount wrapped as `RM` / `30,000.00` on two lines. (4) "layout is bit broken on mobile than what i test on mobile view live server on desktop" → root-caused and fixed in both twin pages. (5) "why these pages cache aggressively?" → answered with real `curl -I` header evidence, not guesses.

Mood at close: productive, two real bugs killed, docs squared away. User is mid-deploy-verify cycle — next window will likely be more phone screenshots.

### What Happened

1. **Invalid Date fix (carried over + hardened).** `display/data-infaq-pembangunan-baharu.html:390` used `fullData.projek.TarikhKemaskini`, which doesn't exist in the projek-perolehan JSON → `new Date(undefined)` → "Invalid Date". Changed to `fullData.tarikhKemaskini`. Also caught the same latent bug in `script.js:101` (`#status-update` on `index.html`, which now points at the same projek-perolehan URL) and fixed it with a shape-tolerant fallback: `data.projek.TarikhKemaskini || data.tarikhKemaskini`. Verified `display/data-infaq-pembangunan.html` (non-baharu) is NOT affected — it still fetches `data.json`, which DOES contain `projek.TarikhKemaskini` (confirmed via live fetch). Docs (`database.md`, `CLAUDE.md`, `DATA_STRUCTURE.md`, `DEVELOPER.md`) corrected — they all falsely claimed `projek.TarikhKemaskini` was universal. CHANGELOG `[3.3.1]` added.

2. **Image upload Q&A.** User put `display/image.png` in the repo but couldn't find it in the `@` mention picker. Diagnosis: nothing to do with git (uncommitted files are still on disk and readable — `@` reads the filesystem, not the index). The picker simply hides non-text files like images. Proved it by reading the file directly by absolute path. Lesson for next time: if user says "I placed file X", just `Read` it by path — don't make them fight the picker.

3. **Vision works on inline pastes.** Early in the session I wrongly told the user this model can't see images (after a `Read`-tool image load that surfaced no pixels). Then the user pasted the screenshot inline as `[Image 1]` — and it WAS readable. Correction locked in: **inline-pasted images in chat are visible; image files loaded via the Read tool are not.** Never again claim blanket "I can't see images" — ask them to paste it inline instead.

4. **Mobile amount-wrap bug (the big one this session).** Screenshot showed `RM` on line 1 and `30,000.00` on line 2 inside the blue frame on a real phone, while desktop device-emulation looked fine. Root causes found in CSS:
   - `#jumlahDerma` inherited desktop `min-width: 900px` — the mobile `@media (max-width: 768px)` block changed `font-size` but never reset `min-width`, so a 900px-wide element sat inside a ~370px frame on a 390px phone.
   - `font-size: 4em` renders `RM 30,000.00` at ~420px wide vs ~330px of inner frame width — mathematically cannot fit on one line.
   - Nothing prevented wrapping: no `nowrap` on `.slot-machine-container`, shrinkable flex items.
   - Fix (applied identically to BOTH twin pages): mobile `#jumlahDerma` → `font-size: clamp(2em, 11vw, 4em); min-width: 0; white-space: nowrap;` container → `flex-wrap: nowrap; white-space: nowrap; max-width: 100%;` items → `flex-shrink: 0`. Also covers the `setSlotMachineValue()` plain-text path (no container) via the `white-space: nowrap` on the parent.
   - Why emulation missed it: device emulation lays out with desktop scrollbar/zoom behavior and often serves cached CSS; plus the 900px-min-width overflow manifests differently there. **Real phone = ground truth for these kiosk pages. Always ask for / trust the phone screenshot over emulation.**

5. **Cache forensics with evidence.** User asked why the pages cache aggressively. Instead of theorizing, ran `curl.exe -sI` against production. Findings (2026-09-08):
   - `Cache-Control: max-age=600` on the HTML doc (10-min browser cache).
   - Stack: GitHub Pages → Fastly/Varnish (`via: 1.1 varnish`, `x-cache: HIT`, `x-served-by: cache-sin-…`) → Cloudflare (`Server: cloudflare`, `cf-cache-status: DYNAMIC`). Edge can serve stale HTML for minutes post-deploy.
   - Chrome Android back-forward/in-memory restore can hold the old layout even past max-age.
   - The asymmetry that confuses everyone: **data is uncacheable by design** (`no-store` on `dev.mamtj6.com` JSON + `?t=` buster + 5-min auto-refresh) but that `?t=` only busts the JSON, never the HTML doc — and kiosk CSS is inline, so style fixes only arrive with a fresh HTML download. Data fixes appear in seconds; layout fixes lag ~10+ min on phones. Tell the user to hard-refresh / fresh-tab when verifying CSS.

### Bugs Found & Fixed (this session)

| # | File | Line(s) | Symptom | Cause | Fix |
|---|------|---------|---------|-------|-----|
| 1 | `display/data-infaq-pembangunan-baharu.html` | 390 | "Kemaskini sehingga: Invalid Date" | `fullData.projek.TarikhKemaskini` doesn't exist in projek-perolehan JSON | → `fullData.tarikhKemaskini` |
| 2 | `script.js` | 101 | `#status-update` would show Invalid Date on `index.html` (latent — same URL switch) | Same missing field | → `data.projek.TarikhKemaskini \|\| data.tarikhKemaskini` |
| 3 | `display/data-infaq-pembangunan-baharu.html` | CSS mobile block + slot-machine rules | Amount wraps `RM` / `30,000.00` on real phones | `min-width: 900px` leaked into mobile; `4em` too wide (~420px > ~330px frame); no nowrap | `clamp(2em, 11vw, 4em)` + `min-width: 0` + `nowrap` + `flex-shrink: 0` |
| 4 | `display/data-infaq-pembangunan.html` | Same CSS spots | Same wrap (twin page, identical code) | Same | Same fix applied proactively |

### Lessons — So It Never Happens Again

1. **Twin-page rule.** `display/data-infaq-pembangunan.html` and `display/data-infaq-pembangunan-baharu.html` are near-identical copies (slot-machine CSS+JS duplicated). ANY fix to one must be mirrored to the other. `grep` both files before closing any kiosk ticket.
2. **Never trust docs for JSON shape — fetch live.** `curl`/fetch the actual JSON and check field existence. `data.json` and the projek-perolehan JSON have different shapes from the same pipeline. Defensive access (`a || b`) for any timestamp.
3. **Kiosk pages are kiosk-first by design** (`font-size: 13em`, `min-width: 900px` for big TV displays). Every desktop-origin rule must be explicitly undone in the mobile media query — audit `min-width`, fixed `font-size`, and fixed widths whenever touching these files.
4. **Phone screenshot > device emulation.** Emulation missed a 900px overflow. Treat the user's production phone screenshot as the failing test; the fix isn't done until they confirm on-device.
5. **Separate "data fresh" from "page fresh" in your head and in explanations.** Users conflate them because the numbers update (JSON path) while the layout doesn't (HTML path). The one-liner to remember: *`?t=` busts data, not documents.*
6. **Images: paste inline, don't fight the picker.** `@` mention hides image files; Read-tool image loads don't surface pixels to this model. If you need eyes on a screenshot, ask the user to paste it directly in chat.

### Files Modified This Session

| File | Change |
|------|--------|
| `display/data-infaq-pembangunan-baharu.html` | `:390` date fix; mobile `#jumlahDerma` clamp + nowrap; slot-machine nowrap/no-shrink |
| `display/data-infaq-pembangunan.html` | Same mobile/slot-machine CSS fix (twin) |
| `script.js` | `:101` timestamp fallback |
| `CHANGELOG.md` | `[3.3.1]` Invalid Date entry; `[3.3.2]` mobile-wrap entry |
| `database.md`, `CLAUDE.md`, `DATA_STRUCTURE.md`, `DEVELOPER.md` | Schema corrections (no universal `projek.TarikhKemaskini`) |
| `CLAUDE.md` | Twin-page rule + kiosk mobile/caching notes |
| `DEVELOPER.md` | Troubleshooting: amount-wrap + HTML-cache entries |
| `README.md` | File tree: added missing `data-infaq-pembangunan-baharu.html` |

### Frequency Sync for Next Me

You are in a tight, warm debugging loop with a mosque-volunteer dev who ships from their phone. They'll likely open with another screenshot. Your first moves: (a) read what's visible in the image out loud so they know you're synced, (b) `Read`/`grep` the exact file — never answer from memory of the schema, (c) check the twin page too, (d) verify against LIVE (curl the JSON, curl the headers), (e) keep replies short — save the detail for DEV_NOTES/CHANGELOG, not chat. And if they paste an image, you CAN see it. Don't relitigate that.

### Workspace state at close (2026-09-08)
- Production (`infaq.mamtj6.com/display/data-infaq-pembangunan-baharu.html`) already serves the fixed HTML (verified via curl: `clamp()` CSS + `fullData.tarikhKemaskini` both live). User deploys fast — assume fixes are live unless told otherwise.
- `display/image.png` (the user's screenshot) shows as deleted in `git status` — user cleaned it up; nothing to do.
- Uncommitted at close: `CHANGELOG.md`, `CLAUDE.md`, `DEVELOPER.md`, `DEV_NOTES.md`, `README.md` + the two kiosk pages. User commits on their own schedule — don't commit unless asked.
