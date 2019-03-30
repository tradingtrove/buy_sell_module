const Sequelize = require('sequelize');
const db = require('./index.js');

const Account = db.define('account', {
  account_number: {
    type: Sequelize.STRING(8),
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  buying_power: {
    type: Sequelize.DECIMAL(14, 4),
  },
  option_level: {
    type: Sequelize.INTEGER,
  },
  watchlist: {
    type: Sequelize.STRING,
  },
});

module.exports = Account;
