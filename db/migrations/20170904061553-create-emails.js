module.exports = {
  up: (queryInterface, {INTEGER, UUID, DATE, STRING}) => {
    return queryInterface.createTable("emails", {
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

      uuid: {
        allowNull: false,
        type: UUID
      },

      value: {
        allowNull: false,
        type: STRING
      }

    }).then(() => {
      queryInterface.addConstraint("emails", ["value"], {
        type: "unique"
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("emails")
  }
}
