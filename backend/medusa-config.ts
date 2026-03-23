import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

// Patch for promotion rule query filter bug
const buildPromotionRuleQueryFilterFromContext =
  require("@medusajs/promotion/dist/utils/compute-actions/build-promotion-rule-query-filter-from-context").buildPromotionRuleQueryFilterFromContext;
require("@medusajs/promotion/dist/utils/compute-actions/build-promotion-rule-query-filter-from-context").buildPromotionRuleQueryFilterFromContext =
  async () => null;

module.exports = defineConfig({
  modules: [
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
  ],
  plugins: [
    {
      resolve: "@lambdacurry/medusa-product-reviews",
      options: {
        defaultReviewStatus: "pending",
      },
    },
  ],
  projectConfig: {
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
});
