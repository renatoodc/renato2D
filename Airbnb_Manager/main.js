const bookings = [
    { guest: 'João Silva', checkIn: '28/03/2026', checkOut: '02/04/2026', status: 'Confirmado', amount: 'R$ 2.400' },
    { guest: 'Maria Oliveira', checkIn: '30/03/2026', checkOut: '05/04/2026', status: 'Pendente', amount: 'R$ 3.150' },
    { guest: 'Carlos Santos', checkIn: '01/04/2026', checkOut: '04/04/2026', status: 'Confirmado', amount: 'R$ 1.800' },
    { guest: 'Ana Pereira', checkIn: '05/04/2026', checkOut: '12/04/2026', status: 'Confirmado', amount: 'R$ 5.100' }
];

function renderBookings() {
    const tableBody = document.getElementById('bookings-body');
    if (!tableBody) return;

    tableBody.innerHTML = bookings.map(booking => `
        <tr>
            <td style="font-weight: 600;">${booking.guest}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>
                <span class="status-badge ${booking.status === 'Confirmado' ? 'status-confirmed' : 'status-pending'}">
                    ${booking.status.toUpperCase()}
                </span>
            </td>
            <td style="font-weight: 800; color: var(--primary);">${booking.amount}</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    renderBookings();
    console.log('Airbnb Manager Dashboard Initialized');
});
