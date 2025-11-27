const jsonDataUrl = "https://raw.githubusercontent.com/multimedia-mamtj6/infaq/main/data/data.json";

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

    } catch (error) {
        console.error("Error loading data:", error);
        set('project-name', "Ralat memuatkan data. Sila refresh.");
        stopLoading(); // Stop shimmer even if error
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
        set('report-year-label', monthlyData.tahun);
        renderMonthlyChart(monthlyData);

    } catch (error) {
        console.error("Error loading report data:", error);
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
}