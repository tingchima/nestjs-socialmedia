import { knex } from "knex";

const config = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "secret",
    database: "nestjs_socialmedia",
  },
  // debug: ["development", "test"].includes(process.env.NODE_ENV),
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "_migrations",
    loadExtensions: [".js"],
    directory: "./build/db/migrations",
  },
  seeds: {
    directory: "./build/db/seeds",
    loadExtensions: [".js"],
  },
};

module.exports = {
  development: config,
  test: config,
  staging: config,
  production: config,
};

const knexInstance = knex(config);

export default knexInstance;
