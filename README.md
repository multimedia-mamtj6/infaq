# 🕌 MAMTJ6 Infaq Center

> **Memudahkan Anda Berinfaq** | Making Donations Easy

A modern, responsive web application for managing and facilitating donations (infaq) for Masjid Al-Mukhlisin, Taman Jaya 6 (MAMTJ6). Built with simplicity, transparency, and user experience in mind.

---

## 📖 Tentang Projek | About This Project

**Bahasa Malaysia:**
MAMTJ6 Infaq Center adalah platform digital yang memudahkan umat Islam untuk menyumbang kepada masjid melalui pelbagai kaedah pembayaran. Sistem ini memaparkan statistik kutipan secara real-time dan menyediakan maklumat lengkap untuk setiap kaedah sumbangan.

**English:**
MAMTJ6 Infaq Center is a digital platform that makes it easy for Muslims to donate to the mosque through various payment methods. The system displays real-time collection statistics and provides complete information for each donation method.

---

## ✨ Key Features

### 🎯 **Multi-Method Donations**
- **Bank Transfer** - Direct bank transfer with copy-to-clipboard functionality
- **QR Pay (DuitNow)** - Instant payment via QR code scanning
- **Billplz** - Online payment gateway *(Coming Soon)*
- **Physical Tabung** - Traditional donation box with location map

### 📊 **Real-Time Dashboard**
- Live donation statistics
- Project progress tracking
- Monthly and yearly collection summaries
- Auto-refresh every 5 minutes

### 📱 **Responsive Design**
- **Desktop**: Premium split layout (information + action)
- **Mobile**: Single-column stack with action-first priority
- Touch-friendly interface
- Optimized for all screen sizes

### 🎨 **Premium User Experience**
- Smooth animations and transitions
- Glassmorphism effects
- Interactive elements with visual feedback
- Professional color schemes
- Bilingual support (Malay/English)

### 📈 **Comprehensive Reports**
- Weekly collection breakdown
- Monthly trends with Chart.js visualizations
- Yearly statistics
- Exportable data

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)
- Text editor (VS Code, Sublime Text, etc.)

### Installation

1. **Clone or Download** this repository
   ```bash
   git clone https://github.com/your-org/infaq-mamtj6.git
   cd infaq-mamtj6
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

3. **Access the Application**
   - Navigate to `http://localhost:8000` (if using local server)
   - Or open `index.html` directly

### No Build Process Required! 🎉
This is a static website using CDN-hosted dependencies. No npm install, no webpack, no compilation needed.

---

## 📁 Project Structure

```
infaq-mamtj6/
├── index.html                 # Main dashboard page
├── infaq-transfer.html        # Bank transfer donation page
├── infaq-qr.html             # QR Pay donation page
├── toyyib-pay.html           # toyyibPay payment page (UI only)
├── infaq-tabung.html         # Physical donation box page
├── tabung-bulanan.html       # Monthly reports page
├── script.js                 # Main JavaScript logic
├── style.css                 # Custom CSS styles
├── CHANGELOG.md              # Version history
├── README.md                 # This file
├── DEVELOPER.md              # Technical documentation
├── USER_GUIDE.md             # User guide (bilingual)
├── DATA_STRUCTURE.md         # Data management guide
└── display/                  # Additional display pages
    ├── infaq-pembangunan.html
    ├── tabung-bulanini.html
    └── tabung-bulanlepas.html
```

---

## 🖼️ Screenshots

