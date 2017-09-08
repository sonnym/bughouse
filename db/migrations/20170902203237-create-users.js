module.exports = {
  up: (queryInterface, {INTEGER, UUID, DATE, STRING}) => {
    return queryInterface.createTable('users', {
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

      passwordHash: {
        allowNull: true,
        type: STRING
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users')
  }
}
