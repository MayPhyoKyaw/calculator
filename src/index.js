import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

const operator = /[×÷+-]/,
    endsWithOperator = /[×÷+-]$/,
    endsWithMinus = /\d[×÷+-]{1}-$/;
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currVal: '0',
      prevVal: '0',
      operation: '',
    }
    this.handleReset = this.handleReset.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.maxDigitWarning = this.maxDigitWarning.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDecimalInput = this.handleDecimalInput.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
  }

  maxDigitWarning () {
    this.setState({
      currVal: 'Digit Limit Met',
      prevVal: this.state.currVal
    });
    setTimeout(() => this.setState({currVal: this.state.prevVal}), 2000)
  }

  handleReset () {
    this.setState({
      currVal: '0',
      prevVal: '0',
      operation: '',
      calculated: false
    })
  }

  handleNumbers (e) {
    if(!this.state.currVal.includes('Limit')) {
      const input = e.target.innerHTML;
      const { currVal, operation, calculated } = this.state;
      this.setState({ calculated: false });
      if(currVal.length > 20) {
        this.maxDigitWarning();
      } else if (calculated) {
        this.setState({
          currVal: input,
          operation: input !== '0' ? input : ''
        });
      }  else {
        this.setState({
          currVal: 
            currVal === '0' || operator.test(currVal)
            ? input
            : currVal + input,
          operation: 
            currVal === '0' && input === '0'
            ? operation === ''
              ? input
              : operation
            : /([^.0-9]0|^0)$/.test(operation)
            ? operation.slice(0, -1) + input
            : operation + input
        })
      }
    }
  }

  handleOperator (e) {
    if(!this.state.currVal.includes('Limit')) {
      const input = e.target.innerHTML;
      const { operation, prevVal, calculated} = this.state;
      this.setState({currVal: input, calculated: false});
      if (calculated) {
        this.setState({ operation: prevVal + input });
      } else if(!endsWithOperator.test(operation)) {
        this.setState({
          prevVal: operation,
          operation: operation + input
        });
      } else if (!endsWithMinus.test(operation)) {
        this.setState({
          operation: 
            (endsWithMinus.test(operation + input) ? operation : prevVal) + input
        });
      } else if (input !== '-') {
        this.setState({
          operation: prevVal + input
        });
      }
    }
  }

  handleDecimalInput () {
    const { currVal, operation, calculated } = this.state;
    if (calculated === true) {
      this.setState({
        currVal: '0.',
        operation: '0.',
        calculated: false
      });
    } else if(!currVal.includes('.') && ! currVal.includes('Limit')) {
      this.setState({ calculated: false });
      if (currVal.length > 20) {
        this.maxDigitWarning();
      } else if (endsWithOperator.test(operation) || currVal === '0' && operation === '') {
        this.setState({
          currVal: '0.',
          operation: operation + '0.'
        });
      } else {
        // console.log(operation.match(/(-?\d+\.?\d*)$/))
        this.setState({
          currVal: operation + '.',
          operation: operation + '.'
        })
      }
    }
  }

  handleCalculate () {
    let currVal = this.state.currVal;
    if(!currVal.includes('Limit')) {
      let operation = this.state.operation;
      while(endsWithOperator.test(operation)) {
        operation = operation.slice(0, -1);
      }
      operation = operation
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/^(\*|\/|\+)/, '');
      let result = Math.round(1000000000000 * eval(operation)) / 1000000000000;   
      this.setState({
        currVal: result.toString(),
        operation: operation
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/(x|÷|\+)‑/, '$1-'),
        prevVal: result,
        calculated: true,
      })       
    }
  }

  render(){
    return (
      <div className="container outer px-2 py-2">
        <div className="rounded display">
          <Operation formula={this.state.operation} />
          <Result output={this.state.currVal} />
        </div>
        <div className="input-group">
          <div className="py-1 px-2">
            <CalculatorButton id="clear" btnClass="clear" onClick={this.handleReset} value="AC"  />
            <CalculatorButton id="divide" btnClass="operator" onClick={this.handleOperator} value="÷"  />
            <CalculatorButton id="multiply" btnClass="operator" onClick={this.handleOperator} value="×"  />
          </div>
          <div className="digit-block">
            <div className="py-1">
              <CalculatorButton id="seven" btnClass="digit" onClick={this.handleNumbers} value="7"  />
              <CalculatorButton id="eight" btnClass="digit" onClick={this.handleNumbers} value="8"  />
              <CalculatorButton id="nine" btnClass="digit" onClick={this.handleNumbers} value="9"  />
            </div>
            <div className="py-1">
              <CalculatorButton id="four" btnClass="digit" onClick={this.handleNumbers} value="4"  />
              <CalculatorButton id="five" btnClass="digit" onClick={this.handleNumbers} value="5"  />
              <CalculatorButton id="six" btnClass="digit" onClick={this.handleNumbers} value="6"  />
            </div>
            <div className="py-1">
              <CalculatorButton id="one" btnClass="digit" onClick={this.handleNumbers} value="1"  />
              <CalculatorButton id="two" btnClass="digit" onClick={this.handleNumbers} value="2"  />
              <CalculatorButton id="three" btnClass="digit" onClick={this.handleNumbers} value="3"  />
            </div>
            <div className="py-1">
              <CalculatorButton id="zero" btnClass="digit-zero" onClick={this.handleNumbers} value="0"  />
              <CalculatorButton id="decimal" btnClass="digit" onClick={this.handleDecimalInput} value="."  />
            </div>
          </div>
          <div className="op-block">
            <div className="py-1">
              <CalculatorButton id="subtract" btnClass="operator" onClick={this.handleOperator} value="-"  />
            </div>
            <div className="py-1">
              <CalculatorButton id="add" btnClass="operator" onClick={this.handleOperator} value="+"  />
            </div>
            <div className="py-1">
              <CalculatorButton id="equals" btnClass="equal" onClick={this.handleCalculate} value="="  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class CalculatorButton extends React.Component {
  render() {
    const {id, btnClass, onClick, value} = this.props;
    // console.log(id, btnClass, onClick, value);
    return (
      <button id={id} className={'input ' + btnClass} onClick={onClick} value={value}>{value}</button>
    );
  }
}

class Operation extends React.Component {
  render() {
    console.log(this.props)
    return (
      <div className="operationDisplay">{this.props.formula}</div>
    );
  }
}

class Result extends React.Component {
  render() {
    return (
      <div id="display"  className="resultDisplay">{this.props.output}</div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Calculator />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
