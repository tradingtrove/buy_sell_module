const faker = require('faker');
const file = require('fs').createWriteStream('./fakeData.csv');

const date = new Date().toISOString();
const possibleLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const seedCount = 10000000;

const assignCompanies = (i) => {
  let remainder = i;
  const place390625 = Math.trunc(remainder / 390625);
  remainder -= 390625 * place390625;
  const place15625 = Math.trunc(remainder / 15625);
  remainder -= 15625 * place15625;
  const place625 = Math.trunc(remainder / 625);
  remainder -= 625 * place625;
  const place25 = Math.trunc(remainder / 25);
  remainder -= 25 * place25;
  const place1 = remainder;

  return possibleLetters[place390625] + possibleLetters[place15625] + possibleLetters[place625] + possibleLetters[place25] + possibleLetters[place1];
};

const createFakeStock = (i) => ({
  ask_price: faker.finance.amount(100, 2000, 6),
  ask_size: faker.random.number({ min: 100, max: 500 }),
  bid_price: faker.finance.amount(100, 2000, 6),
  bid_size: faker.random.number({ min: 100, max: 500 }),
  last_extended_hours_trade_price: faker.finance.amount(100, 2000, 6),
  last_trade_price: faker.finance.amount(100, 2000, 6),
  symbol: assignCompanies(i),
  quantity: faker.finance.amount(1, 500, 4),
  createdAt: date,
  updatedAt: date,
});

const generateStocks = (i) => {
  return createFakeStock(i);
};

const convertArrayOfObjectsToCSV = (data, count) => {
  let result = '';
  if (count === seedCount) {
    result += 'ask_price,ask_size,bid_price,bid_size,last_extended_hours_trade_price,last_trade_price,symbol,quantity,createdAt,updatedAt\n';
  }
  for (let property in data) {
    result += data[property] + ',';
  }
  result = result.slice(0, -1);
  return result + '\n';
};

function writeOneMillionTimes(writer, encoding, callback) {
  let i = seedCount;
  write();
  function write() {
    let ok = true;
    do {
      const stockData = (convertArrayOfObjectsToCSV(generateStocks(i), i));
      i -= 1;
      if (i === 0) {
        writer.write(stockData, encoding, callback);
      } else {
        ok = writer.write(stockData, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
}

writeOneMillionTimes(file, 'utf8', () => { console.log('Done Generating'); });
