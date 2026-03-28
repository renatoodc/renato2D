import { supabase } from './supabase.js';

// ============================
// RESERVATIONS
// ============================

/**
 * Load all reservations for the current user (RLS auto-filters).
 */
export async function loadReservations() {
    const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('check_in', { ascending: false });

    if (error) {
        console.error('Error loading reservations:', error);
        return [];
    }

    // Map DB columns to app format
    return (data || []).map(r => ({
        id: r.id,
        mainGuest: r.main_guest,
        guests: r.guests || [],
        checkIn: r.check_in,
        checkOut: r.check_out,
        value: parseFloat(r.value),
        createdAt: r.created_at
    }));
}

/**
 * Save (insert or update) a reservation.
 * @param {object} reservation - { id?, mainGuest, guests, checkIn, checkOut, value }
 */
export async function saveReservation(reservation) {
    const record = {
        main_guest: reservation.mainGuest,
        guests: reservation.guests,
        check_in: reservation.checkIn,
        check_out: reservation.checkOut,
        value: reservation.value
    };

    let result;

    if (reservation.id && typeof reservation.id === 'number' && reservation.id > 0) {
        // Check if it's a real DB id (not a Date.now() timestamp)
        const { data: existing } = await supabase
            .from('reservations')
            .select('id')
            .eq('id', reservation.id)
            .single();

        if (existing) {
            // Update existing
            result = await supabase
                .from('reservations')
                .update(record)
                .eq('id', reservation.id)
                .select()
                .single();
        } else {
            // Insert new (id was a temporary client-side id)
            result = await supabase
                .from('reservations')
                .insert(record)
                .select()
                .single();
        }
    } else {
        // Insert new
        result = await supabase
            .from('reservations')
            .insert(record)
            .select()
            .single();
    }

    if (result.error) {
        console.error('Error saving reservation:', result.error);
        return null;
    }

    return {
        id: result.data.id,
        mainGuest: result.data.main_guest,
        guests: result.data.guests || [],
        checkIn: result.data.check_in,
        checkOut: result.data.check_out,
        value: parseFloat(result.data.value),
        createdAt: result.data.created_at
    };
}

/**
 * Delete a reservation by ID.
 */
export async function deleteReservation(id) {
    const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting reservation:', error);
        return false;
    }
    return true;
}

// ============================
// EXPENSES
// ============================

/**
 * Load all expenses for the current user (RLS auto-filters).
 */
export async function loadExpenses() {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

    if (error) {
        console.error('Error loading expenses:', error);
        return [];
    }

    return (data || []).map(e => ({
        id: e.id,
        category: e.category,
        description: e.description,
        date: e.date,
        value: parseFloat(e.value),
        createdAt: e.created_at
    }));
}

/**
 * Save (insert or update) an expense.
 * @param {object} expense - { id?, category, description, date, value }
 */
export async function saveExpense(expense) {
    const record = {
        category: expense.category,
        description: expense.description,
        date: expense.date,
        value: expense.value
    };

    let result;

    if (expense.id && typeof expense.id === 'number' && expense.id > 0) {
        const { data: existing } = await supabase
            .from('expenses')
            .select('id')
            .eq('id', expense.id)
            .single();

        if (existing) {
            result = await supabase
                .from('expenses')
                .update(record)
                .eq('id', expense.id)
                .select()
                .single();
        } else {
            result = await supabase
                .from('expenses')
                .insert(record)
                .select()
                .single();
        }
    } else {
        result = await supabase
            .from('expenses')
            .insert(record)
            .select()
            .single();
    }

    if (result.error) {
        console.error('Error saving expense:', result.error);
        return null;
    }

    return {
        id: result.data.id,
        category: result.data.category,
        description: result.data.description,
        date: result.data.date,
        value: parseFloat(result.data.value),
        createdAt: result.data.created_at
    };
}

/**
 * Delete an expense by ID.
 */
export async function deleteExpense(id) {
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting expense:', error);
        return false;
    }
    return true;
}

// ============================
// DEMO DATA
// ============================

/**
 * Load demo/seed data into the current user's account.
 */
export async function loadDemoData() {
    const demoReservations = [
        { main_guest: 'William Douglas Estacio dos Santos', guests: [{ name: 'William Douglas Estacio dos Santos', cpf: '12287623680' }, { name: 'Lorena Natyelle de Souza Estacio', cpf: '14556083605' }], check_in: '2026-01-02', check_out: '2026-01-10', value: 3600 },
        { main_guest: 'Michelle Carine Carmo de Freitas', guests: [{ name: 'Michelle Carine Carmo de Freitas', cpf: '10590029657' }, { name: 'Extra Guest 1', cpf: 'X01' }, { name: 'Extra Guest 2', cpf: 'X02' }], check_in: '2026-01-12', check_out: '2026-01-20', value: 2500 },
        { main_guest: 'Jean Leonor Pereira', guests: [{ name: 'Jean Leonor Pereira', cpf: '09670040639' }, { name: 'Extra Guest 3', cpf: 'X03' }], check_in: '2026-01-22', check_out: '2026-01-28', value: 2516 },
        { main_guest: 'Gabriel Gomes', guests: [{ name: 'Gabriel Gomes', cpf: '0' }, { name: 'Extra Guest 4', cpf: 'X04' }], check_in: '2026-02-01', check_out: '2026-02-12', value: 3000 },
        { main_guest: 'Guest Sync Test', guests: [{ name: 'Guest Sync Test', cpf: '123.456.789-00' }, { name: 'Extra Guest 5', cpf: 'X05' }], check_in: '2026-02-15', check_out: '2026-02-25', value: 2223 },
        { main_guest: 'Test Guest A', guests: [{ name: 'Test Guest A', cpf: '111' }], check_in: '2026-03-01', check_out: '2026-03-15', value: 1533 },
        { main_guest: 'Test Guest B', guests: [{ name: 'Test Guest B', cpf: '222' }, { name: 'Extra Guest 6', cpf: 'X06' }], check_in: '2026-03-18', check_out: '2026-03-28', value: 1600 }
    ];

    const demoExpenses = [
        { category: 'CONDOMÍNIO', description: 'Janeiro', date: '2026-01-14', value: 404 },
        { category: 'ENERGIA', description: 'Janeiro', date: '2026-01-05', value: 194 },
        { category: 'LIMPEZA', description: 'Jan 03', date: '2026-01-03', value: 120 },
        { category: 'LIMPEZA', description: 'Jan 17', date: '2026-01-17', value: 120 },
        { category: 'LIMPEZA', description: 'Jan 21', date: '2026-01-21', value: 120 },
        { category: 'LIMPEZA', description: 'Jan 28', date: '2026-01-28', value: 120 },
        { category: 'INTERNET', description: 'Loga', date: '2026-01-14', value: 100 },
        { category: 'OUTROS', description: 'Fevereiro', date: '2026-02-15', value: 1097 },
        { category: 'OUTROS', description: 'Março', date: '2026-03-15', value: 902 }
    ];

    const { error: resError } = await supabase
        .from('reservations')
        .insert(demoReservations);

    if (resError) {
        console.error('Error loading demo reservations:', resError);
        return false;
    }

    const { error: expError } = await supabase
        .from('expenses')
        .insert(demoExpenses);

    if (expError) {
        console.error('Error loading demo expenses:', expError);
        return false;
    }

    return true;
}
