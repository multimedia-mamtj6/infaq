# Changelog

All notable changes to the MAMTJ6 Infaq Center project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

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
- `infaq-billplz.html` - Footer copyright text
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

##### 3. Billplz Page (`infaq-billplz.html`)
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
