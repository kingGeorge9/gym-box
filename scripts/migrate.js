// Simple script to run the migration
const { ConvexHttpClient } = require("convex/browser");

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

async function runMigration() {
  try {
    console.log("Running migration to delete legacy plans...");
    const result = await client.mutation("migrations:deleteLegacyPlans", {});
    console.log("Migration completed:", result);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    client.close();
  }
}

runMigration();
