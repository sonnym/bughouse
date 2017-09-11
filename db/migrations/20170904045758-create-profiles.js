module.exports = {
  up: async (knex) => {
    await knex.schema.createTable("profiles", table => {
      table.increments()
      table.timestamps()

      table.uuid("uuid")
      table.index("uuid")

      table.string("provider")
      table.string("provider_id")
      table.unique(["provider", "provider_id"])

      table.string("display_name")

      table.jsonb("name")
      table.jsonb("photos")

      table.integer("user_id").unsigned()
      table.foreign("user_id").references("users.id")
    })
  },

  down: async (knex) => {
    return await knex.schema.dropTable("profiles")
  }
}
