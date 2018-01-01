module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("games", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid")
        .notNullable()
        .unique()
        .defaultTo(knex.raw("uuid_generate_v4()"))

      table.index("uuid")

      table.integer("white_user_id")
        .notNullable()
        .references("users.id")

      table.integer("black_user_id")
        .notNullable()
        .references("users.id")

      table.enu("time_control", [
        "3/2",
        "5/0"
      ]).notNullable()
        .defaultTo("3/2")

      table.enu("result", [
        "-",
        "1-0",
        "0-1",
        "½-½"
      ]).notNullable()
        .defaultTo("-")
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("games")
  }
}
