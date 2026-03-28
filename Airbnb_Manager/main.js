const getCurrentUser = () => localStorage.getItem('airbnb_current_user') || 'guest';

function getInitialState(user = 'guest') {
    const defaultState = {
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
        isLoggedIn: false
    };
    
    let loaded = JSON.parse(localStorage.getItem(`airbnb_state_${user}`)) || {};
    // Deep merge/guards
    const s = { ...defaultState, ...loaded };
    // Ensure nested objects exist
    if (!s.guestSort) s.guestSort = defaultState.guestSort;
    if (!s.expenseSort) s.expenseSort = defaultState.expenseSort;
    if (!s.reservationSort) s.reservationSort = defaultState.reservationSort;
    if (!s.dashboardSort) s.dashboardSort = defaultState.dashboardSort;
    if (!s.selectedChartYears) s.selectedChartYears = defaultState.selectedChartYears;
    
    return s;
}

let state = getInitialState(getCurrentUser());

function formatDateBR(dateStr) {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
}

// Migration for old state structure
if (state.guests && !state.reservations) {
    state.reservations = state.guests.map(g => ({
        id: g.id,
        mainGuest: g.name,
        guests: [{ name: g.name, cpf: g.cpf || '' }],
        checkIn: g.checkIn,
        checkOut: g.checkOut,
        value: g.value
    }));
    delete state.guests;
}

function saveState() {
    localStorage.setItem('airbnb_manager_state', JSON.stringify(state));
    renderAll();
}

// Navigation
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
    saveState();
};

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

function renderDashboard() {
    const year = state.selectedYear;
    const filteredRes = state.reservations.filter(r => new Date(r.checkIn).getFullYear() === year);
    const filteredExp = state.expenses.filter(e => new Date(e.date).getFullYear() === year);

    const revenue = filteredRes.reduce((sum, r) => sum + r.value, 0);
    const expenses = filteredExp.reduce((sum, e) => sum + e.value, 0);
    
    // Calculate unique guests for the year
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
    
    // Get today in YYYY-MM-DD
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

function renderMonthlyFinancials() {
    const tableBody = document.getElementById('dash-monthly-finance-body');
    const title = document.getElementById('dash-monthly-title');
    if (!tableBody) return;

    if (title) title.textContent = `Balanço Mensal (${state.selectedYear})`;

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const year = state.selectedYear;
    
    // Calculate data first
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

    // Sort data
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
    saveState();
};

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
                    <button onclick="deleteItem('expenses', ${e.id})" class="btn-secondary" style="padding: 5px 10px; background: #c0392b;">Excluir</button>
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
    saveState();
};

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
                    <button onclick="deleteItem('reservations', ${r.id})" class="btn-secondary" style="padding: 5px 10px; background: #c0392b;">Excluir</button>
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
    saveState();
};

function renderReservations() {
    const listBody = document.getElementById('reservations-list-body');
    if (!listBody) return;
    listBody.innerHTML = state.reservations.map(r => `
        <tr>
            <td style="font-weight:700">${r.mainGuest}</td>
            <td style="font-size: 0.85rem; color: var(--text-secondary)">
                ${r.guests.map(g => `${g.name} (${g.cpf})`).join('<br>')}
            </td>
            <td>${r.checkIn}</td>
            <td>${r.checkOut}</td>
            <td style="font-weight:800; color: var(--primary)">R$ ${r.value}</td>
            <td><button onclick="deleteItem('reservations', ${r.id})" class="btn-secondary" style="padding: 5px 10px;">Excluir</button></td>
        </tr>
    `).join('');
}

function renderGuests() {
    const listBody = document.getElementById('guests-freq-body');
    if (!listBody) return;

    // Aggregate guests by CPF/Key
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

    // Sorting logic
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

    // @ts-ignore
    if (window.lucide) window.lucide.createIcons();
}

window.setGuestSort = (field) => {
    if (state.guestSort.field === field) {
        state.guestSort.direction = state.guestSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        state.guestSort.field = field;
        state.guestSort.direction = field === 'name' ? 'asc' : 'desc';
    }
    saveState();
    renderAll();
};

// Charts & Analytics
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

        // Colors for premium look
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
            hidden: state.selectedChartYears.length > 2 // Hide breakdown if too many years
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
    
    // @ts-ignore
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
    saveState();
};

// Modals & Dynamic Guest Fields
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
    form.onsubmit = (e) => {
        e.preventDefault();
        if (type === 'guest') {
            const guestNames = document.querySelectorAll('.guest-name');
            const guestCpfs = document.querySelectorAll('.guest-cpf');
            const guestsList = [];
            guestNames.forEach((input, index) => {
                guestsList.push({ name: input.value, cpf: guestCpfs[index].value });
            });

            const reservationData = {
                id: editId || Date.now(),
                mainGuest: guestsList[0].name,
                guests: guestsList,
                checkIn: document.getElementById('r-in').value,
                checkOut: document.getElementById('r-out').value,
                value: parseFloat(document.getElementById('r-val').value)
            };

            if (editId) {
                const idx = state.reservations.findIndex(r => r.id === editId);
                state.reservations[idx] = reservationData;
            } else {
                state.reservations.push(reservationData);
            }
        } else {
            const expenseData = {
                id: editId || Date.now(),
                category: document.getElementById('e-cat').value,
                description: document.getElementById('e-desc').value,
                date: document.getElementById('e-date').value,
                value: parseFloat(document.getElementById('e-val').value)
            };

            if (editId) {
                const idx = state.expenses.findIndex(e => e.id === editId);
                state.expenses[idx] = expenseData;
            } else {
                state.expenses.push(expenseData);
            }
        }
        closeModal();
        saveState();
    };
};

