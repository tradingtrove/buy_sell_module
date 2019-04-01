const Sequelize = require('sequelize');

const db = new Sequelize('stocks', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db;
