create table price_history(
    price_id UUID primary key default gen_random_uuid(),
    symbol VARCHAR(50) not null,
    price numeric(18,2) not null,
    created_at timestamptz not null default now()
);