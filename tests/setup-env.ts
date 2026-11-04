// Test environment setup — loads .env for DATABASE_URL etc.
// Never loads production secrets; .env is gitignored and points to the local test DB.
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env") });
