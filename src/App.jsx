import React from 'react';
import axios from 'axios';

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
        symbol: '0',
        stopprice: '0',
        limitprice: '0',
        quantity: '0',
        last_extended_hours_trade_price: '0',
      },
      side: 'buy',
      ordertype: 'stoplimit',
      stopprice: '',
      limitprice: '',
      quantity: 0,
    };
  }

  componentDidMount() {
    this.getStockData();
  }

  getStockData() {
    axios.get('/stocks/tsla')
      .then(res => res.data)
      .then((result) => {
        this.setState({
          stock: result,
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <div>Buy { this.state.stock.symbol }</div>
        <div>Sell { this.state.stock.symbol }</div>
        <div>...</div>
        <form>
          <Input
            label="Stop Price"
            name="stop_price"
            type="text"
            placeholderText="$0.00"
            disabled={false}
            value={`$${this.state.stopprice}`}
            // onChange={e => this.handleStopPriceChange(e)}
            // onFocus={}
          />
          <Input
            label="Limit Price"
            name="price"
            type="text"
            placeholderText="$0.00"
            disabled={false}
            value={`$${this.state.limitprice}`}
            // onChange={e => this.handleLimitPriceChange(e)}
            // onFocus={}
          />
          <Input
            label="Shares"
            name="quantity"
            type="number"
            placeholderText="0"
            disabled={false}
            pattern="[0-9]*"
            value={this.state.quantity}
            min="0"
            // onChange={e => this.handleShareChange(e)}
            // onFocus={}
          />
          <div>Market Price { '$' + this.state.stock.last_extended_hours_trade_price.substr(0, this.state.stock.last_extended_hours_trade_price.length - 4) }</div>
          <div>
            Expiration
            {/* <DisplayContainer /> */}
          </div>
        </form>
        <div>Estimated Cost/Credit $1,000,000.00</div>
        <button type="submit">Review Order</button>
        <div>$1020.45 Buying Power Available</div>
        <button type="submit">Trade TSLA Options</button>
        <button type="submit">Add to Watchlist</button>
      </React.Fragment>
    );
  }
}

export default App;