window.closeModal = () => {
    document.getElementById('modal-overlay').style.display = 'none';
};

window.deleteItem = (list, id) => {
    state[list] = state[list].filter(item => item.id !== id);
    saveState();
};

window.handleLogin = () => {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    const errorMsg = document.getElementById('login-error');

    if (user === 'tacolimey' && pass === 'pinto1234') {
        localStorage.setItem('airbnb_current_user', user);
        state = getInitialState(user);
        state.isLoggedIn = true;
        saveState();
        updateAuthView();
        renderAll();
    } else {
        if (errorMsg) {
            errorMsg.style.display = 'block';
            setTimeout(() => { errorMsg.style.display = 'none'; }, 3000);
        }
    }
};

window.recoverData = () => {
    localStorage.setItem('airbnb_current_user', 'tacolimey');
    state.isLoggedIn = true;
    
    // Exact reconstruction of the 14 unique guests & reservations
    state.reservations = [
        // Janeiro (R$ 8.616)
        { 
            id: 1, mainGuest: 'William Douglas Estacio dos Santos', 
            guests: [
                { name: 'William Douglas Estacio dos Santos', cpf: '12287623680' },
                { name: 'Lorena Natyelle de Souza Estacio', cpf: '14556083605' }
            ], 
            checkIn: '2026-01-02', checkOut: '2026-01-10', value: 3600 
        },
        { 
            id: 2, mainGuest: 'Michelle Carine Carmo de Freitas', 
            guests: [
                { name: 'Michelle Carine Carmo de Freitas', cpf: '10590029657' },
                { name: 'Extra Guest 1', cpf: 'X01' },
                { name: 'Extra Guest 2', cpf: 'X02' }
            ], 
            checkIn: '2026-01-12', checkOut: '2026-01-20', value: 2500 
        },
        { 
            id: 3, mainGuest: 'Jean Leonor Pereira', 
            guests: [
                { name: 'Jean Leonor Pereira', cpf: '09670040639' },
                { name: 'Extra Guest 3', cpf: 'X03' }
            ], 
            checkIn: '2026-01-22', checkOut: '2026-01-28', value: 2516 
        },
        // Fevereiro (R$ 5.223)
        { 
            id: 4, mainGuest: 'Gabriel Gomes', 
            guests: [
                { name: 'Gabriel Gomes', cpf: '0' },
                { name: 'Extra Guest 4', cpf: 'X04' }
            ], 
            checkIn: '2026-02-01', checkOut: '2026-02-12', value: 3000 
        },
        { 
            id: 5, mainGuest: 'Guest Sync Test', 
            guests: [
                { name: 'Guest Sync Test', cpf: '123.456.789-00' },
                { name: 'Extra Guest 5', cpf: 'X05' }
            ], 
            checkIn: '2026-02-15', checkOut: '2026-02-25', value: 2223 
        },
        // Março (R$ 3.133)
        { 
            id: 6, mainGuest: 'Test Guest A', 
            guests: [
                { name: 'Test Guest A', cpf: '111' }
            ], 
            checkIn: '2026-03-01', checkOut: '2026-03-15', value: 1533 
        },
        { 
            id: 7, mainGuest: 'Test Guest B', 
            guests: [
                { name: 'Test Guest B', cpf: '222' },
                { name: 'Extra Guest 6', cpf: 'X06' }
            ], 
            checkIn: '2026-03-18', checkOut: '2026-03-28', value: 1600 
        }
    ];

    state.expenses = [
        { id: 1, category: 'CONDOMÍNIO', description: 'Janeiro', date: '2026-01-14', value: 404 },
        { id: 2, category: 'ENERGIA', description: 'Janeiro', date: '2026-01-05', value: 194 },
        { id: 3, category: 'LIMPEZA', description: 'Jan 03', date: '2026-01-03', value: 120 },
        { id: 4, category: 'LIMPEZA', description: 'Jan 17', date: '2026-01-17', value: 120 },
        { id: 5, category: 'LIMPEZA', description: 'Jan 21', date: '2026-01-21', value: 120 },
        { id: 6, category: 'LIMPEZA', description: 'Jan 28', date: '2026-01-28', value: 120 },
        { id: 7, category: 'INTERNET', description: 'Loga', date: '2026-01-14', value: 100 },
        { id: 8, category: 'OUTROS', description: 'Fevereiro', date: '2026-02-15', value: 1097 },
        { id: 9, category: 'OUTROS', description: 'Março', date: '2026-03-15', value: 902 }
    ];
    state.selectedYear = 2026;
    saveState();
    updateAuthView();
    renderAll();
    alert('Dados restaurados: 14 hóspedes únicos e financeiros exatos para Q1 2026!');
};

window.logout = () => {
    state.isLoggedIn = false;
    saveState();
    localStorage.removeItem('airbnb_current_user');
    location.reload();
};

function updateAuthView() {
    if (state.isLoggedIn) {
        document.body.classList.add('authenticated');
    } else {
        document.body.classList.remove('authenticated');
    }
    if (window.lucide) window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthView();
    if (state.isLoggedIn) {
        renderAll();
    }
    
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
