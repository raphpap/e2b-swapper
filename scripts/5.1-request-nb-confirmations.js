const MyContract = artifacts.require('MyContract')

module.exports = async callback => {
  try {
    const mc = await MyContract.deployed()
    console.log('Creating request on contract:', mc.address)

    const accounts = await web3.eth.getAccounts()

    const tx = await mc.requestNbConfirmations(
      "mYbTcAdDrEsS",
      "a7e5415a255c2bcbc15f837d5664b6a6f21fff12174deccc57d21ab42d8ba262"
    )

    callback(tx.tx)
  } catch (e) {
    console.log("Error : ", e);
  }
}
