# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MAMTJ6 Infaq Center is a static website for managing and facilitating donations (infaq) for Masjid Al-Mukhlisin, Taman Jaya 6. The project is built using vanilla HTML/CSS/JavaScript with CDN-hosted dependencies - no build process required.

## Development Setup

### Running the Project

This is a static website with no build process. To run locally:

```bash
# Option 1: Python HTTP Server
python -m http.server 8000

# Option 2: Node.js serve
npx serve

# Option 3: Direct file access
# Simply open index.html in a browser
```

Access via `http://localhost:8000` or by opening `index.html` directly.

### No Dependencies to Install

All dependencies are loaded via CDN:
- Tailwind CSS (styling)
- Phosphor Icons (iconography)
- Chart.js (used in reports page)

## Architecture

### Data Flow

The application follows a simple data-driven architecture:

1. **Data Source**: Google Sheets (manually updated by administrators)
2. **Data Export**: Sheets exported to JSON format
3. **Data Hosting**: JSON published from the `multimedia-mamtj6/dev` repo, served in production via Vercel at `dev.mamtj6.com` (raw GitHub URL as fallback if the Vercel deploy is behind)
4. **Data Fetching**: `script.js` fetches JSON via Fetch API
5. **Data Display**: DOM manipulation updates the UI
6. **Auto-Refresh**: Data refreshes every 5 minutes

### Core Files

- `index.html` - Main dashboard showing project progress and collection statistics
- `script.js` - Handles data fetching, DOM updates, and chart rendering
- `style.css` - Custom CSS for animations and utilities
- `infaq-*.html` - Individual donation method pages (transfer, QR, billplz, tabung)
- `tabung-bulanan.html` - Monthly reports page with charts

### Data Structure

Data source (single line controls all JSON URLs via `.replace('data.json', '...')`):
```javascript
// script.js line 2
const jsonDataUrl = "https://dev.mamtj6.com/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json";
```
Fallback if the production endpoint 404s or CORS-fails (Vercel deploy lag): `https://raw.githubusercontent.com/multimedia-mamtj6/dev/main/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json`.

**Note**: The `display/` kiosk pages (below) do **not** share this variable — each one hardcodes its own separate `jsonDataUrl` in an inline `<script>` block, since they're standalone pages designed to run without depending on `script.js`.

**Projek Baharu pages**: There are two dedicated pages for the project data (formerly called "Projek Baharu", now pointing to the cemetery land acquisition project). Each page is fully self-contained with its own `jsonDataUrl` pointing to `https://dev.mamtj6.com/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json`. Both expect a JSON with the same `projek` shape as below. **Note: `script.js` also points to this same URL now** — all three locations were updated on 2026-09-07:
- `infaq-pembangunan-baharu.html` — Website page (nav tab "Projek Baharu"). Self-contained inline script (does not use `script.js`), updates `project-*`, `status-update`, `last-update`.
- `display/data-infaq-pembangunan-baharu.html` — Display/kiosk page (menu button "Projek Baharu" in `display/index.html`). Same slot-machine animation as `display/data-infaq-pembangunan.html`.

The dashboard fetches **two files in parallel** (see `loadDashboard()`, script.js line 49):
- `data.json` → project info only
- `monthly.json` → all collection statistics

**Project data file** (what `script.js` and the Baharu pages fetch — the projek-perolehan JSON). **Verified live 2026-09-08:**
```json
{
  "projek": {
    "NamaProjek": "string",
    "SasaranKutipan": number,
    "JumlahTerkumpul": number,
    "Peratusan": number
  },
  "paparanHarian": [ { "tarikh": "string", "jumlah": number, "keterangan": "string" } ],
  "tarikhKemaskini": "ISO 8601"
}
```
> **⚠️ IMPORTANT:** This projek-perolehan JSON does **NOT** include `projek.TarikhKemaskini` — only the root `tarikhKemaskini` exists. Any code referencing `projek.TarikhKemaskini` will produce `Invalid Date` (a bug fixed 2026-09-08 in `script.js:101` and `display/data-infaq-pembangunan-baharu.html:390`). The older `data.json` file DOES have `projek.TarikhKemaskini`; different Apps Script exports can have different shapes, so always verify against the live JSON.
Note: `script.js` falls back safely: `data.projek.TarikhKemaskini || data.tarikhKemaskini` for `#status-update`. Root `tarikhKemaskini` = when Apps Script synced (used for `#last-update` footer).

