module.exports = {
  up: async (knex) => {
    return await knex.schema.createTable("ratings", table => {
      table.increments()
      table.timestamps()

      table.integer("user_id")
        .notNullable()
        .references("users.id")

      table.integer("game_id")
        .references("games.id")

      table.integer("value")
        .notNullable()
        .defaultTo(1200)
    })
  },

  down: async (knex) => {
    return await knex.schema.dropTable("ratings")
  }
}
