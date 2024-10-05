import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTableIfNotExists("chat_sessions", table => {
      table.string("id", 36).primary();
      table.string("name", 255).nullable();
      table.enu("type", ['individuals', 'group'])
        .defaultTo('individuals');
      table.text("last_message", "longtext");
      table.string("user_id").unsigned();
      table.boolean("is_deleted").defaultTo(false);
      table.timestamps(true, true, false);
      table.foreign("user_id")
        .references("users.id");
    });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .dropTableIfExists("chat_sessions");
}

