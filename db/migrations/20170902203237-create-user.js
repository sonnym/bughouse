export default {
  up(queryInterface, {INTEGER, UUID, DATE}) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      uuid: {
        type: UUID
      },
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      }
    })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users')
  }
}
