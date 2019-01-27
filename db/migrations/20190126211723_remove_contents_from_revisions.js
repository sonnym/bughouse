module.exports = {
  up: async (knex) => {
    await knex.schema.table("revisions", async table => await table.dropColumn("contents"))
  },

  down: async (knex) => { }
}
