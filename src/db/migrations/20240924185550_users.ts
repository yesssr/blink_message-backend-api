import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTableIfNotExists("users", (table) => {
      table.string("id", 36).primary();
      table.string("name", 255).notNullable();
      table.string("email", 255).notNullable();
      table.timestamp("email_verified_at").nullable();
      table.string("password", 255).notNullable();
      table.string("remember_token").nullable();
      table.boolean("is_verified").defaultTo(false);
      table.timestamps(true, true, false);
   });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema
    .dropTableIfExists("users");
}
