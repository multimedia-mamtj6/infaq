# Changelog

All notable changes to the MAMTJ6 Infaq Center project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.7.0] - 2025-12-19

### Added
- **Centralized Version Management System**: Single source of truth for version numbers
    - `APP_VERSION` constant in `script.js` controls all page versions
    - `updateVersionDisplay()` function dynamically updates version text
    - `updateCopyrightYear()` function auto-updates copyright year
    - `initializeFooter()` function manages both version and year updates
    - Version display added to all 4 donation method pages (previously missing)
        - `opt/infaq-transfer.html`
        - `opt/infaq-qr.html`
        - `opt/infaq-tabung.html`
        - `opt/toyyib-pay.html`

### Changed
- **Standardized Version Format**: All pages now consistently show "Version v2.1" format
    - Previously: "MAMTJ6 System v2.1" on some pages, "Version v2.1" on others
    - Now: Uniform "Version v2.1" across all 7 pages
- **Dynamic Copyright Year**: Copyright year now auto-updates to current year via JavaScript
    - Eliminates manual year updates every January
    - Year displayed via `<span id="copyright-year">` element
- **Footer Consistency**: All 7 pages now have identical footer structure and styling

### Technical Details
- Added `<script src="../script.js"></script>` to donation pages to access version functions
- Added `DOMContentLoaded` event listeners on donation pages to initialize footer
- Version and year fallback text preserved in HTML if JavaScript fails to load
- Modified files: `script.js`, `index.html`, `tabung-bulanan.html`, `infaq-pembangunan.html`, `opt/infaq-transfer.html`, `opt/infaq-qr.html`, `opt/infaq-tabung.html`, `opt/toyyib-pay.html`

### Benefits
- **Single Update Point**: Change `APP_VERSION = "2.2"` in one line to update all pages
- **Maintenance Efficiency**: Version bumps now take 1 second instead of editing 7 files
- **Consistency Guarantee**: Impossible to have mismatched versions across pages
- **Future-Proof**: Easy to extend with build timestamps or commit hashes

---

## [2.6.0] - 2025-01-15

### Added
- **SEO Meta Tags Implementation**: Comprehensive SEO optimization across all pages
    - **Favicon System**: Multi-size favicon support for all devices
        - 96x96px PNG for standard browsers
        - 192x192px PNG for mobile devices
        - 512x512px PNG for high-resolution displays
        - SVG format for scalable vector display
        - ICO format for legacy browser support
        - Apple touch icon (180x180px) for iOS devices
        - Apple web app title: "Infaq Center"
    - **Open Graph Tags**: Social media sharing optimization
        - Page-specific titles and descriptions for each page
        - Preview image: `link-preview.jpg` (1200x630px)
        - Proper OG type, URL, and site name tags
        - Enables rich preview cards on Facebook, WhatsApp, LinkedIn
    - **Twitter Card Tags**: Twitter-specific social media optimization
        - Summary large image card type
        - Page-specific titles and descriptions
        - Consistent preview image across all pages
    - **SEO Basics**: Search engine optimization fundamentals
        - Page-specific meta descriptions for better SERP snippets
        - Relevant keywords for each donation method
        - Canonical URLs to prevent duplicate content issues
    - **PWA Manifest** (`media/favicon/site.webmanifest`):
        - App name: "Infaq Center MAMTJ6"
        - Short name: "Infaq MAMTJ6"
        - Theme color: #3b82f6 (blue)
        - Background color: #ffffff (white)
        - Standalone display mode for app-like experience
        - Icon references for different sizes

- **Search Engine Support Files**:
    - **robots.txt**: Allows all search engine crawlers to index the site
    - **sitemap.xml**: XML sitemap with all 7 pages, priorities, and change frequencies
        - Homepage: Priority 1.0, weekly updates
        - Monthly reports: Priority 0.8, weekly updates
        - Project development: Priority 0.9, monthly updates
        - Donation methods: Priority 0.7, monthly updates

