export default {
  up(queryInterface, {INTEGER, JSON, ARRAY, UUID, STRING, DATE}) {
    return queryInterface.createTable("profiles", {
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
        type: ARRAY
      },

      userId: {
        allowNull: true,
        type: INTEGER,
      }

    }).then(() => {
      queryInterface.addConstraint("profiles", ["provider", "providerId"], {
        type: "unique"
      })

    }).then() => {
      queryInterface.addConstraint("profiles", ["userId"], {
        type: "FOREIGN KEY",
        references: {
          table: "users",
          field: "id"
        }
      })
    })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.showConstraint("profiles")
      .then((constraints) => {
        Promise.all(constraints.map(name => queryInterface.removeConstraint("profiles", name)))
          .then(queryInterface.dropTable("profiles"))
      })
    })
  }
}
