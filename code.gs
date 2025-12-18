// ----- KONFIGURASI PENGGUNA (SILA UBAH SUAI) -----
const GITHUB_USERNAME = "multimedia-mamtj6";
const GITHUB_REPO = "infaq";
const GITHUB_BRANCH = "main";
const FILE_PATH = "data/data.json"; // JSON utama untuk semua data
const DAILY_FILE_PATH = "data/daily.json"; // JSON khas untuk kutipan harian
// ----------------------------------------------------

const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

/**
 * Mencipta menu khas di dalam Google Sheet apabila fail dibuka.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Alat Khas')
    .addItem('1. Simpan GitHub Token', 'showSetTokenPrompt')
    .addSeparator()
    .addItem('2. Publish JSON ke GitHub', 'publishJsonToGithub')
    .addToUi();
}

/**
 * Memaparkan tetingkap untuk pengguna memasukkan PAT mereka.
 */
function showSetTokenPrompt() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    'Simpan GitHub Personal Access Token',
    'Sila masukkan Personal Access Token (PAT) anda (bermula dengan ghp_). Token ini akan disimpan dengan selamat untuk akaun anda sahaja.',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() == ui.Button.OK) {
    const token = response.getResponseText().trim();
    if (token) {
      saveToken(token);
      ui.alert('Berjaya!', 'GitHub Token telah disimpan dengan selamat.', ui.ButtonSet.OK);
    } else {
      ui.alert('Ralat', 'Token tidak boleh kosong.', ui.ButtonSet.OK);
    }
  }
}

/**
 * Menyimpan token ke dalam UserProperties yang selamat.
 */
function saveToken(token) {
  PropertiesService.getUserProperties().setProperty('GITHUB_TOKEN', token);
}

/**
 * Fungsi utama yang akan mengumpul semua data, memformatkannya,
 * dan memuat naik fail data.json ke GitHub.
 */
function publishJsonToGithub() {
  const ui = SpreadsheetApp.getUi();
  const token = PropertiesService.getUserProperties().getProperty('GITHUB_TOKEN');

  if (!token) {
    ui.alert('Ralat', 'Tiada GitHub Token ditemui. Sila simpan token anda dahulu melalui menu "Alat Khas > 1. Simpan GitHub Token".', ui.ButtonSet.OK);
    return;
  }

  try {
    ui.alert('Proses Dimulakan', 'Mengumpul data dari semua tab. Sila tunggu...', ui.ButtonSet.OK);

    // 1. Kumpul semua data yang diperlukan
    const summaryData = getSummaryData();
    const projectData = getProjectData();
    const currentMonthData = getCurrentMonthData();
    const pastMonthData = getPastMonthData();
    const graphData2025 = getYearlyGraphData('2025');
    const graphData2024 = getYearlyGraphData('2024');
    const dailyData = getDailyData();

    const currentTimestamp = new Date().toISOString();

    // 2. Gabungkan data UTAMA (tanpa kutipan harian)
    const mainData = {
      ringkasan: summaryData,
      projek: projectData,
      paparanBulanIni: currentMonthData,
      paparanBulanLepas: pastMonthData,
      graf: {
        '2025': graphData2025,
        '2024': graphData2024
      },
      tarikhKemaskini: currentTimestamp
    };

    // 3. Data khas untuk kutipan harian sahaja
    const dailyOnlyData = {
      projek: {
        NamaProjek: projectData.NamaProjek,
        SasaranKutipan: projectData.SasaranKutipan,
        JumlahTerkumpul: projectData.JumlahTerkumpul,
        Peratusan: projectData.Peratusan
      },
      paparanHarian: dailyData,
      tarikhKemaskini: currentTimestamp
    };

    // 4. Muat naik kedua-dua fail ke GitHub
    const mainContent = JSON.stringify(mainData, null, 2);
    const dailyContent = JSON.stringify(dailyOnlyData, null, 2);

    uploadToGithub(mainContent, token, FILE_PATH);
    uploadToGithub(dailyContent, token, DAILY_FILE_PATH);

    ui.alert('Berjaya!', `Kedua-dua fail telah berjaya dikemas kini di GitHub:\n- ${FILE_PATH}\n- ${DAILY_FILE_PATH}`, ui.ButtonSet.OK);

  } catch (e) {
    console.error(e);
    ui.alert('Proses Gagal', `Berlaku ralat: ${e.message}`, ui.ButtonSet.OK);
  }
}

/**
 * Fungsi untuk berinteraksi dengan API GitHub.
 * Versi dikemas kini: Menerima path fail sebagai parameter.
 */
