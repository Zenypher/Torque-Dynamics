# Docker Setup for Torque Dynamics

This project uses Docker for containerizing the Medusa backend and Next.js storefront, with external cloud services for database, cache, search, and file storage.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
├──────────────────────────────────┬──────────────────────────┤
│  Docker Container (Medusa)       │  Docker Container (Next) │
│  Backend API (Port 9000)         │  Storefront (Port 8000)  │
└──────────────┬────────────────────┴──────────────┬───────────┘
               │                                    │
    ┌──────────┴──────────┬──────────────────┬─────┴────────┐
    │                     │                  │              │
┌───▼────────┐  ┌────────▼────┐  ┌─────────▼───┐  ┌───────▼───┐
│  Supabase  │  │  Upstash    │  │ Meilisearch │  │ Cloudflare│
│ PostgreSQL │  │    Redis    │  │    Cloud    │  │    R2     │
└────────────┘  └─────────────┘  └─────────────┘  └───────────┘
```

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development reference)
- Accounts for external services (see [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md)):
  - Supabase
  - Upstash
  - Meilisearch Cloud
  - Cloudflare R2

## Quick Start

### 1. Setup External Services

Follow the detailed setup guide: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md)

You'll need connection strings for:

- Supabase PostgreSQL
- Upstash Redis
- Meilisearch Cloud
- Cloudflare R2

### 2. Create Environment File

```bash
cp .env.docker.template .env
```

Edit `.env` with your external service credentials:

```bash
# Supabase
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/postgres?sslmode=require

# Upstash Redis
REDIS_URL=redis://default:PASSWORD@ENDPOINT:PORT

# Meilisearch Cloud
MEILISEARCH_HOST=https://your-instance.meilisearch.io
MEILISEARCH_API_KEY=your-api-key

# Cloudflare R2
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=your-key-id
S3_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET=your-bucket-name
S3_FILE_URL=https://your-domain.com

# Stripe (update with your test keys)
STRIPE_API_KEY=sk_test_...

# Other config
MEDUSA_BACKEND_URL=http://localhost:9000
```

### 3. Start Containers

```bash
docker-compose up -d --build
```

### 4. Access Services

- **Storefront**: http://localhost:8000
- **Backend API**: http://localhost:9000
- **Medusa Dashboard**: http://localhost:9000/dashboard

---

## Development Commands

```bash
# View logs
docker-compose logs -f medusa
docker-compose logs -f storefront

# Show all running containers
docker-compose ps

# Stop all services
docker-compose down

# Rebuild after dependency changes
docker-compose build --no-cache

# Execute seed command
docker exec torque-backend pnpm run seed

# View backend shell
docker exec -it torque-backend sh

# View storefront shell
docker exec -it torque-storefront sh
```

---

## Production Deployment

### 1. Create Production Environment

```bash
cp .env.prod.example .env.prod
```

Edit `.env.prod` with production values:

- Strong JWT_SECRET and COOKIE_SECRET
- Production domain URLs
- Live Stripe API keys
- All external service production endpoints

### 2. Deploy

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

**Important**:

- Review and update all secrets before deploying
- Never commit `.env.prod` to version control
- Use environment secrets from your hosting platform

---

## Environment Variables Reference

### Database (Supabase)

```
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/postgres?sslmode=require
```

### Cache (Upstash Redis)

```
REDIS_URL=redis://default:PASSWORD@ENDPOINT:PORT
```

### Search (Meilisearch Cloud)

```
MEILISEARCH_HOST=https://instance.meilisearch.io
MEILISEARCH_API_KEY=api-key
MEILISEARCH_PRODUCT_INDEX_NAME=products

