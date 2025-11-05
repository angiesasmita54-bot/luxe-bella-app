# Fix PostgreSQL Connection Issue

## Current Problem
The sign-in page is working, but authentication requires a database connection. PostgreSQL is not currently running.

## Quick Fix Steps

### 1. Start PostgreSQL Manually

Try these commands in order:

```bash
# Option 1: Start via Homebrew
brew services start postgresql@14

# Option 2: If that fails, try direct start
pg_ctl -D /usr/local/var/postgresql@14 start

# Option 3: Check what PostgreSQL version you have
ls /usr/local/var/ | grep postgres

# Option 4: Start with explicit path
/opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14
```

### 2. Verify PostgreSQL is Running

```bash
pg_isready -h localhost -p 5432
```

You should see: `localhost:5432 - accepting connections`

### 3. Create Database

Once PostgreSQL is running:
```bash
createdb luxe_bella
```

### 4. Run Database Migrations

```bash
cd /Users/ssahoo/IdeaProjects/luxe-bella-app
npm run db:migrate
```

### 5. Restart Your App

```bash
npm run dev
```

## Alternative: Manual PostgreSQL Start

If brew services doesn't work, you may need to:

1. Find your PostgreSQL data directory:
   ```bash
   brew info postgresql@14
   ```

2. Start PostgreSQL manually:
   ```bash
   /opt/homebrew/opt/postgresql@14/bin/postgres -D /opt/homebrew/var/postgresql@14
   ```

3. Keep this terminal open while developing

## Sign-In Page Status

✅ **The sign-in page itself is working correctly**
⚠️ **Authentication requires database connection**

Once PostgreSQL is running and the database is set up, the sign-in will work properly.

## Test After Setup

1. Create a test account via sign-up page
2. Try signing in with those credentials
3. If you see database errors, check the terminal running `npm run dev` for detailed error messages

