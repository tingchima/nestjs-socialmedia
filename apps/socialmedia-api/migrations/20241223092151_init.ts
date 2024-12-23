import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email", 512).unique().notNullable();
    table.string("display_name", 255).notNullable();
    table.string("password", 512).notNullable();
    table.string("avatar_path", 255).nullable();
    table.enum("role", ["OFFICIAL", "NORMAL", "ADMIN"]);
    table.boolean("enabled").notNullable().defaultTo(true);
    table.timestamp("created_at", { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable().defaultTo(null);
    table.index("email", "idx_email");
  });

  await knex.schema.createTable("channels", (table) => {
    table.increments("id").primary();
    table.string("display_name", 255).nullable();
    table.string("avatar_path", 255).nullable();
    table.enum("type", ["ONE_TO_ONE", "GROUP"]);
    table.timestamp("last_message_time", { useTz: false }).nullable().defaultTo(null);
    table.timestamp("created_at", { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable().defaultTo(null);
  });

  await knex.schema.createTable("members", (table) => {
    table.increments("id").primary();
    table.integer("channel_id", 11).unsigned().notNullable();
    table.integer("user_id", 11).unsigned().notNullable();
    table.boolean("is_admin").nullable().defaultTo(false);
    table.timestamp("last_read_at", { useTz: false }).nullable().defaultTo(null);
    table.timestamp("start_read_time", { useTz: false }).nullable().defaultTo(null);
    table.timestamp("created_at", { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: false }).nullable().defaultTo(null);
    table.timestamp("deleted_at", { useTz: false }).nullable().defaultTo(null);
    table.foreign("channel_id").references("id").inTable("channels");
    table.foreign("user_id").references("id").inTable("users");
    table.unique(["channel_id", "user_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("members");
  await knex.schema.dropTable("channels");
  await knex.schema.dropTable("users");
}
