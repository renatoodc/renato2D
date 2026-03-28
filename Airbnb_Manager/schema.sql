-- ============================================================
-- Airbnb Manager - Supabase Database Schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL)
-- ============================================================

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    main_guest  TEXT NOT NULL,
    guests      JSONB NOT NULL DEFAULT '[]',
    check_in    DATE NOT NULL,
    check_out   DATE NOT NULL,
    value       NUMERIC(10,2) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
    category    TEXT NOT NULL,
    description TEXT,
    date        DATE NOT NULL,
    value       NUMERIC(10,2) NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) - Data Isolation per User
-- ============================================================

-- Enable RLS on both tables
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Reservations: users can only SELECT/INSERT/UPDATE/DELETE their own rows
CREATE POLICY "Users can view own reservations"
    ON reservations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reservations"
    ON reservations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reservations"
    ON reservations FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reservations"
    ON reservations FOR DELETE
    USING (auth.uid() = user_id);

-- Expenses: users can only SELECT/INSERT/UPDATE/DELETE their own rows
CREATE POLICY "Users can view own expenses"
    ON expenses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
    ON expenses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
    ON expenses FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
    ON expenses FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON reservations(check_in);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
