module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("emails", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid").notNullable()
      table.index("uuid")

      table.string("value").notNullable()
      table.unique("value")
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("emails")
  }
}
