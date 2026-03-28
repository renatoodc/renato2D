import { signIn, signOut, resetPassword, getSession, onAuthStateChange, updatePassword, getCurrentUser } from './auth.js';
import { loadReservations, saveReservation, deleteReservation, loadExpenses, saveExpense, deleteExpense, loadDemoData } from './db.js';

// ============================
// STATE
// ============================
let state = {
    selectedYear: 2026,
    selectedMonth: new Date().getMonth() + 1,
    selectedReservationMonth: new Date().getMonth() + 1,
    selectedChartYears: [2026],
    guestSort: { field: 'freq', direction: 'desc' },
    expenseSort: { field: 'date', direction: 'desc' },
    reservationSort: { field: 'checkIn', direction: 'desc' },
    dashboardSort: { field: 'monthNum', direction: 'asc' },
    reservations: [],
    expenses: [],
    isLoggedIn: false,
    currentUser: null
};

// Save only UI preferences to localStorage (not data)
function savePreferences() {
    const prefs = {
        selectedYear: state.selectedYear,
        selectedMonth: state.selectedMonth,
        selectedReservationMonth: state.selectedReservationMonth,
        selectedChartYears: state.selectedChartYears,
        guestSort: state.guestSort,
        expenseSort: state.expenseSort,
        reservationSort: state.reservationSort,
        dashboardSort: state.dashboardSort
    };
    localStorage.setItem('airbnb_ui_prefs', JSON.stringify(prefs));
}

function loadPreferences() {
    try {
        const prefs = JSON.parse(localStorage.getItem('airbnb_ui_prefs'));
        if (prefs) {
            state.selectedYear = prefs.selectedYear || state.selectedYear;
            state.selectedMonth = prefs.selectedMonth || state.selectedMonth;
            state.selectedReservationMonth = prefs.selectedReservationMonth || state.selectedReservationMonth;
            state.selectedChartYears = prefs.selectedChartYears || state.selectedChartYears;
            state.guestSort = prefs.guestSort || state.guestSort;
            state.expenseSort = prefs.expenseSort || state.expenseSort;
            state.reservationSort = prefs.reservationSort || state.reservationSort;
            state.dashboardSort = prefs.dashboardSort || state.dashboardSort;
        }
    } catch (e) {
        // ignore
    }
}

