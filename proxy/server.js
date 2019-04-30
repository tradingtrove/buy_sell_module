const express = require('express');
// const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const redis = require('redis');
const controller = require('../controller');

const client = redis.createClient();
const app = express();
const port = process.env.PORT || 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use('/stocks/:ticker', express.static(path.join(__dirname, 'public')));

// app.get('stocks/:ticker', (req, res) => {
//   res.status(200).sendFile(__dirname,'index.html');
// });

// const chartReq = axios.create({
//   baseURL: 'http://ec2-13-57-177-212.us-west-1.compute.amazonaws.com:2468/'
// });

// app.get('/api/:stockId', (req, res) => {
//   chartReq.get(`api/${req.params.stockId}`)
//   .then((response) => {
//     res.send(response.data);
//   })
// })
// const axios3002 = axios.create({
//   baseURL: 'http://localhost:3002',
// });

// app.use('/api/stocks/:ticker', (req, res) => {
//   axios3002.get(`/api/stocks/${req.params.ticker}`)
//     .then(response => res.send(response.data))
//     .catch(err => res.send(err));
// });

// app.use('/api/accounts/:account_number', (req, res) => {
//   axios3002.get(`/api/accounts/${req.params.account_number}`)
//     .then(response => res.send(response.data))
//     .catch(err => res.send(err));
// });
const BuySell = (req, res) => {
  axios.get(`http://localhost:3002/api/stocks/${req.params.ticker}`)
    .then((response) => {
      client.setex(req.params.ticker, 3600, JSON.stringify(response.data));
      res.status(200);
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getCache = (req, res) => {
  let ticker = req.params.ticker;
  //Check the cache data from the server redis
  client.get(ticker, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      BuySell(req, res);
    }
  });
};

app.get('/api/stocks/:ticker', getCache);


app.get('localhost:3002/api/accounts/:account_number', (req, res) => {
  controller.getAccountInfo(req.params.account_number)
    .then((account) => {
      res.status(200);
      res.send(account);
    });
});


app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});

