const ExpressCassandra = require('express-cassandra');

const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'stocks',
    queryOptions: { consistency: ExpressCassandra.consistencies.one },
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1,
    },
    migration: 'safe',
  },
});

const Stocks = models.loadSchema('stocks', {
  fields: {
    ask_price: 'decimal',
    ask_size: 'int',
    bid_price: 'decimal',
    bid_size: 'int',
    last_extended_hours_trade_price: 'decimal',
    last_trade_price: 'decimal',
    symbol: 'text',
    quantity: 'decimal',
    stateofcompany: 'text',
    createdat: 'timestamp',
    updatedat: 'timestamp',
  },
  key: ['symbol'],
});

Stocks.syncDB(function (err, result) {
  if (err) throw err;
});
