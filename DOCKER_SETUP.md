# Docker PostgreSQL Setup

## Quick Start

### 1. Start PostgreSQL Container
```bash
docker-compose up -d
```

This will:
- Download PostgreSQL 14 image (if not already downloaded)
- Start a container on port 5432
- Create a database named `luxe_bella`
- Set username: `postgres`, password: `postgres`

### 2. Verify Database is Running
```bash
docker ps | grep luxe-bella-db
```

### 3. Update .env File
Your `.env` file should have:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/luxe_bella?schema=public"
```

### 4. Run Database Migrations
```bash
npm run db:migrate
```

### 5. Restart Your App
```bash
npm run dev
```

## Useful Commands

### Stop PostgreSQL
```bash
docker-compose down
```

### Stop and Remove Data (Fresh Start)
```bash
docker-compose down -v
```

### View Logs
```bash
docker-compose logs postgres
```

### Connect to Database
```bash
docker exec -it luxe-bella-db psql -U postgres -d luxe_bella
```

### Check Database Status
```bash
docker-compose ps
```

## Troubleshooting

### Port 5432 Already in Use
If you get an error about port 5432 being in use:
1. Stop any local PostgreSQL: `brew services stop postgresql@14`
2. Or change the port in `docker-compose.yml` to something like `5433:5432`
3. Update DATABASE_URL in `.env` to use the new port

### Container Won't Start
```bash
# Check logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

