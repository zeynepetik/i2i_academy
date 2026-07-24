create table users(
	user_id UUID primary key default gen_random_uuid(),
	--since it is a nickname it should be unique 
	user_name varchar(50) unique not null,
	password_hash varchar(50) not null,
	cash numeric(18,2) not null,
	created_at timestamp not null default now()
);

create table assets(
	asset_id UUID primary key default gen_random_uuid(),
	asset_name varchar(50) unique not null,
	tradable_quantity numeric not null default 0,
	symbol varchar(10) not null,
	created_at timestamp not null default now()
);

create table holdings(
	holding_id UUID primary key default gen_random_uuid(),
	user_id UUID not null references users(user_id),
	asset_id UUID not null references assets(asset_id),
	avg_cost numeric(18,8) not null,
	quantity numeric(28,10) not null default 0,
	unique(user_id, asset_id)
	
);

create table transactions(
	transaction_id UUID primary key default gen_random_uuid(),
	user_id UUID not null references users(user_id),
	asset_id UUID not null references assets(asset_id),
	created_at timestamp not null default now(),
	transaction_type varchar(5) not null check(transaction_type in ('BUY', 'SELL')),
	quantity numeric(28,10) not null,
	paid_per_price numeric(18,8) not null,
	total numeric(18,2) not null 
);

CREATE TABLE price_history (
    price_history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(asset_id),
    price NUMERIC(18,8) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT now()
);

