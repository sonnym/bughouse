module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("modifications", table => {
      table.increments()
      table.timestamps()

      table.integer("game_id")
        .notNullable()
        .references("games.id")

      table.integer("source_game_id")
        .notNullable()
        .references("games.id")

      table.integer("position_id")
        .notNullable()
        .references("positions.id")

      table.enu("type", [
        "start",
        "move",
        "reserve"
      ]).notNullable()

      table.string("contents").notNullable()
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("modifications")
  }
}