# Public (for storefront)
NEXT_PUBLIC_MEILISEARCH_HOST=https://instance.meilisearch.io
NEXT_PUBLIC_MEILISEARCH_API_KEY=api-key
NEXT_PUBLIC_MEILISEARCH_INDEX_NAME=products
```

### File Storage (Cloudflare R2)

```
S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=key-id
S3_SECRET_ACCESS_KEY=secret
S3_FILE_URL=https://cdn.yourdomain.com
S3_REGION=auto
S3_BUCKET=bucket-name
```

### Payment (Stripe)

```
STRIPE_API_KEY=sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_... or pk_live_...
```

### Security

```
JWT_SECRET=long-random-string-min-32-chars
COOKIE_SECRET=long-random-string-min-32-chars
```

### CORS

```
STORE_CORS=https://yourdomain.com
ADMIN_CORS=https://yourdomain.com/admin
AUTH_CORS=https://yourdomain.com/admin
```

### Monitoring

```
SENTRY_DSN=https://your-sentry-dsn
```

---

## Troubleshooting

### Container won't start

```bash
docker-compose logs medusa
```

Check for environment variable errors or missing dependencies.

### Can't connect to external services

```bash
# Test database
docker exec torque-backend node -e "const sql = require('sql.js'); console.log('DB test')"

# Test Redis
docker exec torque-backend pnpm add redis && node -e "const redis = require('redis'); console.log('Redis ok')"
```

### File uploads not working

```bash
# Verify S3/R2 credentials
aws s3 ls --recursive s3://your-bucket \
  --endpoint-url https://your-account-id.r2.cloudflarestorage.com \
  --region auto
```

### Storefront can't reach backend

```bash
# Test from inside container
docker exec torque-storefront curl http://medusa:9000/health
```

### High memory usage

```bash
docker stats torque-medusa torque-storefront
```

---

## Useful Docker Commands

```bash
# Clean up dangling images/volumes
docker image prune
docker volume prune

# View container resource usage
docker stats

# Inspect container networking
docker network inspect $(docker network ls -q | head -1)

# Backup container logs
docker logs torque-backend > backend-logs.txt
docker logs torque-storefront > storefront-logs.txt

# Remove all containers and volumes
docker-compose down -v
```

---

## Security Checklist

- [ ] External service credentials are in `.env` (not committed)
- [ ] JWT_SECRET is a long random string (min 32 chars)
- [ ] COOKIE_SECRET is a long random string (min 32 chars)
- [ ] CORS URLs match your production domain
- [ ] Stripe keys are switched to live keys for production
- [ ] Database backups are configured in Supabase
- [ ] R2 API tokens are restricted to necessary buckets
- [ ] Regular rotation of API keys scheduled

---

## Performance Tips

1. **Database**: Use Supabase connection pooling for better performance

   ```
   DATABASE_URL=postgresql://...@pooler.supabase.com:6543/...
   ```

2. **Redis**: Upstash provides best performance with global edge locations

3. **Search**: Meilisearch Cloud is optimized for low-latency responses

4. **Storage**: Cloudflare R2 is globally distributed via Cloudflare network

5. **Docker**: Run with adequate resources
   ```bash
   # Docker Desktop: Settings > Resources > CPU and Memory
   ```

---

## Further Documentation

- **External Services Setup**: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md)
- **Medusa Documentation**: https://docs.medusajs.com
- **Next.js Documentation**: https://nextjs.org/docs
- **Docker Documentation**: https://docs.docker.com

---

## Common Issues & Solutions

**Issue**: `error: password authentication failed for user "postgres"`

- **Solution**: Verify DATABASE_URL includes correct password and uses `sslmode=require`

**Issue**: `Redis connection refused`

- **Solution**: Check REDIS_URL format and credentials. Test with: `redis-cli --raw -u $REDIS_URL ping`

**Issue**: `Meilisearch not responding`

- **Solution**: Verify MEILISEARCH_HOST starts with `https://` and includes full domain

**Issue**: `R2 upload fails with 403 Forbidden`

- **Solution**: Check R2 API token permissions and verify S3_BUCKET name is correct

**Issue**: Containers use too much memory

- **Solution**: Check for memory leaks in logs, increase Docker Desktop memory limit
