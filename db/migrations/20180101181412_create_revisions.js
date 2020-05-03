module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("revisions", table => {
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
        "reserve",
        "resign",
        "drop",
        "forfeit"
      ], {
        useNative: true,
        enumName: "revision_types"
      }).notNullable()

      table.string("contents").notNullable()
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("revisions")
  }
}
