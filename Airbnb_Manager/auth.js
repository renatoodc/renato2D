import { supabase } from './supabase.js';

/**
 * Sign in with email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {{ data: object|null, error: object|null }}
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

/**
 * Sign out the current user.
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

/**
 * Send a password reset email.
 * @param {string} email 
 */
export async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
    });
    return { data, error };
}

/**
 * Get the current session (null if not logged in).
 */
export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
}

/**
 * Get the current user from the session.
 */
export async function getCurrentUser() {
    const { session } = await getSession();
    return session?.user || null;
}

/**
 * Listen for auth state changes.
 * @param {function} callback - receives (event, session)
 */
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
}

/**
 * Update password (used after clicking reset link).
 * @param {string} newPassword 
 */
export async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
        password: newPassword
    });
    return { data, error };
}
