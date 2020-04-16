module.exports = {
  up: async (knex) => {
    await knex.schema.table("revisions", async (table) => {
      table.jsonb("move")
    })
  },

  down: async (knex) => {
    await knex.schema.table("revisions", async (table) => {
      table.dropColumn("move")
    })
  }
}