**`data/monthly.json`** (collection statistics):
```json
{
  "ringkasan": {
    "kutipan": {
      "bulanIni": { "bulan": "string", "jumlah": number },
      "bulanLepas": { "bulan": "string", "jumlah": number },
      "tahunIni": { "tahun": number, "jumlah": number },
      "tahunLepas": { "tahun": number, "jumlah": number }
    }
  },
  "paparanBulanIni": { "Tahun": number, "Bulan": "string", "Minggu1": number, ..., "Minggu5": number, "JumlahBulanan": number },
  "paparanBulanLepas": { ... },
  "graf": { "2024": { "tahun": "2024", "labels": [...], "data": [...] }, "2025": {...}, "2026": {...} },
  "tarikhKemaskini": "ISO 8601"
}
```

**`data/perbelanjaan.json`** (expense report):
```json
{
  "ringkasan": { "perbelanjaan": { "tahunIni": {...}, "tahunLepas": {...}, "bulanIni": {...}, "bulanLepas": {...} } },
  "paparanBulanIni": { "Tahun": number, "Bulan": "string", "Jumlah": number, "JumlahKumulatif": number },
  "paparanBulanLepas": { ... },
  "graf": { "2025": { "tahun": "2025", "labels": [...], "data": [...], "dataKumulatif": [...] }, ... },
  "tarikhKemaskini": "ISO 8601"
}
```

**`data/daily.json`** — published but not yet consumed by any frontend page. Reserved for future daily tracker.

### Key Functions in script.js

- `loadDashboard()` - Fetches `data.json` + `monthly.json` in parallel, updates dashboard (index.html)
- `loadReport()` - Fetches `monthly.json`, renders charts (tabung-bulanan.html)
- `loadPerbelanjaanReport()` - Fetches `perbelanjaan.json`, renders expense charts (perbelanjaan/bulanan.html)
- `normalizeYearGraphData(yearData)` - Dedupes duplicate month labels, recomputes cumulative client-side (defensive against Sheets duplicate-row bugs)
- `formatCurrency(amount)` - Formats numbers as Malaysian Ringgit
- `set(id, value)` - Safely updates element text content
- `stopLoading()` - Removes skeleton loading states
- `renderWeeklyChart(data)` - Renders weekly collection bar chart
- `renderMonthlyChart(data)` - Renders monthly trend line chart
- `renderExpenseMonthlyChart(data)` - Renders expense monthly line chart
- `renderExpenseCumulativeChart(data)` - Renders cumulative expense line chart

## Page Structure

### Main Dashboard (index.html)
- Displays current project progress with animated progress bar
- Shows monthly and yearly collection statistics
- Provides navigation to 4 donation methods
- Auto-refreshes data every 5 minutes

### Donation Pages
- `opt/infaq-transfer.html` - Bank transfer with copy-to-clipboard
- `opt/infaq-qr.html` - QR Pay (DuitNow) scanning
- `opt/toyyib-pay.html` - Online payment (UI only, not yet integrated)
- `opt/infaq-tabung.html` - Physical donation box with location map

### Expense Report Pages
- `perbelanjaan/index.html` - Cumulative expense report (current year + past-years dropdown)
- `perbelanjaan/bulanan.html` - Monthly expense breakdown with line charts
- Reachable by direct URL only — nav tabs on other pages still show "AKAN DATANG" (intentional)

### Utility Bill Payment Page (`utiliti/index.html`)
Allows donors to pay the masjid's utility bills directly via JomPAY as infaq. Three tabs — Air, Elektrik, Internet — each showing the masjid's official account number and JomPAY biller code.

**Account details (Penama Akaun):**
| Utility | Provider | Nombor Akaun | Biller JomPAY | Penama Akaun |
|---|---|---|---|---|
| Air | PAIP | 0325-4146-23 | 51987 | PENGERUSI SURAU, BADAN KEBAJIKAN TAMAN JAYA 6 |
| Elektrik | TNB | 2207-4045-5605 | 5454 | SETIAUSAHA BADAN KEBAJIKAN TAMAN JAYA 6 |
| Internet | Unifi (TM) | 1075-7173-12 | 8888 | MASJID AL-MUKHLISIN |

