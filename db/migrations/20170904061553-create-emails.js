module.exports = {
  up: async (queryInterface, {INTEGER, UUID, DATE, STRING}) => {
    await queryInterface.createTable("emails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },

      createdAt: {
        allowNull: false,
        type: DATE
      },

      updatedAt: {
        allowNull: false,
        type: DATE
      },

      deletedAt: {
        allowNull: true,
        type: DATE
      },

      uuid: {
        allowNull: false,
        type: UUID
      },

      value: {
        allowNull: false,
        type: STRING
      }

    })

    return await queryInterface.addConstraint("emails", ["value"], {
      type: "unique"
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("emails")
  }
}
