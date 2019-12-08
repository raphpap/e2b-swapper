const MyContract = artifacts.require('MyContract')

module.exports = async callback => {
  const mc = await MyContract.deployed()
  console.log('Creating request on contract:', mc.address)

  const accounts = await web3.eth.getAccounts()

  const tx = await mc.initiateSwapContract(
    "mYbTcAdDrEsS",
    "12.34567890",
    {
      from: accounts[1],
      value: 100000000000000000,
    },
  )
  callback(tx.tx)
}
