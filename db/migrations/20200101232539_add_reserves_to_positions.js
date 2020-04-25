module.exports = {
  up: async (knex) => {
    await knex.schema.table("positions", async (table) => {
      table
        .jsonb("white_reserve")
        .notNullable()
        .defaultTo({ p: 0, r: 0, n: 0, b: 0, q: 0 })

      table
        .jsonb("black_reserve")
        .notNullable()
        .defaultTo({ p: 0, r: 0, n: 0, b: 0, q: 0 })

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
