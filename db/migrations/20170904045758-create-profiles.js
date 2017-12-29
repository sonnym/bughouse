module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("profiles", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid").notNullable().unique()
      table.index("uuid")

      table.string("provider").notNullable()
      table.string("provider_id").notNullable()
      table.unique(["provider", "provider_id"])

      table.string("display_name").notNullable()

      table.jsonb("name").notNullable()
      table.jsonb("photos").nullable()

      table.integer("user_id").unsigned()
      table.foreign("user_id").references("users.id")
    })
  },

  down: async (knex) => {
    return await knex.schema.dropTable("profiles")
  }
}
