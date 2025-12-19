const jsonDataUrl = "https://raw.githubusercontent.com/multimedia-mamtj6/infaq/main/data/data.json";

// Version management - Single source of truth
const APP_VERSION = "2.1";

// Helper: Format Currency
function formatCurrency(amount) {
    if (typeof amount !== 'number') return "RM 0.00";
    return `RM ${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper: Update Text Content safely
function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// Helper: Toggle Loading State
function stopLoading() {
    // Hide all skeleton loaders
    document.querySelectorAll('.skeleton').forEach(el => {
        el.classList.remove('skeleton');
        el.classList.add('fade-in'); // Add nice fade-in effect
    });
}

// Helper: Update version display in footer
function updateVersionDisplay() {
    const versionElement = document.getElementById('app-version');
    if (versionElement) {
        versionElement.textContent = `v${APP_VERSION}`;
    }
}

// Helper: Update copyright year to current year
function updateCopyrightYear() {
    const copyrightElement = document.getElementById('copyright-year');
    if (copyrightElement) {
        copyrightElement.textContent = new Date().getFullYear();
    }
}

// Helper: Initialize footer with version and year
function initializeFooter() {
    updateVersionDisplay();
    updateCopyrightYear();
}

async function loadDashboard() {
    try {
        // Fetch Data
        const response = await fetch(`${jsonDataUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        // --- 1. Update Project Section ---
        const p = data.projek;
        set('project-name', p.NamaProjek);
        set('project-raised', formatCurrency(p.JumlahTerkumpul));
        set('project-target', formatCurrency(p.SasaranKutipan).replace('.00', ''));

        // Update Progress Bar
        const bar = document.getElementById('project-bar');
        const percentageText = document.getElementById('project-percent');

        if (bar && percentageText) {
            // Small delay for animation
            setTimeout(() => {
                bar.style.width = `${p.Peratusan}%`;
                percentageText.textContent = `${p.Peratusan}%`;
            }, 100);
        }

        // --- 2. Update Monthly Stats ---
        const k = data.ringkasan.kutipan;

        // Current Month
        set('lbl-month-curr', `Bulan Ini (${k.bulanIni.bulan})`);
        set('val-month-curr', formatCurrency(k.bulanIni.jumlah));

        // Last Month
        set('lbl-month-prev', `Bulan Lepas (${k.bulanLepas.bulan})`);
        set('val-month-prev', formatCurrency(k.bulanLepas.jumlah));

        // Yearly
        set('lbl-year-curr', `Tahun Ini (${k.tahunIni.tahun})`);
        set('val-year-curr', formatCurrency(k.tahunIni.jumlah));

        // --- 3. Footer Timestamp ---
        const dateObj = new Date(data.tarikhKemaskini);
        const formattedDate = dateObj.toLocaleString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
        });
        ['last-update', 'status-update'].forEach(id => set(id, formattedDate));

        // Remove Skeletons to reveal data
        stopLoading();

        // Initialize footer
        initializeFooter();

    } catch (error) {
        console.error("Error loading data:", error);
        set('project-name', "Ralat memuatkan data. Sila refresh.");
        stopLoading(); // Stop shimmer even if error
        initializeFooter(); // Initialize footer even if data load fails
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', loadDashboard);

// Auto-refresh every 5 minutes
// Auto-refresh every 5 minutes
setInterval(loadDashboard, 300000);

// --- REPORT PAGE LOGIC ---

let weeklyChartInstance = null;
let monthlyChartInstance = null;
let pastYearChartInstances = {};

async function loadReport() {
    try {
        // Fetch Data
        const response = await fetch(`${jsonDataUrl}?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        // 1. Update Summary Card
        const k = data.ringkasan.kutipan.bulanIni;
        set('report-month-total', formatCurrency(k.jumlah));
        set('report-month-name', `(${k.bulan})`);

        // Update Footer Timestamp
        const dateObj = new Date(data.tarikhKemaskini);
        set('last-update', dateObj.toLocaleString('en-US', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
        }));

        // 2. Render Weekly Chart
        const weeklyData = data.paparanBulanIni;
        renderWeeklyChart(weeklyData);

        // 3. Render Monthly Chart
        const currentYear = new Date().getFullYear().toString();
        const monthlyData = data.graf[currentYear] || data.graf["2025"]; // Fallback to 2025 if current year not found
        set('report-year-label', `Tahun ${monthlyData.tahun}`);
        renderMonthlyChart(monthlyData);

        // 4. Render Past Years Charts
        renderPastYearsCharts(data.graf, currentYear);

        // Initialize footer
        initializeFooter();

    } catch (error) {
        console.error("Error loading report data:", error);
        initializeFooter(); // Initialize footer even if data load fails
    }
}

function renderWeeklyChart(data) {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    if (weeklyChartInstance) weeklyChartInstance.destroy();

    weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4', 'Minggu 5'],
            datasets: [{
                label: 'Kutipan (RM)',
                data: [data.Minggu1, data.Minggu2, data.Minggu3, data.Minggu4, data.Minggu5],
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                barThickness: 20,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [2, 4], color: '#e2e8f0' },
                    ticks: { callback: (value) => 'RM ' + value }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function renderMonthlyChart(data) {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    if (monthlyChartInstance) monthlyChartInstance.destroy();

    monthlyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Kutipan Bulanan',
                data: data.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [2, 4], color: '#e2e8f0' },
                    ticks: { callback: (value) => 'RM ' + value }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // Calculate and display total sum
    const totalSum = data.data.reduce((sum, value) => sum + value, 0);
    set('current-year-total', formatCurrency(totalSum));
}

function renderPastYearsCharts(grafData, currentYear) {
    // 1. Destroy all existing past year chart instances
    Object.keys(pastYearChartInstances).forEach(year => {
        if (pastYearChartInstances[year]) {
            pastYearChartInstances[year].destroy();
        }
    });
    pastYearChartInstances = {};

    // 2. Get all years except current year, sorted descending (most recent first)
    const allYears = Object.keys(grafData);
    const pastYears = allYears
        .filter(year => year !== currentYear)
        .sort((a, b) => b - a);

    // 3. If no past years, hide section and return
    if (pastYears.length === 0) {
        const section = document.getElementById('past-years-section');
        if (section) section.classList.add('hidden');
        return;
    }

    // 4. Show section and get elements
    const section = document.getElementById('past-years-section');
    const dropdown = document.getElementById('year-selector');
    const container = document.getElementById('past-years-container');

    if (!section || !dropdown || !container) return;

    section.classList.remove('hidden');
    container.innerHTML = '';

    // 5. Populate dropdown with year options
    dropdown.innerHTML = '';
    pastYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        dropdown.appendChild(option);
    });

    // 6. Auto-select most recent past year (first in list)
    const mostRecentPastYear = pastYears[0];
    dropdown.value = mostRecentPastYear;

    // 7. Render chart for auto-selected year
    handleYearSelection(mostRecentPastYear, grafData);

    // 8. Attach event listener for dropdown changes
    dropdown.addEventListener('change', (e) => {
        handleYearSelection(e.target.value, grafData);
    });
}

function handleYearSelection(selectedYear, grafData) {
    const container = document.getElementById('past-years-container');
    if (!container) return;

    // 1. Destroy existing chart instances
    Object.keys(pastYearChartInstances).forEach(year => {
        if (pastYearChartInstances[year]) {
            pastYearChartInstances[year].destroy();
        }
    });
    pastYearChartInstances = {};

    // 2. Clear container
    container.innerHTML = '';

    // 3. Get year data
    const yearData = grafData[selectedYear];

    // 4. Create full-width chart card
    const card = document.createElement('div');
    card.className = 'bg-white p-6 rounded-2xl shadow-sm border border-slate-200 fade-in-up';

    card.innerHTML = `
        <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-slate-700 flex items-center gap-2">
                <i class="ph-fill ph-trend-up text-blue-500"></i>
                Trend Tahunan
            </h3>
            <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                Tahun ${yearData.tahun}
            </span>
        </div>
        <div class="h-64 w-full">
            <canvas id="chart-year-${selectedYear}"></canvas>
        </div>
        <!-- Total Sum Display -->
        <div class="mt-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div class="flex items-center gap-3">
                <div class="bg-blue-100 p-2 rounded-lg">
                    <i class="ph-fill ph-coins text-blue-600 text-xl"></i>
                </div>
                <div class="flex-1">
                    <p class="text-slate-600 text-sm">Jumlah Tahunan</p>
                    <p class="text-slate-800 font-bold text-lg" id="past-year-total-${selectedYear}">RM 0.00</p>
                </div>
            </div>
        </div>
    `;

    container.appendChild(card);

    // 5. Render chart
    renderPastYearChart(selectedYear, yearData);
}

function renderPastYearChart(year, data) {
    const ctx = document.getElementById(`chart-year-${year}`);
    if (!ctx) return;

    const chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: `Kutipan Bulanan ${year}`,
                data: data.data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return formatCurrency(context.raw);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { borderDash: [2, 4], color: '#e2e8f0' },
                    ticks: { callback: (value) => 'RM ' + value }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    pastYearChartInstances[year] = chartInstance;

    // Calculate and display total sum
    const totalSum = data.data.reduce((sum, value) => sum + value, 0);
    set(`past-year-total-${year}`, formatCurrency(totalSum));
}