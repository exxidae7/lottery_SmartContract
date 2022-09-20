import logo from './logo.svg';
import './App.css';
import web3 from './web3'
import lottery from './lottery'
import React, { Component } from 'react'

class App extends Component{
  state = {
    manager : '',
    players: [],
    balance: ''
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({ manager  , players , balance })
  }
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by { this.state.manager }</p>
        <p>There are  {this.state.players.length} entered in the lottery right now</p>
        <p>But only one can win the prize of {web3.utils.fromWei(this.state.balance, 'ether')} USD from the lottery</p>
      </div>
    );
  }
}

export default App;
