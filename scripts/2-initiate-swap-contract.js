const MyContract = artifacts.require('MyContract')

module.exports = async callback => {
  try {
    const mc = await MyContract.deployed()
    console.log('Creating request on contract:', mc.address)

    const accounts = await web3.eth.getAccounts()

    const tx = await mc.initiateSwapContract(
      "mYbTcAdDrEsS",
      "12.34567890",
      web3.utils.toHex("10000000000000000"),
      {
        from: accounts[1],
        value: 10000000000000000,
      },
    )
    callback(tx.tx)
  } catch (e) {
    console.log("Error : ", e);
  }
}