function uploadToGithub(content, token, filePath) {
  // Jika filePath tidak diberikan, gunakan FILE_PATH default
  const targetPath = filePath || FILE_PATH;
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${targetPath}`;
  const contentEncoded = Utilities.base64Encode(content, Utilities.Charset.UTF_8);

  // Cuba dapatkan 'sha' fail sedia ada untuk proses kemas kini
  let sha = undefined;
  try {
    const getResponse = UrlFetchApp.fetch(apiUrl, {
      'headers': { 'Authorization': `token ${token}` },
      'muteHttpExceptions': true
    });
    if (getResponse.getResponseCode() == 200) {
      sha = JSON.parse(getResponse.getContentText()).sha;
    }
  } catch (e) {
    // Abaikan jika fail tidak wujud, ia akan dicipta
  }

  const payload = {
    message: `Kemas kini ${targetPath} dari Google Sheets pada ${new Date().toLocaleString('en-MY')}`,
    content: contentEncoded,
    branch: GITHUB_BRANCH,
    sha: sha // Sertakan sha jika fail sedia ada
  };

  const options = {
    method: 'put',
    contentType: 'application/json',
    headers: { 'Authorization': `token ${token}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  if (response.getResponseCode() >= 300) {
    throw new Error(`Gagal menghubungi GitHub API untuk ${targetPath}. Kod Status: ${response.getResponseCode()}. Mesej: ${response.getContentText()}`);
  }
}

/**
 * Mengambil data ringkasan untuk halaman utama.
 */
function getSummaryData() {
  const config = getConfig();
  if (!config || !config.TahunSemasa || !config.BulanSemasa) {
    return { error: "Sila pastikan tab 'Konfigurasi' mempunyai 'Tahun Semasa' dan 'Bulan Semasa'." };
  }
  const currentYear = parseInt(config.TahunSemasa);
  const currentMonth = config.BulanSemasa.toUpperCase();

  const allMonthlyData = getSheetData('KutipanBulanan');
  
  let totalThisYear = 0;
  let totalLastYear = 0;
  allMonthlyData.forEach(row => {
    if (row.Tahun === currentYear) {
      totalThisYear += row.JumlahBulanan;
    } else if (row.Tahun === currentYear - 1) {
      totalLastYear += row.JumlahBulanan;
    }
  });

  const thisMonthData = allMonthlyData.find(row => row.Tahun === currentYear && row.Bulan === currentMonth);
  const { year: lastMonthYear, month: lastMonthName } = getPreviousMonth(currentYear, currentMonth);
  const lastMonthData = allMonthlyData.find(row => row.Tahun === lastMonthYear && row.Bulan === lastMonthName);

  return {
    kutipan: {
      tahunIni: { tahun: currentYear, jumlah: totalThisYear },
      tahunLepas: { tahun: currentYear - 1, jumlah: totalLastYear },
      bulanIni: { bulan: currentMonth, jumlah: thisMonthData ? thisMonthData.JumlahBulanan : 0 },
      bulanLepas: { bulan: lastMonthName, jumlah: lastMonthData ? lastMonthData.JumlahBulanan : 0 }
    }
  };
}

/**
 * Mengambil data terperinci untuk bulan semasa.
 */
function getCurrentMonthData() {
    const config = getConfig();
    const allMonthlyData = getSheetData('KutipanBulanan');
    const data = allMonthlyData.find(row => row.Tahun === parseInt(config.TahunSemasa) && row.Bulan === config.BulanSemasa.toUpperCase());
    return data || { error: "Data bulan semasa tidak dijumpai." };
}

/**
 * Mengambil data terperinci untuk bulan lepas.
 */
function getPastMonthData() {
    const config = getConfig();
    const { year, month } = getPreviousMonth(parseInt(config.TahunSemasa), config.BulanSemasa.toUpperCase());
    const allMonthlyData = getSheetData('KutipanBulanan');
    const data = allMonthlyData.find(row => row.Tahun === year && row.Bulan === month);
    return data || { error: "Data bulan lepas tidak dijumpai." };
}

/**
 * Mengambil data dari tab Projek.
 * VERSI DIKEMAS KINI: Mengabaikan baris kosong.
 */
function getProjectData() {
  const projectInfo = getSheetData('Projek');
  const data = {};
  projectInfo.forEach(row => {
    // PEMBETULAN: Hanya proses baris yang mempunyai 'Perkara'.
    if (row && row.Perkara) {
      data[row.Perkara.replace(/\s+/g, '')] = row.Maklumat;
    }
  });

  const target = parseFloat(data.SasaranKutipan);
  const collected = parseFloat(data.JumlahTerkumpul);
  data.Peratusan = (target > 0) ? parseFloat(((collected / target) * 100).toFixed(1)) : 0;
  return data;
}

/**
 * Mengambil data kutipan harian dari tab Projek.
 * Hanya memasukkan tarikh yang mempunyai data (bukan semua hari).
 * Mengambil data dari kolom Tarikh, RM, dan Keterangan sahaja.
 */
