module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("emails", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid")
        .notNullable()
        .unique()
        .defaultTo(knex.raw('uuid_generate_v4()'))

      table.index("uuid")

      table.string("value").notNullable()
      table.unique("value")

      table.integer("user_id")
        .notNullable()
        .unique()
        .references("users.id")
    })
  },

  down: async (knex) => {
    await knex.schema.dropTable("emails")
  }
}