### Dashboard
![Dashboard](file:///C:/Users/PC%20CUSTOM/.gemini/antigravity/brain/f71b5d3b-2b18-44cc-9d27-1f4f38358c05/index_page_loaded_1764138388378.png)

### Donation Methods

````carousel
![Bank Transfer](file:///C:/Users/PC%20CUSTOM/.gemini/antigravity/brain/f71b5d3b-2b18-44cc-9d27-1f4f38358c05/transfer_page_1764138529446.png)
<!-- slide -->
![QR Pay](file:///C:/Users/PC%20CUSTOM/.gemini/antigravity/brain/f71b5d3b-2b18-44cc-9d27-1f4f38358c05/qr_page_1764138548618.png)
<!-- slide -->
![Billplz Payment](file:///C:/Users/PC%20CUSTOM/.gemini/antigravity/brain/f71b5d3b-2b18-44cc-9d27-1f4f38358c05/billplz_page_1764138568555.png)
<!-- slide -->
![Physical Tabung](file:///C:/Users/PC%20CUSTOM/.gemini/antigravity/brain/f71b5d3b-2b18-44cc-9d27-1f4f38358c05/infaq_tabung_page_1764138497998.png)
````

---

## 📚 Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| [README.md](README.md) | Project overview & quick start | Everyone |
| [DEVELOPER.md](DEVELOPER.md) | Technical documentation & setup | Developers |
| [USER_GUIDE.md](USER_GUIDE.md) | How to donate (bilingual) | Donors & Users |
| [DATA_STRUCTURE.md](DATA_STRUCTURE.md) | Data management guide | Administrators |
| [CHANGELOG.md](CHANGELOG.md) | Version history | Everyone |

---

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom styles + Tailwind CSS (CDN)
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Tailwind CSS** - Utility-first CSS framework
- **Phosphor Icons** - Modern icon library
- **Chart.js** - Data visualization (reports page)
- **Google Sheets** - Data source (via JSON export)

---

## 🎯 Use Cases

### For Donors
- Quick and easy donation process
- Multiple payment options
- Transparent progress tracking
- Receipt submission via WhatsApp

### For Administrators
- Real-time statistics monitoring
- Easy data updates via Google Sheets
- Comprehensive reporting
- No technical knowledge required

### For Developers
- Clean, maintainable code
- Well-documented structure
- Easy customization
- No complex build process

---

## 🔮 Roadmap

### Version 2.1 (Current)
- ✅ Premium split layout implementation
- ✅ Four donation methods
- ✅ Real-time dashboard
- ✅ Monthly reports with charts

### Version 3.0 (Planned)
- 🔄 Billplz payment integration (live processing)
- 🔄 Project details page (`infaq-pembangunan.html`)
- 🔄 Donor leaderboard
- 🔄 Email notifications
- 🔄 Multi-language support (English/Malay toggle)
- 🔄 Dark mode

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Bugs** - Open an issue with details
2. **Suggest Features** - Share your ideas
3. **Submit Pull Requests** - Follow our coding standards
4. **Improve Documentation** - Help us make it clearer

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support & Contact

**Masjid Al-Mukhlisin, Taman Jaya 6 (MAMTJ6)**

- 📧 Email: info@mamtj6.com
- 📱 WhatsApp: +60 12-345 6789
- 🌐 Website: https://mamtj6.com
- 📍 Address: Jln Jaya 6/1, Taman Jaya 6, 28000 Temerloh, Pahang, Malaysia

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **MAMTJ6 Community** - For continuous support and feedback
- **Tailwind CSS** - For the amazing utility-first framework
- **Phosphor Icons** - For beautiful, consistent icons
- **Chart.js** - For powerful data visualizations
- **All Contributors** - Thank you for making this project better!

---

## 📊 Project Statistics

- **Version**: 2.1.0
- **Last Updated**: November 26, 2024
- **Total Pages**: 6 main pages + 3 display pages
- **Lines of Code**: ~2,500+
- **Dependencies**: 3 (all CDN-hosted)
- **Browser Support**: All modern browsers

---

<div align="center">

**Made with ❤️ for the MAMTJ6 Community**

*Barakallahu Feekum* 🤲

[🏠 Home](index.html) • [📖 Developer Docs](DEVELOPER.md) • [👥 User Guide](USER_GUIDE.md) • [📊 Data Guide](DATA_STRUCTURE.md)

</div>
