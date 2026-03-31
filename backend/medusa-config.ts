import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

// Patch for promotion rule query filter bug
const buildPromotionRuleQueryFilterFromContext =
  require("@medusajs/promotion/dist/utils/compute-actions/build-promotion-rule-query-filter-from-context").buildPromotionRuleQueryFilterFromContext
require("@medusajs/promotion/dist/utils/compute-actions/build-promotion-rule-query-filter-from-context").buildPromotionRuleQueryFilterFromContext =
  async () => null

module.exports = defineConfig({
  modules: [
    {
      resolve: "./src/modules/meilisearch",
      options: {
        host: process.env.MEILISEARCH_HOST!,
        apiKey: process.env.MEILISEARCH_API_KEY!,
        productIndexName: process.env.MEILISEARCH_PRODUCT_INDEX_NAME!,
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: { apiKey: process.env.STRIPE_API_KEY },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
  ],
  plugins: [
    {
      resolve: "@lambdacurry/medusa-product-reviews",
      options: {
        defaultReviewStatus: "pending",
      },
    },
    {
      resolve: "@agilo/medusa-analytics-plugin",
      options: {},
    },
  ],
  projectConfig: {
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions:
      process.env.NODE_ENV === "production"
        ? { connection: { ssl: { rejectUnauthorized: false } } }
        : {},
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    path: "/dashboard",
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    vite: () => {
      return {
        server: {
          hmr: {
            port: 7001,
            clientPort: 7001,
          },
          watch: {
            usePolling: true,
            interval: 1000,
          },
          optimizeDeps: {
            force: true,
          },
        },
      }
    },
  },
})

// console.log(`DEBUG: Connecting to R2 Bucket ${process.env.S3_FILE_URL}`)
// console.log(`DEBUG: Connecting to R2 Bucket ${process.env.S3_ACCESS_KEY_ID}`)
// console.log(
//   `DEBUG: Connecting to R2 Bucket ${process.env.S3_SECRET_ACCESS_KEY}`,
// )
// console.log(`DEBUG: Connecting to R2 Bucket ${process.env.S3_REGION}`)
// console.log(`DEBUG: Connecting to R2 Bucket ${process.env.S3_BUCKET}`)
// console.log(`DEBUG: Connecting to R2 Bucket ${process.env.S3_ENDPOINT}`)
