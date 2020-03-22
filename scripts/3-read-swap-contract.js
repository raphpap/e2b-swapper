const MyContract = artifacts.require('MyContract')

/*
  This script makes it easy to read a swapContract's info.
*/

module.exports = async callback => {
  const eBtcAddress = 'tb1qvy2t47rgwmkj73ayp92pmfj4wtww7l23hcudu3'

  const mc = await MyContract.deployed()
  const swapContractInfo = await mc.getSwapContract.call(eBtcAddress)

  console.log('Reading the info of a swap contract')
  console.log('====================================')
  console.log('ETH giver Btc address       : ', eBtcAddress)

  if (swapContractInfo[0]) {
    console.log('Exists                      : ', 'Yes')
    console.log(
      'Offered ETH                 : ',
      swapContractInfo[1].toString(),
    )
    console.log(
      'Requested BTC               : ',
      swapContractInfo[2].toString(),
    )
    console.log(
      'Requested ETH collateral    : ',
      swapContractInfo[3].toString(),
    )
    console.log(
      'Ends at                     : ',
      swapContractInfo[4].toString(),
    )
    console.log(
      'ETH giver Eth address       : ',
      swapContractInfo[5].toString(),
    )
    console.log(
      'BTC giver Eth address       : ',
      swapContractInfo[6].toString(),
    )
    console.log(
      'Fullfill transaction hash   : ',
      swapContractInfo[7].toString(),
    )
    console.log(
      'Transaction nbConfirmations : ',
      web3.utils.hexToAscii(swapContractInfo[8]),
    )
    console.log(
      'Transaction vout address    : ',
      web3.utils.hexToAscii(swapContractInfo[9]),
    )
    console.log(
      'Transaction vout value      : ',
      web3.utils.hexToAscii(swapContractInfo[10]),
    )
    console.log(
      'Exists                      : ',
      swapContractInfo[7] ? 'Yes' : 'No',
    )
  } else {
    console.log('Exists                     : ', 'No')
  }

  console.log('====================================')
  console.log('')

  callback(swapContractInfo)
}
