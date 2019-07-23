module.exports = {
  up: async (knex) => {
    await knex.schema.table("positions", async (table) => {
      table.integer("move_number").notNullable().defaultTo(1)

      table.unique(["id", "move_number"])
    })
  },

  down: async (knex) => {
    await knex.schema.table("positions", async table => await table.dropColumn("move_number"))
  }
}
