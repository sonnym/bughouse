module.exports = {
  up: async (knex) => {
    return await knex.schema.createTable("users", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid").notNullable().unique()
      table.index("uuid")

      table.string("password_hash").nullable()
    })
  },

  down: async (knex) => {
    return await knex.schema.dropTable("users")
  }
}
