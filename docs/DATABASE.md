# TrimTrack Database

## Environment and compatibility

The schema is verified for the locally installed MySQL Community Server 9.4 and
uses features available in MySQL 8 where practical. The database name is
`trimtrack_db`, its character set is `utf8mb4`, and all tables use InnoDB.

The canonical files are:

- `backend/database/schema.sql`
- `backend/database/seed.sql`
- `backend/database/queries.sql`

The old `database queries/` drafts are intentionally retired.

## Relationships

```text
users
  (independent administrator accounts)

customers 1 ---- many appointments many ---- 1 services
```

Every appointment requires one existing customer and one existing service.
Both foreign keys use `ON DELETE RESTRICT`, so appointment history cannot be
orphaned by deleting a referenced record.

Mutable records include `created_at` and `updated_at`. Passwords are stored only
as bcrypt values in `users.password_hash`.

## One-time local setup

Use MySQL Workbench with your own MySQL administrator account:

1. Open and run `backend/database/schema.sql`.
2. In a separate query tab, replace the password placeholder below and run:

```sql
CREATE USER IF NOT EXISTS 'trimtrack'@'localhost'
  IDENTIFIED BY 'replace-with-a-strong-local-password';

ALTER USER 'trimtrack'@'localhost'
  IDENTIFIED BY 'replace-with-a-strong-local-password';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON trimtrack_db.*
  TO 'trimtrack'@'localhost';

FLUSH PRIVILEGES;
```

3. From `backend/`, copy `.env.example` to `.env`.
4. Put the same local database password in `DB_PASSWORD`. Keep `.env`
   untracked.

The runtime user deliberately cannot create, alter, or drop schemas. Run schema
changes through Workbench with the administrator account.

## Seed data

Run `backend/database/seed.sql` in Workbench after the schema. It installs a
small deterministic development dataset with fixed IDs. Re-running the file
updates those sample rows rather than creating duplicates.

Run seeds only on a new development database before adding personal test data,
because the deterministic IDs `1` through `6` are reserved for samples.

To seed the administrator:

```powershell
cd backend
Copy-Item .env.example .env
# Edit .env without committing it.
pnpm.cmd db:seed:admin
```

The command requires `ADMIN_FULL_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
It validates the values, hashes the password with bcrypt using cost 12, and
upserts by the unique email through a prepared `mysql2` statement. It never
prints the password or resulting hash.

## Safe reset

The checked-in scripts never drop the database. Before resetting a database
that may contain useful records, export it with Workbench. For a disposable
local database, an administrator may explicitly drop `trimtrack_db`, then rerun
`schema.sql`, `seed.sql`, and the administrator seed command.

## Query practice and verification

Open `backend/database/queries.sql` in Workbench to practise:

- selecting all customers and one customer by ID;
- searching customers by name or phone number;
- joining appointments to customer and service names;
- calculating dashboard totals;
- listing recent appointments;
- inserting, updating, and deleting a temporary customer;
- changing an appointment status.

Mutation exercises are wrapped in transactions ending in `ROLLBACK`, so the
sample data remains unchanged.

Additional checks:

```sql
-- Invalid price: must fail.
INSERT INTO services (service_name, price, duration_minutes)
VALUES ('Invalid Price', -1.00, 30);

-- Invalid duration: must fail.
INSERT INTO services (service_name, price, duration_minutes)
VALUES ('Invalid Duration', 10.00, 0);

-- Invalid foreign key: must fail.
INSERT INTO appointments (
  customer_id,
  service_id,
  appointment_date,
  appointment_time
)
VALUES (999999, 999999, CURRENT_DATE(), '12:00:00');

-- Referenced customer deletion: customer 1 must remain protected.
DELETE FROM customers WHERE customer_id = 1;
```

Run each destructive check inside a transaction or on a disposable database.
