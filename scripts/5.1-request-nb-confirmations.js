const MyContract = artifacts.require('MyContract')

module.exports = async callback => {
  try {
    const mc = await MyContract.deployed()
    console.log('Creating request on contract:', mc.address)

    const accounts = await web3.eth.getAccounts()

    const eBtcAddress = 'tb1qvy2t47rgwmkj73ayp92pmfj4wtww7l23hcudu3'
    const transactionHash =
      'be3ad5fb7c1c621b4c42a1d9c90bdc2c23a37fca06158f75749871c25bdd80cb'

    const tx = await mc.requestNbConfirmations(eBtcAddress, transactionHash)

    callback(tx.tx)
  } catch (e) {
    console.log('Error : ', e)
  }
}
