import React from 'react';
import axios from 'axios';
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
      quantity: null,
    };

    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleShareChange = this.handleShareChange.bind(this);
    this.updateStopPrice = this.updateStopPrice.bind(this);
    this.updateLimitPrice = this.updateLimitPrice.bind(this);
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

  handlePriceChange(event) {
    let inputString = event.target.value; // '$14,239'
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
    event.target.value = event.target.value.substr(0, event.target.value.length - 1);
  }

  updateStopPrice(event) {
    if (event.target.value === '') {
      this.setState({
        stopprice: '',
      });
    } else {
      const newPrice = this.handlePriceChange(event);
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
      const newPrice = this.handlePriceChange(event);
      this.setState({
        limitprice: newPrice,
      });
    }
  }

  handleShareChange(event) {
    console.log('share input value: ', event.target.value);
    const reg = /^\d+$/;

    if (reg.test(event.target.value)) {
      this.setState({
        quantity: Number(event.target.value),
      });
    } else {
      event.target.value = event.target.value.substr(0, event.target.value.length - 1);
    }

    if (event.target.value === '') {
      this.setState({
        quantity: null,
      });
    }
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
            placeholderText="$0.00"
            disabled={false}
            value={this.state.stopprice}
            onChange={e => this.updateStopPrice(e)}
            // onFocus={}
          />
          <Input
            label="Limit Price"
            name="price"
            placeholderText="$0.00"
            disabled={false}
            value={this.state.limitprice}
            onChange={e => this.updateLimitPrice(e)}
            // onFocus={}
          />
          <Input
            label="Shares"
            name="quantity"
            placeholderText="0"
            disabled={false}
            value={this.state.quantity}
            min="0"
            onChange={e => this.handleShareChange(e)}
            // onFocus={}
          />
          <div>Market Price { '$' + this.state.stock.last_extended_hours_trade_price.substr(0, this.state.stock.last_extended_hours_trade_price.length - 4) }</div>
          <div>
            Expiration
            <DisplayContainer />
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
