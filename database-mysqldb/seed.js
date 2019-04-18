const faker = require('faker');
const db = require('./index.js');
const Stock = require('./Stocks.js');
const Account = require('./Accounts.js');

const sampleStockData = [{
  ask_price: '189.190000',
  ask_size: 100,
  bid_price: '189.170000',
  bid_size: 100,
  last_extended_hours_trade_price: '189.160000',
  last_trade_price: '189.160000',
  symbol: 'AAPL',
  quantity: '133.0000',
  createdAt: '2019-03-29T17:37:11.000Z',
  updatedAt: '2019-03-29T17:37:11.000Z',
},
];


const insertSampleStockData = () => {
  sampleStockData.map(stockData => (
    Stock.create({
      ask_price: stockData.ask_price,
      ask_size: stockData.ask_size,
      bid_price: stockData.bid_price,
      bid_size: stockData.bid_size,
      last_extended_hours_trade_price: stockData.last_extended_hours_trade_price,
      last_trade_price: stockData.last_trade_price,
      symbol: stockData.symbol,
      quantity: stockData.quantity,
    })
  ));
};

const sampleAccount = {
  account_number: '2QW30682',
  buying_power: '486422.2050',
  option_level: 3,
  watchlist: 'FB,TSLA,SQ,AAPL,MSFT,BABA,V,JPM,BAC',
};

const insertSampleAccount = () => {
  Account.create(sampleAccount);
};

db.drop()
  .then(() => db.sync())
  .then(() => insertSampleAccount())
  .then(() => insertSampleStockData());
