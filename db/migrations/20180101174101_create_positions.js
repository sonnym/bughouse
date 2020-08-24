module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("positions", table => {
      table.increments()
      table.timestamps()

      table.string("bfen")
        .notNullable()
        .defaultTo("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")

      table
        .integer("white_time")
        .notNullable()
        .defaultTo(180)

      table
        .integer("black_time")
        .notNullable()
        .defaultTo(180)

      table
        .string("reserve")
        .notNullable()
        .defaultTo("")

      table.string("contents").notNullable()
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("positions")
  }
}
