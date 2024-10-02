import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTableIfNotExists("chat_sessions", table => {
      table.string("id", 36).primary();
      table.string("own_id", 36).unsigned();
      table.string("user_id", 36).unsigned();
      table.boolean("is_deleted").defaultTo(false);
      table.timestamps(true, true, false);
      table.foreign("own_id").references("users.id");
      table.foreign("user_id").references("users.id");
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("chat_sessions");
}

