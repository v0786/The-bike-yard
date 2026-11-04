// Test environment setup — loads .env for DATABASE_URL etc.
// Never loads production secrets; .env is gitignored and points to the local test DB.
require("dotenv").config({ path: require("path").resolve(process.cwd(), ".env") });