**Tab colour palettes:**
- Air (PAIP): `sky-600 → slate-900`, tints `sky-200`
- Elektrik (TNB): `blue-700 → #020617`, tints `blue-200`
- Internet (Unifi): `#ff6910 → #3d1000`, tints `orange-200`

**Provider logos**: Served from `dev.mamtj6.com/media/logo-luar/{paip,tnb,unifi,pahanggo}/PNG/`

**Alternative channels:**
- PAIP → PahangGo app (`pahanggo.com/product.html`)
- TNB → TNB Express Quickpay (`myaccount.mytnb.com.my/payment/quickpay`)
- Unifi → Unifi Selfcare (`selfcare.unifi.com.my/billing/pay-for-anyone`), email: `masjidalmukhlisintamanjaya6@gmail.com`

### Reports Page (tabung-bulanan.html)
- Weekly collection breakdown (bar chart)
- Monthly trends visualization (line chart)
- Uses Chart.js for rendering

### Kiosk/Display Pages (`display/`)
Fullscreen standalone signage pages for physical displays at the mosque, reachable via `display/index.html`'s "Menu Paparan Digital" chooser. Each page is self-contained — its own inline `<script>`, own `jsonDataUrl`, own `fetch`/`formatCurrency`/chart config — deliberately **not** importing `script.js`, so a kiosk device isn't coupled to the main site's JS bundle.

- `display/index.html` - Kiosk menu chooser with 4 buttons
- `display/data-infaq-pembangunan.html` - Fetches `data.json`, project fund progress with slot-machine number animation
- `display/data-infaq-pembangunan-baharu.html` - Fetches `projek-baharu.json` (`https://dev.mamtj6.com/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json`), same slot-machine animation. See "Projek Baharu pages" above.
- `display/data-tabung-bulanan.html` - Fetches `monthly.json`, weekly/monthly donation totals + yearly trend chart
- `display/data-perbelanjaan-bulanan.html` - Fetches `perbelanjaan.json`, monthly expense totals + yearly exact-monthly trend chart (blue line, same styling as `renderExpenseMonthlyChart()` in `script.js`)
- `display/data-tabung-bulanan-ori.html`, `display/old/*.html` - Orphaned/archived, not linked from any nav — left on legacy URLs intentionally

**Twin-page rule:** `display/data-infaq-pembangunan.html` and `display/data-infaq-pembangunan-baharu.html` are near-identical copies (slot-machine CSS+JS duplicated). Any fix to one MUST be mirrored to the other.

**Kiosk mobile caveat:** these pages are kiosk-first (`font-size: 13em`, `min-width: 900px` for big TV displays). The mobile media query must explicitly undo every desktop-origin rule — mobile `#jumlahDerma` uses `clamp(2em, 11vw, 4em)` + `min-width: 0` + `nowrap` (fixed 2026-09-08 after the amount wrapped on real phones; desktop emulation did not reproduce it — trust on-device screenshots).

**Page caching:** HTML docs serve `Cache-Control: max-age=600` via GitHub Pages → Fastly/Varnish → Cloudflare edge (verified 2026-09-08). The `?t=` buster and 5-min auto-refresh apply to JSON data only, never to the HTML document (kiosk CSS is inline) — so data fixes show in seconds but layout fixes can lag ~10+ min on phones. Hard-refresh / fresh tab when verifying CSS changes.

## Design System

### Responsive Breakpoints
- Mobile-first approach
- Split layout activates at `lg` (1024px)
- Single column stack on mobile, two columns on desktop

### Color Scheme
- Primary Blue: `#3b82f6` (Bank Transfer)
- Green: `#10b981` (QR Pay)
- Purple: `#9333ea` (Billplz)
- Orange: `#f59e0b` (Physical Tabung)

### UI Patterns
- Skeleton loading states with shimmer animation (`.skeleton` class)
- Fade-in animations for content (`.fade-in-up`)
- Glassmorphism effects on cards
- Toast notifications for user feedback

