const assert = require('assert');
const ganache = require('ganache-cli')

const Web3 = require('web3')
const web3 = new Web3(ganache.provider())


const { interface , bytecode } = require('../compile')

let lottery
let accounts


beforeEach(async () => {
     accounts = await web3.eth.getAccounts()
     lottery = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({data : bytecode})
     .send({from : accounts[0] , gas : '1000000'})
})


describe('Lottery Contract' , () => {
     it('deploys a contract' , () => {
          assert.ok(lottery.options.address)
     })

     it('allows one account to enter' , async () =>{
          await lottery.methods.enter().send({
               from : accounts[0],
               value : web3.utils.toWei('0.002' , 'ether')
          })
          const players = await lottery.methods.getPlayers().call(({
               from : accounts[0]
          }))

          assert.equal(accounts[0] , players[0])
          assert.equal(1 , players.length)
     })
     it('require a minimun amount of ether to enter' , async () => {
          try {
               await lottery.methods.enter().send({
                    from : accounts[0],
                    value : 0
               })
          }
          catch (e) {
               assert(e)
          }

     })
     it('only manager can call pickWinder' , async  () => {
     try{
          await lottery.methods.pickWinner().send({
               from : accounts[1] 
          });
          assert(false)
     }catch (err){
          assert(err)
     }
     })
     it('sends money to the winner and resets the players' , async () => {
          await lottery.methods.enter().send({
               from: accounts[0],
               value: web3.utils.toWei('0.02' , 'ether')
          })
          const initialBalance = await web3.eth.getBalance(accounts[0])

          await lottery.methods.pickWinner().send({
               from : accounts[0]
          })

          const finalBalance = await web3.eth.getBalance(accounts[0])

          const difference =  finalBalance - initialBalance
          console.log(difference)
          assert(difference > web3.utils.toWei('0.8' , 'ether'))
     })
})