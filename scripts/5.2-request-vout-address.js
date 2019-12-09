const MyContract = artifacts.require('MyContract')

module.exports = async callback => {
  try {
    const mc = await MyContract.deployed()
    console.log('Creating request on contract:', mc.address)

    const accounts = await web3.eth.getAccounts()

    const tx = await mc.requestVoutAddress(
      "mYbTcAdDrEsS"
    )

    callback(tx.tx)
  } catch (e) {
    console.log("Error : ", e);
  }
}
