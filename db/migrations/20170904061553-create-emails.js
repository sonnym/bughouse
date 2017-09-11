module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("emails", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid")
      table.index("uuid")

      table.string("value")
      table.unique("value")
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("emails")
  }
}
