import pg from "pg";
import chalk from "chalk";

const { Pool } = pg; // Destructure Pool from the module

// Create a pool instance
const pool = new Pool({
  user: process.env?.PG_USER ?? "app_user",
  host: process.env?.PG_HOST ?? "localhost",
  database: process.env?.PG_DATABASE ?? "datatys_db",
  password: process.env?.PG_PASSWORD ?? "coding_test_password",
  port: process.env?.PG_PORT ?? "5432",
});

// Log errors from the pool
pool.on("error", (err) => {
  console.log(
    chalk.hex("#34ace0").bold("Unexpected error on idle client", err)
  );
});

export default pool; // Export the pool instance
