module.exports = (sequelize, DataTypes) => {
  const UserOrganisation = sequelize.define('UserOrganisation', {
      id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
      },
      userId: {
          type: DataTypes.UUID,
          allowNull: false,
      },
      orgId: {
          type: DataTypes.UUID,
          allowNull: false,
      },
  });

  return UserOrganisation;
};