function getDailyData() {
  const sheet = SPREADSHEET.getSheetByName('Projek');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  // Cari index untuk kolom Tarikh, RM, dan Keterangan
  const tarikhIndex = headers.findIndex(h => String(h).replace(/\s+/g, '') === 'Tarikh');
  const rmIndex = headers.findIndex(h => String(h).replace(/\s+/g, '') === 'RM');
  const keteranganIndex = headers.findIndex(h => String(h).replace(/\s+/g, '') === 'Keterangan');

  // Jika mana-mana kolom tidak dijumpai, return array kosong
  if (tarikhIndex === -1 || rmIndex === -1 || keteranganIndex === -1) {
    return [];
  }

  const dailyArray = [];

  // Mulakan dari baris 2 (skip header) dan proses setiap baris
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const tarikhValue = row[tarikhIndex];
    const rmValue = row[rmIndex];
    const keteranganValue = row[keteranganIndex];

    // Hanya masukkan baris yang mempunyai tarikh yang sah
    if (tarikhValue && tarikhValue !== '') {
      const formattedDate = formatDateToISO(tarikhValue);

      // Skip jika format tarikh tidak sah
      if (formattedDate !== '') {
        dailyArray.push({
          tarikh: formattedDate,
          jumlah: parseFloat(rmValue) || 0,
          keterangan: keteranganValue || ''
        });
      }
    }
  }

  // Sort by date ascending
  dailyArray.sort((a, b) => new Date(a.tarikh) - new Date(b.tarikh));

  return dailyArray;
}

/**
 * Helper: Format tarikh ke ISO string (YYYY-MM-DD)
 */
function formatDateToISO(dateValue) {
  if (!dateValue) return '';

  const date = (dateValue instanceof Date) ? dateValue : new Date(dateValue);

  // Check if valid date
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Mengambil data untuk graf tahunan.
 */
function getYearlyGraphData(year) {
    const allMonthlyData = getSheetData('KutipanBulanan');
    const yearData = allMonthlyData.filter(row => row.Tahun === parseInt(year));
    
    const monthOrder = ["JANUARI", "FEBRUARI", "MAC", "APRIL", "MEI", "JUN", "JULAI", "OGOS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DISEMBER"];
    yearData.sort((a, b) => monthOrder.indexOf(a.Bulan) - monthOrder.indexOf(b.Bulan));

    return {
        tahun: year,
        labels: yearData.map(row => row.Bulan.substring(0, 3)),
        data: yearData.map(row => row.JumlahBulanan)
    };
}

// --- FUNGSI BANTUAN (HELPER FUNCTIONS) ---

/**
 * Fungsi generik untuk membaca mana-mana tab dan menukarkannya kepada format objek JSON.
 * VERSI PALING SELAMAT: Menguruskan sel kosong, '-', koma, dan mengabaikan lajur tanpa tajuk.
 */
function getSheetData(sheetName) {
  const sheet = SPREADSHEET.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  
  const headers = data.shift().map(header => {
    return (typeof header === 'string' || header instanceof String) ? header.replace(/\s+/g, '') : null;
  });

  const numericHeaders = [
    'Tahun', 'Minggu1', 'Minggu2', 'Minggu3', 'Minggu4', 'Minggu5',
    'JumlahBulanan', 'SasaranKutipan', 'JumlahTerkumpul', 'RM'
  ];

  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      if (header) {
        let value = row[index];
        
        if (numericHeaders.includes(header)) {
          let valueAsString = String(value);
          let valueWithoutCommas = valueAsString.replace(/,/g, '');
          
          value = (valueWithoutCommas === '' || valueWithoutCommas === '-') ? 0 : valueWithoutCommas;
          obj[header] = parseFloat(value) || 0;
        } else {
          obj[header] = value;
        }
      }
    });
    return obj;
  });
}

/**
 * Mengambil data dari tab Konfigurasi.
 */
function getConfig() {
  const configSheet = SPREADSHEET.getSheetByName('Konfigurasi');
  if (!configSheet) return null;
  const data = configSheet.getDataRange().getValues();
  const config = {};
  data.slice(1).forEach(row => {
      if (row[0]) {
          config[row[0].replace(/\s+/g, '')] = row[1];
      }
  });
  return config;
}

/**
 * Menentukan tahun dan bulan sebelumnya.
 */
function getPreviousMonth(year, month) {
    const monthNames = ["JANUARI", "FEBRUARI", "MAC", "APRIL", "MEI", "JUN", "JULAI", "OGOS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DISEMBER"];
    let monthIndex = monthNames.indexOf(month.toUpperCase());
    
    return (monthIndex === 0) 
      ? { year: year - 1, month: "DISEMBER" } 
      : { year: year, month: monthNames[monthIndex - 1] };
}

/**
 * Menghasilkan output dalam format JSON yang standard.
 */
function outputJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}