import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import DisplayContainer from './Dropdown.jsx';

export const Input = ({ label, disabled, onChange, min, name, value, placeholderText }) => (
  <React.Fragment>
    <label>
      {label}
    </label>
    <input autoComplete="off" min={min} disabled={disabled} name={name} type="text" value={value} placeholder={placeholderText} onChange={onChange} />
  </React.Fragment>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stock: {
        // symbol: '',
        // stopprice: '0',
        // limitprice: '0',
        // quantity: '0',
        // last_extended_hours_trade_price: '0',
        ask_price: '0',
        ask_size: 0,
        bid_price: '0',
        bid_size: 0,
        last_extended_hours_trade_price: '0',
        last_trade_price: '0',
        symbol: '',
        quantity: '0.0000',
        createdAt: '',
        updatedAt: '',
      },
      account: {
        buying_power: '',
        option_level: 0,
        watchlist: '',
      },
      side: 'buy',
      ordertype: 'market', // market, limit, stoploss, stoplimit
      stopprice: '',
      limitprice: '',
      quantity: '',
      estimatedOrderPrice: 0,
    };

    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleShareChange = this.handleShareChange.bind(this);
    this.updateStopPrice = this.updateStopPrice.bind(this);
    this.updateLimitPrice = this.updateLimitPrice.bind(this);
    this.watchlistUpdate = this.watchlistUpdate.bind(this);
  }

  componentDidMount() {
    this.getStockData();
    this.getAccountData();
  }

  getStockData() {
    axios.get('/stocks/aapl')
      .then(res => res.data)
      .then((result) => {
        this.setState({
          stock: result,
        });
      });
  }

  getAccountData() {
    axios.get('/accounts/2QW30682')
      .then(res => res.data)
      .then((result) => {
        this.setState({
          account: result,
        });
      });
  }

  handlePriceChange(value) {
    let inputString = value; // '$14,239'
    const reg = /^\d*\.?\d*$/;

    if (inputString.length !== 1) {
      inputString = inputString.substr(1, inputString.length); // '14,239'
    }
    inputString = inputString.split(',').join(''); // '14239'

    if (reg.test(inputString)) {
      let inputNum = inputString.split('.');
      inputNum[0] = inputNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (inputNum[1]) inputNum[1] = inputNum[1].substr(0, 4);
      inputNum = inputNum.join('.');

      return `$${inputNum}`;
    }
    const noChange = value.substr(0, value.length - 1);
    return noChange;
  }

  handleShareChange(value) {
    const reg = /^\d+$/;

    if (reg.test(value)) {
      this.setState({
        quantity: value,
      });
    } else {
      const noChange = value.substr(0, value.length - 1);
      this.setState({
        quantity: noChange,
      });
    }

    if (value === '') {
      this.setState({
        quantity: '',
      });
    }
    setTimeout(() => this.updateEstimatedOrderPrice(), 0);
  }

  updateStopPrice(event) {
    if (event.target.value === '') {
      this.setState({
        stopprice: '',
      });
    } else {
      const newPrice = this.handlePriceChange(event.target.value);
      this.setState({
        stopprice: newPrice,
      });
    }
  }

  updateLimitPrice(event) {
    if (event.target.value === '') {
      this.setState({
        limitprice: '',
      });
    } else {
      const newPrice = this.handlePriceChange(event.target.value);
      this.setState({
        limitprice: newPrice,
      });
    }

    setTimeout(() => this.updateEstimatedOrderPrice(), 0);
  }

  updateEstimatedOrderPrice() {
    if (this.state.ordertype === 'market' || this.state.ordertype === 'stoploss') {
      const orderTotal = Math.round(Number(this.state.stock.last_extended_hours_trade_price) * Number(this.state.quantity) * 100) / 100;
      this.setState({
        estimatedOrderPrice: orderTotal,
      });
    } else {
      const orderTotal = Math.round(Number(this.state.limitprice.substr(1, this.state.limitprice.length)) * Number(this.state.quantity) * 100) / 100;
      this.setState({
        estimatedOrderPrice: orderTotal,
      });
    }
  }

  watchlistUpdate() {
    const watchlistArray = this.state.account.watchlist.split(',');
    const currentSymbol = this.state.stock.symbol;
    const newAccount = this.state.account;

    if (_.includes(watchlistArray, currentSymbol)) {
      _.pull(watchlistArray, currentSymbol);
      const newWatchlist = watchlistArray.join(',');
      newAccount.watchlist = newWatchlist;
      this.setState({
        account: newAccount,
      });
    } else {
      watchlistArray.push(currentSymbol);
      const newWatchlist = watchlistArray.join(',');
      newAccount.watchlist = newWatchlist;
      this.setState({
        account: newAccount,
      });
    }
  }

  render() {
    const isWatched = (symbol) => {
      return _.includes(this.state.account.watchlist.split(','), symbol);
    };

    let tradeButton;
    if (this.state.account.option_level > 0) {
      tradeButton = <button type="submit">Trade {this.state.stock.symbol} Options</button>;
    } else {
      tradeButton = <div />;
    }

    let stopPriceRow;
    if (this.state.ordertype === 'stoploss' || this.state.ordertype === 'stoplimit') {
      stopPriceRow = (
        <label>
          <div>Stop Price</div>
          <Input
            name="stop_price"
            placeholderText="$0.00"
            disabled={false}
            value={this.state.stopprice}
            onChange={e => this.updateStopPrice(e)}
            // onFocus={}
          />
        </label>
      );
    } else {
      stopPriceRow = <div />;
    }

    let limitPriceRow;
    if (this.state.ordertype === 'limit' || this.state.ordertype === 'stoplimit') {
      limitPriceRow = (
        <label>
          <div>Limit Price</div>
          <Input
            name="price"
            placeholderText="$0.00"
            disabled={false}
            value={this.state.limitprice}
            onChange={e => this.updateLimitPrice(e)}
            // onFocus={}
          />
        </label>
      );
    } else {
      limitPriceRow = <div />;
    }

    let marketPriceRow;
    if (this.state.ordertype === 'market') {
      marketPriceRow = (
        <label>
          <div>Market Price</div>
          <div>{ `$${this.state.stock.last_extended_hours_trade_price.substr(0, this.state.stock.last_extended_hours_trade_price.length - 4)}` }</div>
        </label>
      );
    } else {
      marketPriceRow = <div />;
    }

    let expirationRow;
    if (this.state.ordertype === 'limit' || this.state.ordertype === 'stoploss' || this.state.ordertype === 'stoplimit') {
      expirationRow = (
        <label>
          <div>Expiration</div>
          <DisplayContainer />
        </label>
      );
    } else {
      expirationRow = <div />;
    }

    return (
      <React.Fragment>
        <div>Buy { this.state.stock.symbol }</div>
        <div>Sell { this.state.stock.symbol }</div>
        <div>...</div>
        <form>
          <div>
            {stopPriceRow}
          </div>
          <div>
            {limitPriceRow}
          </div>
          <div>
            <label>
              <div>Shares</div>
              <Input
                name="quantity"
                placeholderText="0"
                disabled={false}
                value={this.state.quantity}
                min="0"
                onChange={e => this.handleShareChange(e.target.value)}
                // onFocus={}
              />
            </label>
          </div>
          <div>
            {marketPriceRow}
          </div>
          <div>
            {expirationRow}
          </div>
          <div>
            <label>
              <div>{this.state.side === 'buy' ? 'Estimated Cost' : 'Estimated Credit'}</div>
              <div>{this.handlePriceChange(`$${this.state.estimatedOrderPrice}`)}</div>
            </label>
          </div>
          <button type="submit">Review Order</button>
          <div>{this.state.side === 'buy' ? `${this.handlePriceChange(`$${Math.round(Number(this.state.account.buying_power) * 100) / 100}`)} Buying Power Available` : `${Math.round(this.state.stock.quantity)} Shares Available`}</div>
        </form>
        <div>{tradeButton}</div>
        <div><button type="submit" onClick={this.watchlistUpdate}>{isWatched(this.state.stock.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}</button></div>
      </React.Fragment>
    );
  }
}

export default App;
