module.exports = {
  up: async (knex) => {
    await knex.schema.table("positions", async table => await table.dropColumn("contents"))
  },

  down: async (knex) => { }
}
