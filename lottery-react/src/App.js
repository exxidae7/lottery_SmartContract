import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import React, { Component } from "react";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "waitin on transaction success...... " });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({
      message: "u have been entered to the pot , feel free to lose ",
    });
  };
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are {this.state.players.length} entered in the lottery right now
        </p>
        <p>
          But only one can win the prize of{" "}
          {web3.utils.fromWei(this.state.balance, "ether")}
          USD from the lottery
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck</h4>
          <div>
            <label>Amount of ether to enter</label>
          </div>
          <input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
          <button>Enter</button>
        </form>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