// ============================
// TOAST NOTIFICATIONS
// ============================
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'alert-circle',
        info: 'info'
    };
    
    toast.innerHTML = `
        <i data-lucide="${icons[type] || 'info'}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

// ============================
// FORMATTING
// ============================
function formatDateBR(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
}

// ============================
// NAVIGATION
// ============================
window.switchView = (viewName, extra = null) => {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.style.display = 'block';
    
    if (extra) {
        if (viewName === 'expense-details') {
            state.selectedMonth = extra;
            renderMonthlyDetails();
        } else if (viewName === 'reservation-details') {
            state.selectedReservationMonth = extra;
            renderMonthlyReservations();
        }
    }

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const label = item.textContent.toLowerCase();
        const isExpenseView = viewName.startsWith('expense');
        const isReservationView = viewName.startsWith('reservation');
        
        if (label.includes(isReservationView ? 'reservas' : viewName === 'guests' ? 'hóspedes' : isExpenseView ? 'despesas' : viewName.includes('chart') ? 'gráficos' : viewName)) {
            item.classList.add('active');
        }
    });
};

// ============================
// RENDER ALL
// ============================
function renderAll() {
    renderYearSelector();
    renderDashboard();
    renderMonthlyFinancials();
    renderMonths();
    renderReservationMonths();
    renderMonthlyDetails();
    renderMonthlyReservations();
    renderGuests();
    renderCharts();
}

window.changeYear = (year) => {
    state.selectedYear = parseInt(year);
    savePreferences();
    renderAll();
};

// ============================
// YEAR SELECTOR
// ============================
function renderYearSelector() {
    ['dash-year-select', 'res-year-select', 'exp-year-select'].forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;

        const startYear = 2020;
        const endYear = 2030;
        let options = '';
        for (let y = endYear; y >= startYear; y--) {
            options += `<option value="${y}" ${y === state.selectedYear ? 'selected' : ''}>${y}</option>`;
        }
        select.innerHTML = options;
    });
}

// ============================
// DASHBOARD
// ============================
function renderDashboard() {
    const year = state.selectedYear;
    const filteredRes = state.reservations.filter(r => new Date(r.checkIn).getFullYear() === year);
    const filteredExp = state.expenses.filter(e => new Date(e.date).getFullYear() === year);

    const revenue = filteredRes.reduce((sum, r) => sum + r.value, 0);
    const expenses = filteredExp.reduce((sum, e) => sum + e.value, 0);
    
    const guestSet = new Set();
    filteredRes.forEach(r => r.guests.forEach(g => {
        if (g.name && g.name.trim()) {
            const key = `${g.name.trim().toLowerCase()}_${g.cpf ? g.cpf.trim() : 'no-cpf'}`;
            guestSet.add(key);
        }
    }));

    document.getElementById('dash-revenue').textContent = `R$ ${revenue.toLocaleString()}`;
    document.getElementById('dash-expenses').textContent = `R$ ${expenses.toLocaleString()}`;
    document.getElementById('dash-guests').textContent = guestSet.size;
    document.getElementById('dash-balance').textContent = `R$ ${(revenue - expenses).toLocaleString()}`;
    
    const tableBody = document.getElementById('dash-bookings-body');
    if (!tableBody) return;
    
    const today = new Date().toISOString().split('T')[0];
    const activeRes = state.reservations.filter(r => r.checkIn <= today && r.checkOut >= today);

    tableBody.innerHTML = activeRes.map(r => `
        <tr class="fade-in">
            <td style="font-weight: 700;">${r.mainGuest}</td>
            <td>${formatDateBR(r.checkIn)}</td>
            <td>${formatDateBR(r.checkOut)}</td>
            <td><span class="status-badge status-confirmed" style="background: rgba(46, 204, 113, 0.4); color: white; border: 1px solid rgba(46, 204, 113, 0.4); font-size: 0.75rem;">Em andamento</span></td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center; opacity:0.5; padding: 20px;">Nenhuma reserva ativa para hoje</td></tr>';
}

