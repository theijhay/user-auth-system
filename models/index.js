const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // This will help you connect to the DB in Vercel with SSL
      rejectUnauthorized: false, // For Heroku, AWS, Vercel etc.
    },
  },
  logging: false,
});

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User.belongsToMany(db.Organisation, { through: db.UserOrganisation, foreignKey: 'userId' });
db.Organisation.belongsToMany(db.User, { through: db.UserOrganisation, foreignKey: 'orgId' });

module.exports = db;
