# Database Setup Guide

## Issue
The sign-in page requires a database connection. If PostgreSQL isn't running, authentication won't work.

## Quick Fix: Start PostgreSQL

### Option 1: Using Homebrew (Recommended)
```bash
# Start PostgreSQL service
brew services start postgresql@14

# Or if that doesn't work, try:
pg_ctl -D /usr/local/var/postgres start
```

### Option 2: Check PostgreSQL Status
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# If it shows "stopped", start it:
brew services start postgresql@14
```

### Option 3: Create Database
Once PostgreSQL is running:
```bash
# Create the database
createdb luxe_bella

# Or using psql:
psql postgres -c "CREATE DATABASE luxe_bella;"
```

### Option 4: Run Migrations
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

## Verify Database Connection

Test the connection:
```bash
psql -U $(whoami) -d luxe_bella -c "SELECT 1;"
```

If this works, restart your Next.js app:
```bash
npm run dev
```

## Alternative: Use SQLite (Easier for Local Development)

If PostgreSQL continues to be problematic, we can switch to SQLite which doesn't require a separate server. However, this requires schema changes as SQLite doesn't support all PostgreSQL features.

## Troubleshooting

### Error: "Can't reach database server"
- PostgreSQL service is not running
- Fix: Start PostgreSQL using one of the methods above

### Error: "Database does not exist"
- The `luxe_bella` database hasn't been created
- Fix: Run `createdb luxe_bella` or create it via psql

### Error: "User authentication failed"
- Check your `.env` file DATABASE_URL
- Make sure it matches your PostgreSQL setup

