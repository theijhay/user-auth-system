module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      userId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
      },
      firstName: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      lastName: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
      },
      password: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      phone: {
          type: DataTypes.STRING,
      },
  });

  User.associate = (models) => {
      User.belongsToMany(models.Organisation, {
          through: models.UserOrganisation,
          foreignKey: 'userId',
      });
  };

  return User;
};
