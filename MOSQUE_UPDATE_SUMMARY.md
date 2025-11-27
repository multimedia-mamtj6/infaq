# Mosque Information Update Summary

## Overview
Updated mosque name and address information across the MAMTJ6 Infaq Center project files.

## Changes Made

### Mosque Name
- **Old**: Masjid Al-Muqarrabin Tasik Jaya
- **New**: Masjid Al-Mukhlisin, Taman Jaya 6

### Address
- **Old**: Tasik Jaya, Selangor, Malaysia (or variations like "Jalan Tasik Jaya 1/1, 43000 Kajang, Selangor")
- **New**: Jalan Jaya 6/5, Taman Jaya 6, 28000 Temerloh, Pahang, Malaysia

## Files Updated

### ✅ Successfully Updated

1. **infaq-transfer.html**
   - Updated footer copyright text

2. **infaq-qr.html**
   - Updated mosque name display under QR code
   - Updated footer copyright text

3. **infaq-billplz.html**
   - Updated footer copyright text

4. **README.md**
   - Updated project description
   - Updated contact section with new mosque name
   - Updated address in contact information

5. **USER_GUIDE.md** (Bilingual)
   - Updated introduction section (Malay)
   - Updated physical donation address (Malay)
   - Updated introduction section (English)
   - Updated physical donation address (English)
   - Updated contact section with new address

### ⚠️ Requires Manual Verification

6. **infaq-tabung.html**
   - File encountered corruption during automated editing
   - The following sections need to be manually verified and fixed:
     - Map header (line ~178): Should show "Masjid Al-Mukhlisin, Taman Jaya 6"
     - Google Maps embed URL (line ~185): Should point to correct location in Temerloh
     - Address display (lines ~195-199): Should show complete new address
     - Google Maps link (line ~204): Should include correct search query
     - Waze link (line ~209): Should include correct search query
     - Footer (line ~222): Should show new mosque name

## Recommended Next Steps

1. **Manually fix infaq-tabung.html**:
   - Open the file in a text editor
   - Locate the "Map Header" section around line 175
   - Ensure the complete address section is present
   - Verify all map links are working

2. **Update Google Maps Embed**:
   - Get the correct embed code for Masjid Al-Mukhlisin in Temerloh
   - Replace the placeholder coordinates in the iframe src

3. **Test All Pages**:
   - Open each HTML file in a browser
   - Verify all mosque information displays correctly
   - Test map links (Google Maps and Waze)

## Notes

- The acronym "MAMTJ6" remains unchanged as it's the project identifier
- All external links (WhatsApp, email, website) remain unchanged
- Only mosque name and physical address were updated