## Common Tasks

### Updating Data

Data updates happen through Google Sheets:
1. Update Google Sheets with new donation data
2. Export to JSON format
3. Upload JSON to GitHub repository at `data/data.json`
4. Website auto-fetches updated data (cached for 5 minutes)

### Adding a New Donation Method

1. Copy an existing donation page (e.g., `infaq-transfer.html`)
2. Update page content, colors, and functionality
3. Add navigation button in `index.html` dashboard
4. Ensure back button links correctly

### Modifying Bank Account Details

Edit `infaq-transfer.html`:
- Update account number display (line ~153)
- Update `copyToClipboard()` parameter (line ~164)

### Changing the Data Source URL

Edit `script.js` line 2:
```javascript
const jsonDataUrl = "YOUR_NEW_URL_HERE";
```
This does **not** repoint the `display/` kiosk pages — each one has its own hardcoded `jsonDataUrl` that must be edited separately (see "Kiosk/Display Pages" above).

### Configuring the Projek Baharu pages

The two **Projek Baharu** pages both read the new project's JSON at:
- `https://dev.mamtj6.com/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json`

Both expect a JSON with a single `projek` object (`NamaProjek`, `SasaranKutipan`, `JumlahTerkumpul`, `Peratusan`) plus the root `tarikhKemaskini`. Note `projek.TarikhKemaskini` is NOT present in this JSON (only root `tarikhKemaskini`) — see schema warning above. To change the source, edit the `jsonDataUrl` line in `infaq-pembangunan-baharu.html`, `display/data-infaq-pembangunan-baharu.html`, **and** `script.js`.

## Testing

### Browser Compatibility
Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Testing Checklist
- Verify data loads correctly
- Check skeleton loaders disappear after data loads
- Test copy-to-clipboard functionality (requires HTTPS or localhost)
- Verify charts render on reports page
- Test responsive layout on mobile/tablet/desktop
- Check all navigation links work

### Common Issues

**Data not loading:**
- Check browser console for fetch errors
- Verify JSON URL is accessible
- Test JSON validity at jsonlint.com
- Clear browser cache (Ctrl+Shift+R)

**Skeleton loaders not disappearing:**
- Verify `stopLoading()` is called
- Check if data fetch succeeded
- Ensure element IDs match between HTML and JavaScript

**Charts not rendering:**
- Verify Chart.js CDN is loaded
- Check `labels` and `data` arrays have same length
- Ensure canvas element exists with correct ID

## Code Conventions

### HTML
- Use semantic HTML5 elements
- Indent with 4 spaces
- Add comments for major sections
- Use meaningful IDs (e.g., `project-name`, `val-month-curr`)

### CSS
- Prefer Tailwind utility classes
- Custom CSS only for animations in `style.css`
- Group related utility classes together

### JavaScript
- Use ES6+ syntax (arrow functions, const/let, template literals)
- Prefer `const` over `let`
- Handle errors gracefully with try-catch
- Add descriptive function comments
- Use `formatCurrency()` for all money displays

### File Naming
- Use lowercase with hyphens: `infaq-transfer.html`
- Prefix donation pages with `infaq-`
- Be descriptive: `tabung-bulanan.html` not `report.html`

## Important Notes

### Deployment
- This is a static site - can be hosted anywhere
- Recommended: GitHub Pages, Netlify, or Vercel
- No environment variables needed
- All configuration is in-code

### Language
- Primary language is Malay (Bahasa Malaysia)
- Variable names in data are in Malay (e.g., `NamaProjek`, `JumlahTerkumpul`)
- UI text is bilingual where appropriate

### Future Enhancements Planned
- Billplz payment integration (currently UI only)
- Project details page (`display/infaq-pembangunan.html`)
- Donor leaderboard
- Dark mode support
- Multi-language toggle

## Documentation References

- `README.md` - Project overview and quick start
- `DEVELOPER.md` - Detailed technical documentation
- `DATA_STRUCTURE.md` - Complete data schema and Google Sheets guide
- `USER_GUIDE.md` - User-facing donation guide (bilingual)
- `CHANGELOG.md` - Version history
