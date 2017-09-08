module.exports = {
  up: async (queryInterface, {INTEGER, UUID, DATE, STRING, JSON}) => {
    await queryInterface.createTable("profiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },

      uuid: {
        allowNull: false,
        type: UUID
      },

      provider: {
        allowNull: false,
        type: STRING
      },

      providerId: {
        allowNull: false,
        type: STRING
      },

      displayName: {
        allowNull: false,
        type: STRING
      },

      name: {
        allowNull: false,
        type: JSON
      },

      photos: {
        allowNull: true,
        type: STRING
      },

      userId: {
        allowNull: true,
        type: INTEGER,
      }

    })

    await queryInterface.addConstraint("profiles", ["provider", "providerId"], {
      type: "unique"
    })

    return await queryInterface.addConstraint("profiles", ["userId"], {
      type: "FOREIGN KEY",
      references: {
        table: "users",
        field: "id"
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable("profiles")
  }
}
