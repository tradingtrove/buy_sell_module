const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const controller = require('./controller');

const app = express();

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());

app.get('/stocks/:ticker', (req, res) => {
  controller.getStockInfo(req.params.ticker)
    .then((stockData) => {
      res.status(200);
      res.send(stockData);
    });
});

app.get('/accounts/:account_number', (req, res) => {
  controller.getAccountInfo(req.params.account_number)
    .then((account) => {
      res.status(200);
      res.send(account);
    });
});

app.listen(3000, () => console.log('App listening on port 3000!\n'));
