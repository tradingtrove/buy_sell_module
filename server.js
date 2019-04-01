const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const Stock = require('./database-mysqldb/Stocks.js');
const Account = require('./database-mysqldb/Accounts.js');

const app = express();

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());

app.get('/stocks/:ticker', (req, res) => {
  Stock.findOne({ where: { symbol: req.params.ticker } })
    .then((stockData) => {
      res.status(200);
      res.send(stockData);
    });
});

app.get('/accounts/:account_number', (req, res) => {
  Account.findOne({ where: { account_number: req.params.account_number } })
    .then((account) => {
      res.status(200);
      res.send(account);
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!\n'));
