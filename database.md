# database.md — Data Source Registry

> Central reference for all JSON data sources used by the MAMTJ6 Infaq Center.

---

## Active Data Sources

### 1. Project Data (Projek Perolehan Tanah Perkuburan)

**URL:**
```
https://dev.mamtj6.com/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json
```

**Fallback:**
```
https://raw.githubusercontent.com/multimedia-mamtj6/dev/main/admin/infaq/data/projek-perolehan-tanah-perkuburan-kariah-masjid-al-mukhlisin-taman-jaya-6_0e3ddefc-abef-4059-82bf-c6777994459c.json
```

**Consumed by:**
| File | How | Line |
|------|-----|------|
| `script.js` | `jsonDataUrl` constant | 2 |
| `infaq-pembangunan-baharu.html` | Inline `<script>` | 408 |
| `display/data-infaq-pembangunan-baharu.html` | Inline `<script>` | 274 |

**JSON shape:**
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

> **⚠️ IMPORTANT (verified live 2026-09-08):** This JSON does **NOT** contain `projek.TarikhKemaskini`. The only timestamp is the root-level `tarikhKemaskini`. Any code referencing `projek.TarikhKemaskini` will get `Invalid Date`. (The original `data.json` file DOES have `projek.TarikhKemaskini` — different JSON files from the Apps Script can have different shapes.)

**Updated:** 2026-09-07 (switched from `projek-baharu.json`); schema note added 2026-09-08

---

### 2. Monthly Collection Statistics

**URL:**
```
https://dev.mamtj6.com/admin/infaq/data/monthly.json
```

**Fallback:**
```
https://raw.githubusercontent.com/multimedia-mamtj6/dev/main/admin/infaq/data/monthly.json
```

**Consumed by:**
| File | How |
|------|-----|
| `script.js` | `monthlyDataUrl` constant (line 3) |
| `display/data-tabung-bulanan.html` | Inline `<script>` |
| `tabung-bulanan.html` | Via `script.js` |

**JSON shape:**
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

---

### 3. Expense Report

**URL:**
```
https://dev.mamtj6.com/admin/infaq/data/perbelanjaan.json
```

**Fallback:**
```
https://raw.githubusercontent.com/multimedia-mamtj6/dev/main/admin/infaq/data/perbelanjaan.json
```

**Consumed by:**
| File | How |
|------|-----|
| `script.js` | `perbelanjaanDataUrl` constant (line 4) |
| `perbelanjaan/index.html` | Via `script.js` |
| `perbelanjaan/bulanan.html` | Via `script.js` |
| `display/data-perbelanjaan-bulanan.html` | Inline `<script>` |

**JSON shape:**
```json
{
  "ringkasan": { "perbelanjaan": { "tahunIni": {...}, "tahunLepas": {...}, "bulanIni": {...}, "bulanLepas": {...} } },
  "paparanBulanIni": { "Tahun": number, "Bulan": "string", "Jumlah": number, "JumlahKumulatif": number },
  "paparanBulanLepas": { ... },
  "graf": { "2025": { "tahun": "2025", "labels": [...], "data": [...], "dataKumulatif": [...] }, ... },
  "tarikhKemaskini": "ISO 8601"
}
```

---

### 4. Daily Tracker (Published, Unused)

**URL:**
```
https://dev.mamtj6.com/admin/infaq/data/daily.json
```

**Consumed by:** No frontend page yet. Reserved for future use.

---

## Data Source Architecture

```
Google Sheets (manual update)
       ↓
Google Apps Script (multimedia-mamtj6/dev repo)
       ↓
JSON files served via Vercel at dev.mamtj6.com
       ↓ (fallback: raw GitHub URLs)
┌──────────────────────────────────────────────────────┐
│  script.js (shared logic)                            │
│  ├── index.html (dashboard)                          │
│  ├── tabung-bulanan.html (monthly reports)           │
│  ├── perbelanjaan/index.html (expense reports)        │
│  └── perbelanjaan/bulanan.html (monthly expenses)     │
├──────────────────────────────────────────────────────┤
│  Standalone kiosk pages (own inline scripts)         │
│  ├── display/data-infaq-pembangunan.html             │
│  ├── display/data-infaq-pembangunan-baharu.html      │
│  ├── display/data-tabung-bulanan.html                │
│  └── display/data-perbelanjaan-bulanan.html          │
├──────────────────────────────────────────────────────┤
│  Standalone website pages (own inline scripts)       │
│  └── infaq-pembangunan-baharu.html                   │
└──────────────────────────────────────────────────────┘
```

## Update Checklist

When changing any data source URL:

1. `grep` for the old URL across all `.html` and `.js` files
2. Update every file that references it (inline scripts are NOT shared)
3. Verify fallback URL matches (same long-form UUID filename)
4. Test all pages that consume the data
5. Clear browser cache to verify (Ctrl+Shift+R)

---

*Last updated: 2026-09-08*