### Changed
- **Domain Migration**: Full URL migration from `https://mamtj6.com/infaq` to `https://infaq.mamtj6.com`
    - **All HTML Pages**: Updated canonical URLs, Open Graph URLs, and Twitter Card image URLs
        - `index.html`: Main dashboard (homepage)
        - `tabung-bulanan.html`: Monthly reports page
        - `infaq-pembangunan.html`: Project development page
        - `opt/infaq-transfer.html`: Bank transfer donation page
        - `opt/infaq-qr.html`: QR Pay donation page
        - `opt/toyyib-pay.html`: Online payment page
        - `opt/infaq-tabung.html`: Physical tabung page
    - **robots.txt**: Updated sitemap URL to new domain
    - **sitemap.xml**: Updated all 7 page URLs to new domain structure
    - **site.webmanifest**: Updated icon paths and start_url for new domain

- **Favicon Structure**: Enhanced favicon references with proper formatting
    - Root-level pages: Use relative paths (`media/favicon/`)
    - Subfolder pages (opt/): Use parent-relative paths (`../media/favicon/`)
    - Absolute paths (`/media/favicon/`) for 192x192 and 512x512 sizes
    - Consistent structure across all 7 HTML pages

- **Preview Image**: Renamed from `og-image.jpg` to `link-preview.jpg`
    - Updated references across all HTML pages
    - Consistent naming for social media previews

### Technical
- **Meta Tag Organization**: All pages now follow consistent SEO structure
    1. SEO Basic (title, description, keywords, canonical)
    2. Favicon (multiple sizes and formats)
    3. Open Graph (Facebook, WhatsApp, LinkedIn)
    4. Twitter Card (Twitter-specific tags)
- **Path Handling**: Proper relative/absolute path usage
    - Root pages use `media/` for most resources
    - Opt pages use `../media/` for relative resources
    - Absolute `/media/` paths for specific high-res favicons
- **Consistency**: All pages share same core SEO elements while maintaining page-specific titles and descriptions

### Benefits
- **Search Engine Visibility**: Improved discoverability on Google, Bing, and other search engines
- **Social Media Sharing**: Beautiful preview cards when sharing links on social platforms
- **Mobile Experience**: Progressive Web App capabilities with "Add to Home Screen" support
- **Professional Branding**: Consistent favicons across all browsers and devices
- **SEO Best Practices**: Canonical URLs, proper meta tags, and structured data

---

## [2.5.0] - 2024-12-12

