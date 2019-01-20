module.exports = {
  up: async (knex) => {
    await knex.schema.renameTable("modifications", "revisions")
  },

  down: async (knex) => {
    await knex.schema.renameTable("revisions", "modifications")
  }
}
