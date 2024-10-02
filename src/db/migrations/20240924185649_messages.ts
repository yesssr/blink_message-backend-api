import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTableIfNotExists("messages", table => {
      table.string("id", 36).primary();
      table.string("user_id", 36).unsigned();
      table.string("chat_session_id", 36).unsigned();
      table.text("text", "longtext");
      table.boolean("is_read").defaultTo(false);
      table.boolean("is_deleted").defaultTo(false);
      table.timestamps(true, true, false);
      table.foreign("user_id")
        .references("users.id");
      table.foreign("chat_session_id")
        .references("chat_sessions.id");
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("messages");
}

