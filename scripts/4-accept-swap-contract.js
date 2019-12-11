const MyContract = artifacts.require('MyContract')

module.exports = async callback => {
  try {
    const mc = await MyContract.deployed()
    console.log('Creating request on contract:', mc.address)

    const accounts = await web3.eth.getAccounts()

    const eBtcAddress = "tb1qvy2t47rgwmkj73ayp92pmfj4wtww7l23hcudu3";

    const tx = await mc.acceptSwapContract(
      eBtcAddress,
      {
        from: accounts[2],
        value: 10000000000000000,
      }
    )

    callback(tx.tx)
  } catch (e) {
    console.log("Error : ", e);
  }
}
