// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export default () => ({
  database: {
    dialect: process.env.DATABASE_DIALECT || "mysql",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "root",
    database: process.env.DATABASE_NAME_DEVELOPMENT || "social-media",
  },
});
