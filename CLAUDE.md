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
3. **Data Hosting**: JSON hosted on GitHub raw URL
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

Data is fetched from:
```javascript
const jsonDataUrl = "https://raw.githubusercontent.com/multimedia-mamtj6/infaq/main/data/data.json";
```

JSON schema (see DATA_STRUCTURE.md for complete details):
```json
{
  "projek": {
    "NamaProjek": "string",
    "SasaranKutipan": number,
    "JumlahTerkumpul": number,
    "Peratusan": number
  },
  "ringkasan": {
    "kutipan": {
      "bulanIni": { "bulan": "string", "jumlah": number },
      "bulanLepas": { "bulan": "string", "jumlah": number },
      "tahunIni": { "tahun": "string", "jumlah": number }
    }
  },
  "paparanBulanIni": {
    "Minggu1": number,
    "Minggu2": number,
    "Minggu3": number,
    "Minggu4": number,
    "Minggu5": number
  },
  "graf": {
    "2025": {
      "tahun": "2025",
      "labels": ["Jan", "Feb", ...],
      "data": [number, ...]
    }
  },
  "tarikhKemaskini": "ISO 8601 date string"
}
```

### Key Functions in script.js

- `loadDashboard()` - Fetches data and updates dashboard (index.html)
- `loadReport()` - Fetches data and renders charts (tabung-bulanan.html)
- `formatCurrency(amount)` - Formats numbers as Malaysian Ringgit
- `set(id, value)` - Safely updates element text content
- `stopLoading()` - Removes skeleton loading states
- `renderWeeklyChart(data)` - Renders weekly collection bar chart
- `renderMonthlyChart(data)` - Renders monthly trend line chart

## Page Structure

### Main Dashboard (index.html)
- Displays current project progress with animated progress bar
- Shows monthly and yearly collection statistics
- Provides navigation to 4 donation methods
- Auto-refreshes data every 5 minutes

### Donation Pages
- `infaq-transfer.html` - Bank transfer with copy-to-clipboard
- `infaq-qr.html` - QR Pay (DuitNow) scanning
- `toyyib-pay.html` - Online payment (UI only, not yet integrated)
- `infaq-tabung.html` - Physical donation box with location map

### Reports Page (tabung-bulanan.html)
- Weekly collection breakdown (bar chart)
- Monthly trends visualization (line chart)
- Uses Chart.js for rendering

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

Edit `script.js` line 1:
```javascript
const jsonDataUrl = "YOUR_NEW_URL_HERE";
```

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