// ============================
// MONTHLY FINANCIALS
// ============================
function renderMonthlyFinancials() {
    const tableBody = document.getElementById('dash-monthly-finance-body');
    const title = document.getElementById('dash-monthly-title');
    if (!tableBody) return;

    if (title) title.textContent = `Balanço Mensal (${state.selectedYear})`;

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const year = state.selectedYear;
    
    const data = months.map((m, i) => {
        const monthNum = i + 1;
        const monthlyRevenue = state.reservations
            .filter(r => {
                const d = new Date(r.checkIn);
                return d.getMonth() + 1 === monthNum && d.getFullYear() === year;
            })
            .reduce((sum, r) => sum + r.value, 0);
            
        const monthlyExpenses = state.expenses
            .filter(e => {
                const d = new Date(e.date);
                return d.getMonth() + 1 === monthNum && d.getFullYear() === year;
            })
            .reduce((sum, e) => sum + e.value, 0);
            
        return {
            month: m,
            monthNum: monthNum,
            revenue: monthlyRevenue,
            expenses: monthlyExpenses,
            balance: monthlyRevenue - monthlyExpenses
        };
    });

    data.sort((a, b) => {
        const field = state.dashboardSort.field;
        const dir = state.dashboardSort.direction === 'asc' ? 1 : -1;
        if (field === 'monthNum') return (a.monthNum - b.monthNum) * dir;
        return (a[field] - b[field]) * dir;
    });

    tableBody.innerHTML = data.map(item => {
        const balanceColor = item.balance >= 0 ? '#4cd137' : '#e64d5d';
        return `
            <tr>
                <td style="font-weight: 600">${item.month}</td>
                <td style="color: #4cd137; font-weight: 700">R$ ${item.revenue.toLocaleString()}</td>
                <td style="color: #e64d5d; font-weight: 700">R$ ${item.expenses.toLocaleString()}</td>
                <td style="color: ${balanceColor}; font-weight: 800">R$ ${item.balance.toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}

window.setDashboardSort = (field) => {
    if (state.dashboardSort.field === field) {
        state.dashboardSort.direction = state.dashboardSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.dashboardSort.field = field;
        state.dashboardSort.direction = 'desc';
    }
    savePreferences();
    renderAll();
};

// ============================
// EXPENSE MONTHS
// ============================
function renderMonths() {
    const grid = document.getElementById('month-grid');
    if (!grid) return;
    
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    grid.innerHTML = months.map((m, i) => {
        const monthNum = i + 1;
        const total = state.expenses
            .filter(e => {
                const d = new Date(e.date);
                return d.getMonth() + 1 === monthNum && d.getFullYear() === state.selectedYear;
            })
            .reduce((sum, e) => sum + e.value, 0);
            
        return `
            <div class="month-card card" onclick="switchView('expense-details', ${monthNum})">
                <h3>${m}</h3>
                <p style="color: #e64d5d; font-weight: 800; font-size: 1.2rem;">- R$ ${total.toLocaleString()}</p>
                <span style="font-size: 0.8rem; opacity: 0.6">Clique para ver detalhes</span>
            </div>
        `;
    }).join('');
}

// ============================
// EXPENSE DETAILS
// ============================
function renderMonthlyDetails() {
    const listBody = document.getElementById('expenses-details-body');
    const title = document.getElementById('selected-month-title');
    if (!listBody) return;

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    title.textContent = `Despesas de ${months[state.selectedMonth - 1]}`;

    const filtered = state.expenses
        .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() + 1 === state.selectedMonth && d.getFullYear() === state.selectedYear;
        })
        .sort((a, b) => {
            const field = state.expenseSort.field;
            const dir = state.expenseSort.direction === 'asc' ? 1 : -1;
            if (field === 'value') return (a.value - b.value) * dir;
            if (field === 'date') return (new Date(a.date) - new Date(b.date)) * dir;
            return (a[field] || '').toString().localeCompare((b[field] || '').toString()) * dir;
        });

    listBody.innerHTML = filtered.map(e => `
        <tr>
            <td><span class="status-badge" style="background: rgba(230, 77, 93, 0.1); color: var(--primary)">${e.category || 'Outros'}</span></td>
            <td>${e.description || '<span style="opacity:0.4 italic">Sem descrição</span>'}</td>
            <td>${formatDateBR(e.date)}</td>
            <td style="font-weight:800; color: #e64d5d">- R$ ${e.value.toLocaleString()}</td>
            <td>
                <div style="display:flex; gap:5px;">
                    <button onclick="showModal('expense', ${e.id})" class="btn-secondary" style="padding: 5px 10px;">Editar</button>
                    <button onclick="handleDelete('expenses', ${e.id})" class="btn-secondary" style="padding: 5px 10px; background: #c0392b;">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.setExpenseSort = (field) => {
    if (state.expenseSort.field === field) {
        state.expenseSort.direction = state.expenseSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.expenseSort.field = field;
        state.expenseSort.direction = 'desc';
    }
    savePreferences();
    renderAll();
};

// ============================
// RESERVATION MONTHS
// ============================
function renderReservationMonths() {
    const grid = document.getElementById('res-month-grid');
    if (!grid) return;

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    grid.innerHTML = months.map((m, i) => {
        const monthNum = i + 1;
        const filteredRes = state.reservations.filter(r => {
            const d = new Date(r.checkIn);
            return d.getMonth() + 1 === monthNum && d.getFullYear() === state.selectedYear;
        });
        const bookings = filteredRes.length;
        const totalRevenue = filteredRes.reduce((sum, r) => sum + r.value, 0);

        return `
            <div class="month-card card" onclick="switchView('reservation-details', ${monthNum})">
                <h3>${m}</h3>
                <p style="color: #4cd137; font-weight: 800; font-size: 1.1rem; margin: 5px 0;">+ R$ ${totalRevenue.toLocaleString()}</p>
                <p style="color: var(--primary); font-weight: 600; font-size: 0.9rem; margin-bottom: 5px;">${bookings} Reservas</p>
                <span style="font-size: 0.8rem; opacity: 0.6">Clique para ver detalhes</span>
            </div>
        `;
    }).join('');
}

// ============================
// RESERVATION DETAILS
// ============================
function renderMonthlyReservations() {
    const listBody = document.getElementById('reservations-details-body');
    const title = document.getElementById('selected-res-month-title');
    if (!listBody) return;

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    title.textContent = `Reservas de ${months[state.selectedReservationMonth - 1]}`;

    const filtered = state.reservations
        .filter(r => {
            const d = new Date(r.checkIn);
            return d.getMonth() + 1 === state.selectedReservationMonth && d.getFullYear() === state.selectedYear;
        })
        .sort((a, b) => {
            const field = state.reservationSort.field;
            const dir = state.reservationSort.direction === 'asc' ? 1 : -1;
            if (field === 'value') return (a.value - b.value) * dir;
            if (field === 'checkIn') return (new Date(a.checkIn) - new Date(b.checkIn)) * dir;
            if (field === 'checkOut') return (new Date(a.checkOut) - new Date(b.checkOut)) * dir;
            return (a.mainGuest || '').toString().localeCompare((b.mainGuest || '').toString()) * dir;
        });

    listBody.innerHTML = filtered.map(r => `
        <tr>
            <td style="font-weight:700">${r.mainGuest}</td>
            <td style="font-size: 0.9rem; opacity: 0.8">${r.guests.map(g => `${g.name} (${g.cpf || 'N/A'})`).join('<br>')}</td>
            <td>${formatDateBR(r.checkIn)}</td>
            <td>${formatDateBR(r.checkOut)}</td>
            <td style="font-weight:800; color: #4cd137">R$ ${r.value.toLocaleString()}</td>
            <td>
                <div style="display:flex; gap:5px;">
                    <button onclick="showModal('guest', ${r.id})" class="btn-secondary" style="padding: 5px 10px;">Editar</button>
                    <button onclick="handleDelete('reservations', ${r.id})" class="btn-secondary" style="padding: 5px 10px; background: #c0392b;">Excluir</button>
                </div>
            </td>
        </tr>
    `).join('');
}

window.setReservationSort = (field) => {
    if (state.reservationSort.field === field) {
        state.reservationSort.direction = state.reservationSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.reservationSort.field = field;
        state.reservationSort.direction = 'desc';
    }
    savePreferences();
    renderAll();
};

// ============================
// GUESTS
// ============================
function renderGuests() {
    const listBody = document.getElementById('guests-freq-body');
    if (!listBody) return;

    const guestMap = new Map();
    state.reservations.forEach(r => {
        r.guests.forEach(g => {
            if (!g.name || !g.name.trim()) return;
            const key = `${g.name.trim().toLowerCase()}_${g.cpf ? g.cpf.trim() : 'no-cpf'}`;
            if (!guestMap.has(key)) {
                guestMap.set(key, { name: g.name.trim(), cpf: g.cpf, freq: 0, lastCheckIn: r.checkIn });
            }
            const data = guestMap.get(key);
            data.freq++;
            if (new Date(r.checkIn) > new Date(data.lastCheckIn)) data.lastCheckIn = r.checkIn;
        });
    });

    const guestList = Array.from(guestMap.values());
    const totalCounter = document.getElementById('total-guests-count');
    if (totalCounter) totalCounter.textContent = guestList.length;

    guestList.sort((a, b) => {
        let valA = a[state.guestSort.field];
        let valB = b[state.guestSort.field];

        if (state.guestSort.field === 'lastCheckIn') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
        }

        if (valA < valB) return state.guestSort.direction === 'asc' ? -1 : 1;
        if (valA > valB) return state.guestSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    listBody.innerHTML = guestList.map(g => `
        <tr class="fade-in">
            <td style="font-weight: 700;">${g.name}</td>
            <td style="color: var(--text-secondary);">${g.cpf || '-'}</td>
            <td>
                <span class="status-badge status-confirmed" style="background: var(--primary-glow); color: var(--text-primary); border: 1px solid var(--primary);">
                    ${g.freq} ${g.freq === 1 ? 'estadia' : 'estadias'}
                </span>
            </td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--primary);"></i>
                    ${new Date(g.lastCheckIn).toLocaleDateString('pt-BR')}
                </div>
            </td>
        </tr>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
}

window.setGuestSort = (field) => {
    if (state.guestSort.field === field) {
        state.guestSort.direction = state.guestSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.guestSort.field = field;
        state.guestSort.direction = field === 'name' ? 'asc' : 'desc';
    }
    savePreferences();
    renderAll();
};

// ============================
// CHARTS
// ============================
let mainChart = null;

function renderCharts() {
    const container = document.getElementById('chart-year-filters');
    if (!container) return;

    const startYear = 2020;
    const endYear = 2030;
    let yearCheckboxes = '';
    for (let y = endYear; y >= startYear; y--) {
        yearCheckboxes += `
            <label style="display:flex; align-items:center; gap:5px; background: #333; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 0.85rem;">
                <input type="checkbox" value="${y}" ${state.selectedChartYears.includes(y) ? 'checked' : ''} onchange="window.toggleChartYear(${y})">
                ${y}
            </label>
        `;
    }
    container.innerHTML = yearCheckboxes;

    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    const datasets = [];
    state.selectedChartYears.forEach((year, idx) => {
        const revData = [];
        const expData = [];
        const profitData = [];

        for (let m = 1; m <= 12; m++) {
            const revenue = state.reservations
                .filter(r => {
                    const d = new Date(r.checkIn);
                    return d.getMonth() + 1 === m && d.getFullYear() === year;
                })
                .reduce((sum, r) => sum + r.value, 0);

            const expenses = state.expenses
                .filter(e => {
                    const d = new Date(e.date);
                    return d.getMonth() + 1 === m && d.getFullYear() === year;
                })
                .reduce((sum, e) => sum + e.value, 0);

            revData.push(revenue);
            expData.push(expenses);
            profitData.push(revenue - expenses);
        }

        const colors = [
            { rev: '#4cd137', exp: '#e64d5d', prof: '#00a8ff' },
            { rev: '#fbc531', exp: '#9c88ff', prof: '#487eb0' }
        ];
        const c = colors[idx % colors.length];

        datasets.push({
            label: `Receita ${year}`,
            data: revData,
            backgroundColor: c.rev + '33',
            borderColor: c.rev,
            borderWidth: 2,
            tension: 0.4,
            type: 'bar',
            hidden: state.selectedChartYears.length > 2
        });
        datasets.push({
            label: `Despesas ${year}`,
            data: expData,
            backgroundColor: c.exp + '33',
            borderColor: c.exp,
            borderWidth: 2,
            tension: 0.4,
            type: 'bar',
            hidden: state.selectedChartYears.length > 2
        });
        datasets.push({
            label: `Lucro ${year}`,
            data: profitData,
            backgroundColor: 'transparent',
            borderColor: c.prof,
            borderWidth: 3,
            pointRadius: 4,
            tension: 0.4,
            type: 'line'
        });
    });

    if (mainChart) mainChart.destroy();
    
    mainChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: months, datasets: datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#888' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#888' }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#ccc', font: { family: 'Outfit' }, boxWidth: 12 }
                },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleColor: '#fff',
                    bodyColor: '#ccc',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true
                }
            }
        }
    });
}

window.toggleChartYear = (year) => {
    if (state.selectedChartYears.includes(year)) {
        state.selectedChartYears = state.selectedChartYears.filter(y => y !== year);
    } else {
        state.selectedChartYears.push(year);
    }
    savePreferences();
    renderAll();
};

// ============================
// MODALS & GUEST FIELDS
// ============================
window.addGuestField = (name = '', cpf = '') => {
    const container = document.getElementById('guests-container');
    const div = document.createElement('div');
    div.className = 'guest-row';
    div.innerHTML = `
        <input type="text" placeholder="Nome do Hóspede" class="form-input guest-name" value="${name}" required style="padding-left: 15px;">
        <input type="text" placeholder="CPF" class="form-input guest-cpf" value="${cpf}" required style="padding-left: 15px;">
        <button type="button" onclick="this.parentElement.remove()" class="btn-secondary" style="padding: 10px; border-radius: 12px; color: var(--accent-red); border-color: rgba(234, 32, 39, 0.2);">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
    `;
    container.appendChild(div);
    if (window.lucide) window.lucide.createIcons();
};

window.showModal = (type, editId = null) => {
    const modal = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const fields = document.getElementById('form-fields');
    
    modal.style.display = 'flex';
    fields.innerHTML = '';
    
    let editItem = null;
    if (editId) {
        editItem = type === 'guest' ? state.reservations.find(r => r.id === editId) : state.expenses.find(e => e.id === editId);
    }

    if (type === 'guest') {
        title.innerHTML = `<i data-lucide="calendar-plus" style="margin-right: 10px; vertical-align: middle;"></i> ${editId ? 'Editar Reserva' : 'Nova Reserva'}`;
        fields.innerHTML = `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label>Check-in</label>
                    <div class="input-container">
                        <i data-lucide="calendar-arrow-right"></i>
                        <input type="date" id="r-in" class="form-input" value="${editItem ? editItem.checkIn : ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Check-out</label>
                    <div class="input-container">
                        <i data-lucide="calendar-arrow-down"></i>
                        <input type="date" id="r-out" class="form-input" value="${editItem ? editItem.checkOut : ''}" required>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label>Valor Total da Estadia</label>
                <div class="input-container">
                    <i data-lucide="dollar-sign"></i>
                    <input type="number" id="r-val" class="form-input" placeholder="0.00" value="${editItem ? editItem.value : ''}" required>
                </div>
            </div>

            <div class="form-group">
                <label>Hóspedes do Grupo</label>
                <div class="guests-section">
                    <div id="guests-container"></div>
                    <button type="button" class="btn-modal-secondary" onclick="addGuestField()" style="width:100%; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i data-lucide="user-plus" style="width: 18px; height: 18px;"></i>
                        Adicionar Hóspede
                    </button>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-modal-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar Reserva</button>
            </div>
        `;
        if (editItem) {
            editItem.guests.forEach(g => addGuestField(g.name, g.cpf));
        } else {
            addGuestField();
        }
    } else {
        const categories = ["Energia", "Internet", "Condomínio", "Limpeza", "Gás", "Outros"];
        title.innerHTML = `<i data-lucide="receipt-text" style="margin-right: 10px; vertical-align: middle;"></i> ${editId ? 'Editar Despesa' : 'Nova Despesa'}`;
        fields.innerHTML = `
            <div class="form-group">
                <label>Categoria</label>
                <div class="input-container">
                    <i data-lucide="tag"></i>
                    <select id="e-cat" class="form-input" required style="padding-left: 50px;">
                        ${categories.map(c => `<option value="${c}" ${editItem && editItem.category === c ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Descrição Detalhada</label>
                <div class="input-container">
                    <i data-lucide="info"></i>
                    <input type="text" id="e-desc" class="form-input" placeholder="Ex: Conta de luz Março" value="${editItem ? editItem.description : ''}">
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label>Data</label>
                    <div class="input-container">
                        <i data-lucide="calendar"></i>
                        <input type="date" id="e-date" class="form-input" value="${editItem ? editItem.date : ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Valor</label>
                    <div class="input-container">
                        <i data-lucide="dollar-sign"></i>
                        <input type="number" id="e-val" class="form-input" placeholder="0.00" value="${editItem ? editItem.value : ''}" required>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn-modal-secondary" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Salvar Despesa</button>
            </div>
        `;
    }
    
    if (window.lucide) window.lucide.createIcons();

    const form = document.getElementById('modal-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        showLoading(true);

        try {
            if (type === 'guest') {
                const guestNames = document.querySelectorAll('.guest-name');
                const guestCpfs = document.querySelectorAll('.guest-cpf');
                const guestsList = [];
                guestNames.forEach((input, index) => {
                    guestsList.push({ name: input.value, cpf: guestCpfs[index].value });
                });

                const reservationData = {
                    id: editId || null,
                    mainGuest: guestsList[0].name,
                    guests: guestsList,
                    checkIn: document.getElementById('r-in').value,
                    checkOut: document.getElementById('r-out').value,
                    value: parseFloat(document.getElementById('r-val').value)
                };

                const saved = await saveReservation(reservationData);
                if (saved) {
                    showToast('Reserva salva com sucesso!', 'success');
                } else {
                    showToast('Erro ao salvar reserva.', 'error');
                }
            } else {
                const expenseData = {
                    id: editId || null,
                    category: document.getElementById('e-cat').value,
                    description: document.getElementById('e-desc').value,
                    date: document.getElementById('e-date').value,
                    value: parseFloat(document.getElementById('e-val').value)
                };

                const saved = await saveExpense(expenseData);
                if (saved) {
                    showToast('Despesa salva com sucesso!', 'success');
                } else {
                    showToast('Erro ao salvar despesa.', 'error');
                }
            }

            // Reload data from Supabase
            await refreshData();
            closeModal();
        } catch (err) {
            console.error('Save error:', err);
            showToast('Erro inesperado ao salvar.', 'error');
        } finally {
            showLoading(false);
        }
    };
};

window.closeModal = () => {
    document.getElementById('modal-overlay').style.display = 'none';
};

// ============================
// DELETE (async with Supabase)
// ============================
window.handleDelete = async (list, id) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;

    showLoading(true);
    try {
        let success;
        if (list === 'reservations') {
            success = await deleteReservation(id);
        } else {
            success = await deleteExpense(id);
        }

        if (success) {
            showToast('Item excluído com sucesso!', 'success');
            await refreshData();
        } else {
            showToast('Erro ao excluir item.', 'error');
        }
    } catch (err) {
        console.error('Delete error:', err);
        showToast('Erro inesperado ao excluir.', 'error');
    } finally {
        showLoading(false);
    }
};

// ============================
// DATA REFRESH
// ============================
async function refreshData() {
    state.reservations = await loadReservations();
    state.expenses = await loadExpenses();
    renderAll();
}

// ============================
// AUTH HANDLERS
// ============================
window.handleLogin = async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');
    const btn = document.getElementById('btn-login');

    if (!email || !pass) {
        errorMsg.textContent = 'Preencha todos os campos.';
        errorMsg.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="loading-dots">Entrando...</span>';

    const { data, error } = await signIn(email, pass);

    if (error) {
        errorMsg.textContent = 'Credenciais inválidas. Tente novamente.';
        errorMsg.style.display = 'block';
        btn.disabled = false;
        btn.innerHTML = 'Entrar <i data-lucide="log-in" style="margin-left: 10px;"></i>';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
    }
    // Auth state change handler will handle the rest
};

window.showResetForm = () => {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('reset-form').style.display = 'block';
    document.getElementById('login-title').textContent = 'Recuperar Senha';
    document.getElementById('login-subtitle').textContent = 'Digite seu email para receber o link de recuperação';
    if (window.lucide) window.lucide.createIcons();
};

window.showLoginForm = () => {
    document.getElementById('reset-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('login-title').textContent = 'Bem-vindo';
    document.getElementById('login-subtitle').textContent = 'Acesse sua conta para gerenciar suas finanças';
    if (window.lucide) window.lucide.createIcons();
};

window.handleResetPassword = async () => {
    const email = document.getElementById('reset-email').value;
    const successMsg = document.getElementById('reset-message');
    const errorMsg = document.getElementById('reset-error');
    const btn = document.getElementById('btn-reset');

    if (!email) {
        errorMsg.textContent = 'Digite seu email.';
        errorMsg.style.display = 'block';
        return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Enviando...';

    const { error } = await resetPassword(email);

    if (error) {
        errorMsg.textContent = 'Erro ao enviar email. Verifique o endereço.';
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    } else {
        successMsg.style.display = 'block';
        errorMsg.style.display = 'none';
    }

    btn.disabled = false;
    btn.innerHTML = 'Enviar Link de Recuperação <i data-lucide="send" style="margin-left: 10px;"></i>';
    if (window.lucide) window.lucide.createIcons();
};

window.handleUpdatePassword = async () => {
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;
    const errorMsg = document.getElementById('update-pass-error');

    if (!newPass || !confirmPass) {
        errorMsg.textContent = 'Preencha todos os campos.';
        errorMsg.style.display = 'block';
        return;
    }

    if (newPass !== confirmPass) {
        errorMsg.textContent = 'As senhas não coincidem.';
        errorMsg.style.display = 'block';
        return;
    }

    if (newPass.length < 6) {
        errorMsg.textContent = 'A senha deve ter pelo menos 6 caracteres.';
        errorMsg.style.display = 'block';
        return;
    }

    const { error } = await updatePassword(newPass);

    if (error) {
        errorMsg.textContent = 'Erro ao atualizar senha. Tente novamente.';
        errorMsg.style.display = 'block';
    } else {
        showToast('Senha atualizada com sucesso!', 'success');
        // Redirect to app
        await initApp();
    }
};

window.logout = async () => {
    showLoading(true);
    await signOut();
    state.isLoggedIn = false;
    state.currentUser = null;
    state.reservations = [];
    state.expenses = [];
    showLoading(false);
    location.reload();
};

// Demo data handler
window.handleLoadDemoData = async () => {
    if (!confirm('Isso carregará dados de demonstração na sua conta. Deseja continuar?')) return;

    showLoading(true);
    try {
        const success = await loadDemoData();
        if (success) {
            showToast('Dados demo carregados com sucesso!', 'success');
            await refreshData();
        } else {
            showToast('Erro ao carregar dados demo.', 'error');
        }
    } catch (err) {
        console.error('Demo data error:', err);
        showToast('Erro inesperado.', 'error');
    } finally {
        showLoading(false);
    }
};

// ============================
// AUTH VIEW
// ============================
function updateAuthView() {
    if (state.isLoggedIn) {
        document.body.classList.add('authenticated');
        // Update user info in sidebar
        const emailDisplay = document.getElementById('user-email-display');
        if (emailDisplay && state.currentUser) {
            emailDisplay.textContent = state.currentUser.email;
        }
        // Update avatar
        const avatar = document.getElementById('user-avatar');
        if (avatar && state.currentUser) {
            const name = state.currentUser.email.split('@')[0];
            avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e64d5d&color=fff`;
        }
    } else {
        document.body.classList.remove('authenticated');
    }
    if (window.lucide) window.lucide.createIcons();
}

// ============================
// APP INITIALIZATION
// ============================
let _isInitializing = false;

async function initApp() {
    if (_isInitializing) return;
    _isInitializing = true;
    showLoading(true);
    loadPreferences();

    try {
        const { session } = await getSession();

        if (session) {
            state.isLoggedIn = true;
            state.currentUser = session.user;
            updateAuthView();

            // Load data from Supabase
            state.reservations = await loadReservations();
            state.expenses = await loadExpenses();
            renderAll();
        } else {
            state.isLoggedIn = false;
            updateAuthView();
        }
    } catch (err) {
        console.error('Init error:', err);
        state.isLoggedIn = false;
        updateAuthView();
    } finally {
        showLoading(false);
        _isInitializing = false;
    }
}

// ============================
// AUTH STATE LISTENER
// ============================
onAuthStateChange(async (event, session) => {
    // Skip events that don't require action
    if (event === 'INITIAL_SESSION') return;
    if (event === 'TOKEN_REFRESHED') return;

    if (event === 'SIGNED_IN' && session) {
        // If already logged in (e.g. tab switch), skip the full reload
        if (state.isLoggedIn) return;
        // If initApp is running, let it handle the load
        if (_isInitializing) return;

        state.isLoggedIn = true;
        state.currentUser = session.user;
        updateAuthView();

        showLoading(true);
        try {
            state.reservations = await loadReservations();
            state.expenses = await loadExpenses();
            renderAll();
            showToast('Login realizado com sucesso!', 'success');
        } catch (err) {
            console.error('Auth load error:', err);
            showToast('Erro ao carregar dados.', 'error');
        } finally {
            showLoading(false);
        }
    } else if (event === 'SIGNED_OUT') {
        state.isLoggedIn = false;
        state.currentUser = null;
        state.reservations = [];
        state.expenses = [];
        updateAuthView();
    } else if (event === 'PASSWORD_RECOVERY') {
        // Show update password form
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('reset-form').style.display = 'none';
        document.getElementById('update-password-form').style.display = 'block';
        document.getElementById('login-title').textContent = 'Nova Senha';
        document.getElementById('login-subtitle').textContent = 'Defina sua nova senha de acesso';
    }
});

// ============================
// DOM READY
// ============================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Add event listeners to sidebar
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.onclick = (e) => {
            const hasLogoutClick = item.getAttribute('onclick');
            if (hasLogoutClick && hasLogoutClick.includes('logout')) return; 

            e.preventDefault();
            const label = item.textContent.toLowerCase();
            if (label.includes('dashboard')) switchView('dashboard');
            else if (label.includes('reservas')) switchView('reservations');
            else if (label.includes('despesas')) switchView('expenses');
            else if (label.includes('hóspedes')) switchView('guests');
            else if (label.includes('gráficos')) switchView('charts');
        };
    });
});
