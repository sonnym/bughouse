module.exports = {
  up: async (knex) => {
    await knex.schema.table("positions", async (table) => {
      table
        .jsonb("white_reserve")
        .notNullable()
        .defaultTo({ })

      table
        .jsonb("black_reserve")
        .notNullable()
        .defaultTo({ })

      table.dropColumn("reserve")
    })
  },

  down: async (knex) => {
    await knex.schema.table("positions", async (table) => {
      table
        .string("reserve")
        .notNullable()
        .defaultTo("")

      table.dropColumn("white_reserve")
      table.dropColumn("black_reserve")
    })
  }
}