### Added
- **Monthly Reports Page (`tabung-bulanan.html`)**:
    - **Past Years Charts**: Dynamic historical trend visualization showing all available past years from JSON data
        - Automatically displays charts for all years except current year (e.g., 2024, 2023, 2022)
        - Sorted in descending order (most recent first)
        - Responsive 2-column grid on desktop, single column on mobile
        - Section header "Trend Tahun-Tahun Lepas" with descriptive text
        - Each chart includes year badge (e.g., "Tahun 2024")
        - Uses same blue styling (#3b82f6) as current year for consistency
        - Memory-efficient: properly destroys old chart instances on data refresh
        - Gracefully handles edge cases (no past data, single year, multiple years)
    - **Current Year Label Enhancement**: Changed year label styling from slate to blue theme
        - Background: `bg-blue-50` (light blue)
        - Text: `text-blue-600` (blue)
        - Matches "Bulan Ini" badge styling for visual consistency

- **Digital Signage Display (`display/data-infaq-pembangunan.html`)**:
    - **Slot Machine Animation**: Dramatic number rolling effect for donation total
        - Each digit rolls independently in vertical column (like casino slot machine)
        - Stagger effect: digits animate sequentially with 50ms delay (wave effect)
        - Full digit rotation: each digit rolls through 10+ numbers before stopping
        - GPU-accelerated CSS transforms for smooth 60fps animation
        - Duration: 2.5 seconds with easeInOutCubic easing
        - Maintains proper formatting (RM prefix, commas, decimal points remain static)
        - Progress bar animates in sync with donation amount
        - Animation only on first page load (no re-animation on auto-refresh)

### Changed
- **Monthly Reports Page (`tabung-bulanan.html`)**:
    - **Year Labels**: Added "Tahun" prefix to all year badges
        - Current year: "Tahun 2025" instead of "2025"
        - Past years: "Tahun 2024", "Tahun 2023", etc.

- **Digital Signage Display (`display/data-infaq-pembangunan.html`)**:
    - **Date Format**: Changed "Kemaskini sehingga" text from bold to regular weight
        - Updated CSS: `font-weight: normal` for `p:last-of-type` selector
        - Creates cleaner, less heavy appearance
    - **Percentage Display**: Enhanced to show one decimal place
        - Changed from "50%" to "50.1%"
        - Applied to both animated and instant update displays
        - Uses `toFixed(1)` for consistent formatting

### Technical
- **JavaScript Updates (`script.js`)**:
    - Added `pastYearChartInstances` object to track all past year chart instances
    - Modified `loadReport()` to call `renderPastYearsCharts()` after current year chart
    - Added `renderPastYearsCharts()` function (~60 lines):
        - Filters years to exclude current year
        - Sorts in descending order
        - Dynamically creates chart cards with unique canvas IDs
        - Handles section visibility based on data availability
    - Added `renderPastYearChart()` function (~50 lines):
        - Creates Chart.js line chart with blue styling
        - Stores instance for proper cleanup
        - Uses same configuration as current year chart
    - Updated `set()` calls for year labels to include "Tahun" prefix

- **JavaScript Updates (`display/data-infaq-pembangunan.html`)**:
    - Replaced `animateCounter()` with `animateSlotMachine()` function (~60 lines):
        - Parses currency string into individual characters
        - Creates vertical column for each digit (overflow hidden)
        - Implements stagger timing with setTimeout
        - Uses CSS transforms for animation
    - Added `setSlotMachineValue()` helper function for instant updates
    - Updated `animateProgressBar()` to use `toFixed(1)` for decimal precision
    - Modified `fetchDataAndUpdate()` to call new slot machine function

- **CSS Updates**:
    - Added slot machine animation styles (~40 lines):
        - `.slot-machine-container`: Flex container for all digits
        - `.slot-digit-wrapper`: Creates "window" with overflow hidden
        - `.slot-digit-column`: Vertical column with transform transition
        - `.slot-digit`: Individual digit styling
        - `.slot-static`: Static characters (RM, comma, period)
        - Responsive adjustments for mobile devices

---

## [2.4.0] - 2024-12-09

### Added
- **Digital Signage Display (`display/data-tabung-bulanan.html`)**:
    - **Footer Section**: Added informational footer with text "Maklumat lanjut, layari infaq.mamtj6.com"
        - Responsive text sizing: `text-base md:text-lg lg:text-xl` (16px → 18px → 20px)
        - Centered white text with adequate padding (`py-2`)
        - Positioned at bottom of layout for easy visibility
        - Provides users with URL to access full infaq website

### Changed
- **Digital Signage Display (`display/data-tabung-bulanan.html`)**:
    - **Body Padding Optimization**: Removed all vertical padding to eliminate wasted space
        - Removed top padding: `pt-1 md:pt-1 lg:pt-2` (4px → 4px → 8px)
        - Removed bottom padding: `pb-1 md:pb-1 lg:pb-1` (4px → 4px → 4px)
        - Logo now positioned flush with top edge for maximum space efficiency
        - Kept horizontal padding (`px-2 md:px-3 lg:px-4`) for content margins
        - Result: 8-12px of vertical space reclaimed for content display
    - **Icon Removal**: Removed all decorative icons from monthly data sections
        - Removed calendar icons from month headers (Bulan Ini, Bulan Lepas)
        - Removed calendar-check icons from week rows (Minggu 1-5)
        - Removed coin icons from monthly totals
        - Cleaner, more focused text-only layout for digital signage
        - Simplified HTML structure and reduced visual clutter
    - **Color Unification**: Changed current month total background to match previous month
        - Changed from blue gradient (`from-blue-600 to-blue-800`)
        - Changed to solid slate (`bg-slate-900`)
        - Creates more consistent visual appearance between both monthly sections

### Technical
- **JavaScript Updates**: Modified `populateMonthData()` function to handle text-only structure
    - Updated to directly set `textContent` instead of querying for nested span elements
    - Removed icon-related DOM queries and manipulations
    - Simplified error handling for "TIADA DATA" states
    - Maintained all data formatting and display logic

---

## [2.3.2] - 2024-12-XX

### Added
- **Dashboard Page (`index.html`)**:
    - **Intro Section**: Added welcome introduction section below the navigation header
        - Welcome heading "Selamat Datang ke Infaq Center MAMTJ6" with info icon
        - Descriptive paragraph explaining the page purpose, features, and available information
        - Explains dashboard shows monthly collection summaries, project progress, and real-time infaq statistics
        - Mentions ability to view collection summaries, track project development, and choose donation methods
        - Highlights how contributions help improve facilities for MAMTJ6 congregation
        - Styled with gradient background (blue-50 to slate-50) and rounded corners
        - Fully responsive design matching existing page aesthetic
    - **Quran Verses Section**: Added inspirational Quran verses section above the footer
        - Section heading "Ayat-Ayat Al-Quran" with book icon
        - Two separate quote cards displaying Surah Al-Baqarah verses (245 and 261)
        - Malay translation only, displayed together for inspirational content
        - Styled with blue-50 background, left border accent (border-blue-500), and quote icons
        - Responsive grid layout: single column on mobile, two columns on desktop (md:grid-cols-2)
        - Matches existing quote card design pattern from donation pages
        - Purely inspirational content with no interactive elements
        - Proper spacing (mt-8 top margin, gap-6 between cards) within main content container

---

## [2.3.1] - 2024-12-XX

### Changed
- **Project Details Page (`infaq-pembangunan.html`)**:
    - **Timeline Section Updates**:
        - Item 1: Updated date from "28 Mac 2024" to "28 Mac 2024 - Kini" to indicate current status
        - Item 2: Updated date from "Q2 2024" to "Sedang berjalan" to reflect ongoing status
        - Item 3: Updated date from "Q3 2024" to "Tarikh Akan Dimaklumkan" for Libat Urus & Kelulusan phase
        - Item 4: 
            - Updated date from "Tarikh Mula" to "Tarikh Akan Dimaklumkan"
            - Updated title from "Akan Dimaklumkan" to "Mula Pembinaan"
        - Item 5:
            - Updated date from "Tarikh Siap" to "Tarikh Akan Dimaklumkan"
            - Updated title from "Akan Dimaklumkan" to "Siap Pembinaan"
- **Date Format (`script.js`)**:
    - Changed "Data dikemaskini" timestamp format from 24-hour format (Malay PTG/Pagi) to 12-hour AM/PM format
    - Updated locale from `ms-MY` to `en-US` for consistent English AM/PM display
    - Applied to both dashboard and report page timestamp displays

---

## [2.3.0] - 2024-11-28

### Added
- **Project Details Page (`infaq-pembangunan.html`)**:
    - **Hero Section**: Comprehensive project introduction with launch date, status badges, and key benefits display.
    - **Status Tracking**: Real-time donation progress with animated progress bar, percentage display, and target tracking (RM250,000 goal).
    - **Key Facts Grid**: Quick reference cards showing project area (1,104 sq ft), estimated cost, and current status.
    - **Project Narrative**: Detailed explanation of project purpose and comprehensive project details (name, location, area, cost, organizer, timeline).
    - **Visual Gallery**: 
        - Plan drawings gallery (4 views: front, side, floor, roof) with lightbox functionality
        - Location gallery (3 views: main entrance, satellite, site plan) with lightbox functionality
        - Interactive image viewing with hover effects and click-to-expand
    - **Timeline Section**: Visual timeline showing project milestones from launch (28 Mac 2024) through planning, approval, and future construction phases.
    - **Call-to-Action Section**: Direct links to donation methods (Transfer Bank, QR Pay, Billplz) with styled buttons.
    - **Lightbox Modal**: 
        - Full-screen image viewing with backdrop blur
        - Image caption display
        - Keyboard support (ESC to close)
        - Browser back button support
        - Touch/swipe gesture support for mobile devices
        - Smooth animations and transitions

### Enhanced
- **Navigation**: Sticky navigation bar with "Kembali" (Back) button for consistent navigation experience.
- **Responsive Design**: Fully responsive layout optimized for both desktop and mobile viewing.
- **User Experience**: 
    - Skeleton loading states for dynamic content
    - Smooth scroll behavior
    - Touch-friendly interactive elements
    - Professional gradient backgrounds and card designs

### Technical
- **Image Handling**: Graceful fallback for missing images with placeholder text.
- **Accessibility**: Semantic HTML structure, proper alt text, and keyboard navigation support.
- **Performance**: Optimized image loading with onload handlers and error handling.

---

## [2.2.1] - 2024-11-27

### Changed
- **Index Page (`index.html`)**:
    - **Header Synchronization**: Implemented sticky navigation bar to match inner pages. Removed "Kembali" button for root page context.
    - **Footer Synchronization**: Combined "Last Updated" information with the standardized copyright footer.
    - **Layout**: Refined main container and padding to ensure visual consistency with the premium split layout of inner pages.

## [2.2.0] - 2024-11-27

### Added
- **Bank Rakyat Logo**: Integrated official Bank Rakyat landscape logotype in `infaq-transfer.html` for better brand recognition.

### Changed
- **QR Code Page (`infaq-qr.html`)**:
    - Increased QR code size to 600px for better scannability.
    - Updated DuitNow logo to a transparent version.
    - Refined QR header styling with rounded corners and better spacing.
    - Adjusted "Powered by DuitNow" text positioning.
- **Index Page (`index.html`)**:
    - Updated "Ringkasan Kutipan" title to "Ringkasan Kutipan Bulanan".
    - Changed "Terkumpul" label to "Jumlah Terkumpul".
- **Tabung Page (`infaq-tabung.html`)**:
    - Removed redundant "Tip" section for a cleaner interface.

### Fixed
- **File Corruption**: Restored corrupted bank card visual section in `infaq-transfer.html`.

## [2.1.0] - 2024-11-26

### Changed - Mosque Information Update

#### Overview
Updated mosque name and address information across all project files to reflect the correct location in Temerloh, Pahang.

#### Mosque Details Updated

**Previous Information**:
- Name: Masjid Al-Muqarrabin Tasik Jaya
- Location: Tasik Jaya, Selangor, Malaysia
- Address: Jalan Tasik Jaya 1/1, 43000 Kajang, Selangor

**Current Information**:
- Name: Masjid Al-Mukhlisin, Taman Jaya 6
- Location: Temerloh, Pahang, Malaysia  
- Address: Jln Jaya 6/1, Taman Jaya 6, 28000 Temerloh, Pahang

#### Files Updated

**HTML Pages**:
- `infaq-transfer.html` - Footer copyright text
- `infaq-qr.html` - Mosque name display and footer
- `toyyib-pay.html` - Footer copyright text
- `infaq-tabung.html` - Map header, address display, navigation links, and footer

**Documentation**:
- `README.md` - Project description, contact section, and address
- `USER_GUIDE.md` - Introduction sections (Malay & English), physical donation addresses, and contact information

#### Notes
- Project identifier "MAMTJ6" remains unchanged
- All external contact links (WhatsApp, email, website) remain unchanged
- Only mosque name and physical address information were updated

---

## [2.0.0] - 2024-11-26

### Added - Premium Split Layout Implementation

#### Overview
Implemented **Premium Split Layout** across all 4 infaq donation pages, ensuring full compatibility with both desktop and mobile views while providing complete, contextual information to users.

#### New Layout Architecture

**Desktop View (≥1024px)**:
- Two-column grid layout with max-width container (6xl)
- Left Column: Contextual information, benefits, steps, and educational content
- Right Column: Primary action card (bank details, QR code, payment form, or location map)
- Sticky right column for better UX while scrolling

**Mobile View (<1024px)**:
- Single-column responsive stack
- Action card appears first (prioritizes call-to-action)
- Information content follows below
- Touch-friendly buttons (minimum 44px height)

#### Pages Updated

##### 1. Transfer Page (`infaq-transfer.html`)
- **Added**: Hadith quote about sedekah for emotional connection
- **Added**: Step-by-step transfer guide with numbered instructions
- **Added**: Benefits explanation section
- **Enhanced**: Premium bank card UI with gradient background
- **Enhanced**: Copy-to-clipboard functionality with toast notifications
- **Enhanced**: WhatsApp receipt submission integration

##### 2. QR Pay Page (`infaq-qr.html`)
- **Added**: QR Pay benefits section (speed, security, compatibility)
- **Added**: Supported banks/e-wallets information
- **Added**: Detailed usage instructions (4-step guide)
- **Enhanced**: DuitNow branding with gradient header
- **Enhanced**: Download QR button functionality
- **Enhanced**: Bank compatibility visual badges

##### 3. toyyibPay Page (`toyyib-pay.html`)
- **Added**: Payment methods grid (Credit Card, Debit Card, FPX, E-Wallet)
- **Added**: Security assurance badge with Bank Negara mention
- **Added**: Benefits of using Billplz section
- **Enhanced**: Interactive donation form with preset amounts (RM 10, 30, 50, 100)
- **Enhanced**: Custom amount input field
- **Enhanced**: Live total display on payment button
- **Enhanced**: User details collection (Name, Email, Phone)

##### 4. Tabung Page (`infaq-tabung.html`)
- **Added**: Operating hours display (Weekday + Friday prayers schedule)
- **Added**: Physical donation benefits section
- **Added**: Contact information with WhatsApp integration
- **Enhanced**: Interactive Google Maps embed
- **Enhanced**: Full address details display
- **Enhanced**: Navigation buttons (Google Maps + Waze)
- **Enhanced**: Visitor tips section

#### Design Improvements

**Navigation**:
- Added sticky top navigation bar across all pages
- Added "Kembali" (Back) button to return to main index
- Consistent MAMTJ6 logo and branding placement

**Visual Design**:
- Unique gradient headers for each page (color-coded by method)
- Glassmorphism effects on interactive cards
- Smooth fade-in-up animations on page load
- Professional color schemes matching each donation method
- Improved typography hierarchy

**Information Architecture**:
- Context: Why choose this method
- Benefits: Specific advantages clearly listed
- Instructions: Clear step-by-step guides with visual indicators
- Trust Signals: Security badges, official branding
- Call-to-Action: Prominent, easy-to-use action buttons

#### Technical Enhancements

**Responsive Design**:
- Breakpoint at 1024px (lg) for desktop/mobile split
- Flexbox and Grid layouts for modern browser support
- Order utilities for mobile-first content prioritization

**Interactive Features**:
- Copy-to-clipboard with visual feedback (toast notifications)
- Form validation and live amount calculation
- External link integration (WhatsApp, Maps, Waze)
- Download functionality for QR codes

**Accessibility**:
- Semantic HTML5 structure throughout
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA-friendly icon usage (Phosphor Icons)
- Sufficient color contrast ratios (WCAG AA compliant)

**Performance**:
- Minimal JavaScript (only for essential interactions)
- Optimized CSS with Tailwind utility classes
- Lazy loading for embedded maps
- No heavy dependencies

### Changed

- **All infaq pages**: Migrated from mobile-centered card design to responsive split layout
- **Navigation**: Unified navigation pattern across all pages
- **Footer**: Standardized footer design and placement

### Fixed

- **Mobile responsiveness**: Eliminated horizontal scrolling issues
- **Text readability**: Improved font sizes and line heights for better legibility
- **Touch targets**: Ensured all interactive elements meet minimum size requirements
- **Layout consistency**: Standardized spacing and alignment across all pages

### Verified

**Desktop Testing** (1920x1080):
- ✅ Split layout renders correctly
- ✅ Information and action sections are balanced
- ✅ Max-width container prevents over-stretching on ultra-wide screens
- ✅ All interactive elements accessible and functional

**Mobile Testing** (375x812):
- ✅ Sections stack vertically (single column)
- ✅ Action card appears first for immediate engagement
- ✅ All text readable without horizontal scrolling
- ✅ Buttons are touch-friendly
- ✅ Forms fully functional

**Interactive Elements**:
- ✅ Copy-to-clipboard buttons working
- ✅ Toast notifications appearing and fading correctly
- ✅ WhatsApp links opening correctly
- ✅ Map navigation (Google Maps + Waze) functional
- ✅ QR code download triggering correctly
- ✅ Form interactions (amount selection, input fields) working

---

## [1.0.0] - Previous Version

### Initial Release
- Basic infaq pages with mobile-centered design
- Simple card-based layout
- Basic functionality for donations
