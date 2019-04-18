const faker = require('faker');
const file = require('fs').createWriteStream('./fakeData.csv');

const date = new Date().toISOString();
const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const companies = new Set();
const seedCount = 10000000;

const assignCompanies = () => {
  let newCompany = '';
  for (let i = 0; i <= 4; i += 1) {
    newCompany += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  if (!companies.has(newCompany)) {
    if (newCompany === undefined) {
      return assignCompanies();
    }
    companies.add(newCompany);
    return newCompany;
  }
  return assignCompanies();
};

const createFakeStock = () => ({
  ask_price: faker.finance.amount(100, 2000, 6),
  ask_size: faker.random.number({ min: 100, max: 500 }),
  bid_price: faker.finance.amount(100, 2000, 6),
  bid_size: faker.random.number({ min: 100, max: 500 }),
  last_extended_hours_trade_price: faker.finance.amount(100, 2000, 6),
  last_trade_price: faker.finance.amount(100, 2000, 6),
  symbol: assignCompanies(),
  quantity: faker.finance.amount(1, 500, 4),
  createdAt: date,
  updatedAt: date,
});

const generateStocks = () => {
  return createFakeStock();

};

const convertArrayOfObjectsToCSV = (data, count) => {
  let result = '';
  if (count === seedCount) {
    result += 'ask_price,ask_size,bid_price,bid_size,last_extended_hours_trade_price,last_trade_price,symbol,quantity,createdAt,updatedAt\n';
  }
  for (var property in data) {
    result += data[property] + ',';
  }
  result = result.slice(0, -1);
  return result + '\n';
};

function writeOneMillionTimes(writer, encoding, callback) {
  let i = seedCount;
  write();
  function write() {
    // convertArrayOfObjectsToCSV(stockData);
    let ok = true;
    do {
      const stockData = (convertArrayOfObjectsToCSV(generateStocks(), i));
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

writeOneMillionTimes(file, 'utf8', () => { console.log('done'); });
