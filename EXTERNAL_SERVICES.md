# External Services Setup Guide

This project is configured to use external cloud services instead of containerized services. This is ideal for production deployments and reduces operational overhead.

## Services Overview

### Database: Supabase PostgreSQL

- **URL**: https://supabase.com
- **What it is**: Managed PostgreSQL database with real-time capabilities
- **Why**: Scalable, reliable, includes built-in backups and monitoring

### Cache & Queue: Upstash Redis

- **URL**: https://upstash.com
- **What it is**: Serverless Redis database
- **Why**: Pay-as-you-go pricing, no server management, global edge locations

### Search: Meilisearch Cloud

- **URL**: https://cloud.meilisearch.io
- **What it is**: Hosted full-text search engine
- **Why**: Fast product search, typo tolerance, zero-config

### File Storage: Cloudflare R2

- **URL**: https://www.cloudflare.com/products/r2/
- **What it is**: S3-compatible object storage
- **Why**: No egress charges, global distribution, competitive pricing

---

## Setup Instructions

### 1. Supabase PostgreSQL Setup

1. **Create a project**
   - Go to [Supabase Console](https://app.supabase.com)
   - Click "New Project"
   - Select region (choose same as your deployment for lower latency)
   - Set a strong password

2. **Get connection string**
   - Go to Project Settings > Database
   - Under "Connection string", select "URI"
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

3. **Add to .env**

   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?sslmode=require
   ```

4. **Run migrations** (if needed)
   ```bash
   docker-compose run medusa pnpm seed
   ```

**SSL Mode**: Supabase requires `sslmode=require` in the connection string for security.

### 2. Upstash Redis Setup

1. **Create a Redis database**
   - Go to [Upstash Console](https://console.upstash.com)
   - Click "Create Database"
   - Select region (choose same as your deployment)
   - Select "Redis"

2. **Get connection details**
   - Click your database
   - Copy the "Rest API" URL or "CLI" connection string
   - For Node.js, use the "CLI" format

3. **Add to .env**
   ```
   REDIS_URL=redis://default:[PASSWORD]@[ENDPOINT]:port
   ```

**Important**:

- Use the CLI connection string format (not REST API) for Node.js
- Keep this URL secret - it contains your password
- Upstash pricing is pay-per-command, perfect for variable loads

### 3. Meilisearch Cloud Setup

1. **Create a project**
   - Go to [Meilisearch Cloud](https://cloud.meilisearch.io)
   - Click "Create a new project"
   - Choose your plan (free tier available)

2. **Get API keys**
   - Navigate to "API Keys" in the project
   - Copy the "Master Key" for development
   - Copy the project Host URL (e.g., `https://xxx.meilisearch.io`)

3. **Add to .env**

   ```
   MEILISEARCH_HOST=https://[YOUR-INSTANCE].meilisearch.io
   MEILISEARCH_API_KEY=[YOUR-MASTER-KEY]
   MEILISEARCH_PRODUCT_INDEX_NAME=products
   ```

4. **For public search (storefront)**
   ```
   NEXT_PUBLIC_MEILISEARCH_HOST=https://[YOUR-INSTANCE].meilisearch.io
   NEXT_PUBLIC_MEILISEARCH_API_KEY=[YOUR-MASTER-KEY]
   NEXT_PUBLIC_MEILISEARCH_INDEX_NAME=products
   ```

**Security Note**: In production, create a separate API key with limited permissions for the storefront instead of using the master key.

### 4. Cloudflare R2 Setup

1. **Create R2 bucket**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to R2
   - Click "Create Bucket"
   - Choose a bucket name

2. **Generate API token**
   - Go to "R2" > "API Tokens"
   - Click "Create API Token"
   - Select "Object Read & Write" scope
   - Restrict to your bucket for security
   - Copy the Access Key ID and Secret

3. **Get account ID**
   - In R2 panel, copy your "Account ID" (shown at top)
   - Or go to Account Settings for Account ID

4. **Add to .env**

   ```
   S3_ENDPOINT=https://[ACCOUNT-ID].r2.cloudflarestorage.com
   S3_ACCESS_KEY_ID=[ACCESS-KEY-ID]
   S3_SECRET_ACCESS_KEY=[SECRET-ACCESS-KEY]
   S3_BUCKET=[YOUR-BUCKET-NAME]
   S3_REGION=auto
   S3_FILE_URL=https://your-domain.com
   ```

5. **Optional: Custom domain**
   - In R2 bucket settings, click "Settings"
   - Under "Public Access", enable and set custom domain
   - Update `S3_FILE_URL` to your custom domain

**Benefits of R2**:

- No egress charges (vs AWS S3)
- Globally distributed via Cloudflare network
- Compatible with S3 API

---

## Development Environment

1. **Create .env file**

   ```bash
   cp .env.docker .env
   ```

2. **Edit .env with your external service URLs**
   - Add Supabase connection string
   - Add Upstash Redis URL
   - Add Meilisearch host and API key
   - Add Cloudflare R2 credentials

3. **Start Docker containers** (only Medusa and Storefront)

   ```bash
   docker-compose up -d --build
   ```

4. **Access your services**
   - Storefront: http://localhost:8000
   - Backend API: http://localhost:9000
   - Meilisearch admin: https://[your-instance].meilisearch.io (if not password protected)

---

## Production Environment

1. **Create .env.prod file**

   ```bash
   cp .env.prod.example .env.prod
   ```

2. **Update all production values**
   - Use strong secrets for JWT_SECRET and COOKIE_SECRET
   - Update CORS URLs to your production domain
   - Update MEDUSA_BACKEND_URL to your production URL

3. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
   ```

---

## Connection String Examples

### Supabase

```
postgresql://postgres.xxxxx:YOUR_PASSWORD@aws-0-your-region.pooler.supabase.com:6543/postgres?sslmode=require
```

### Upstash Redis

```
redis://default:YOUR_PASSWORD@your-endpoint.upstash.io:YOUR_PORT
```

### Meilisearch Cloud

```
https://your-instance-abc12345.meilisearch.io
```

### Cloudflare R2

```
https://your-account-id.r2.cloudflarestorage.com
```

---

## Troubleshooting

### Database Connection Error

```
Error: getaddrinfo ENOTFOUND postgres
```

**Solution**: Make sure DATABASE_URL is set correctly in your .env file. Use the full URI with `sslmode=require` for Supabase.

### Redis Connection Error

```
Error: connect ECONNREFUSED
```

**Solution**: Verify REDIS_URL format and that credentials are correct. Test with: `redis-cli --raw -u YOUR_REDIS_URL ping`

### Meilisearch Not Found

```
Error: connect ENOTFOUND meilisearch
```

**Solution**: Ensure MEILISEARCH_HOST includes `https://` prefix and uses your cloud instance domain.

### R2 Authentication Failed

```
Error: The Access Key ID you provided does not exist in our records
```

**Solution**: Verify S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are correct. Check they haven't expired in Cloudflare dashboard.

### Can't Upload Files

```
Error: NoSuchBucket
```

**Solution**: Verify S3_BUCKET name matches your R2 bucket name exactly. Test permissions on the API token.

---

## Cost Estimation

### Supabase

- **Free Tier**: 500 MB database, 1 GB bandwidth
- **Pro**: $25/month + overage charges
- **Enterprise**: Custom pricing

### Upstash Redis

- **Free Tier**: 10,000 commands/day
- **Pro**: $0.2 per 100k commands
- Typical e-commerce: $10-50/month

### Meilisearch Cloud

- **Free Tier**: 100k documents, limited features
- **Standard**: $24/month
- **Pro**: $99/month+

### Cloudflare R2

- **Storage**: $0.015/GB/month
- **Requests**: $4.50/million read requests, $9/million write requests
- **Egress**: FREE (major advantage vs S3)

**Typical monthly cost for startup**: $50-150
**Typical monthly cost for growing store**: $200-500

---

## Security Best Practices

1. **Never commit .env files** to version control
   - Use `.env.example` files for configuration template
   - Add `.env*` to `.gitignore`

2. **Rotate API keys regularly**
   - Set reminders for key rotation
   - Use different keys for dev/prod

3. **Use Read-Only Keys when possible**
   - Meilisearch: Create separate public key for storefront
   - Cloudflare R2: Restrict API token to specific bucket

4. **Enable IP whitelist** (if available)
   - Restrict database access to your application servers
   - Supabase allows IP whitelisting in project settings

5. **Monitor usage**
   - Set up billing alerts on each service
   - Monitor query logs for suspicious activity

6. **Backup strategy**
   - Supabase: Enable automated backups (Pro plan+)
   - R2: Consider versioning for important files
   - Regular database exports as additional backup

---

## Scaling Considerations

### When to upgrade:

- **Supabase**: When approaching 500GB database size or needing more connections
- **Upstash**: When hitting command limits, consider upgrading tier
- **Meilisearch**: When exceeding 100k documents or needing SLA
- **R2**: No limits; scales automatically

### Database optimization:

```sql
-- Supabase: Create indexes for frequently searched columns
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);
```

### Cache optimization:

- Set appropriate TTLs in Redis for different data types
- Use cache invalidation patterns to manage memory

---

## Monitoring & Alerting

### Supabase

- Monitor in Project Settings > Reports
- Set up email alerts for high usage

### Upstash

- Dashboard shows request metrics
- Set budget alerts in billing settings

### Meilisearch Cloud

- View indexing progress and statistics
- Monitor search latency

### Cloudflare R2

- Analytics available in Cloudflare dashboard
- Monitor egress to prevent surprise costs

---

## Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Upstash Docs](https://upstash.io/docs)
- [Meilisearch Docs](https://www.meilisearch.com/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [Medusa Docs](https://docs.medusajs.com)
