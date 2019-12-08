const MyContract = artifacts.require("MyContract");
const LinkTokenInterface = artifacts.require("LinkTokenInterface");
const LinkToken = artifacts.require('LinkToken')
const Oracle = artifacts.require('Oracle')

const linkTokenAddress = "0x20fE562d797A42Dcb3399062AE9546cd06f63280";
const oracle = "0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721";
const jobId = web3.utils.toHex("80bf65eaa2f64f629ee834b28b12d721");
const perCallLink = web3.utils.toWei("0.1");
const depositedLink = web3.utils.toWei("1");

module.exports = async (deployer, network) => {
  // Local (development) networks need their own deployment of the LINK
  // token and the Oracle contract
  if (!network.startsWith('live')) {
    deployer.deploy(LinkToken).then(() => {
      return deployer.deploy(Oracle, LinkToken.address).then(() => {
        return deployer.deploy(MyContract, LinkToken.address)
      })
    })
  } else {
    // For live networks, use the 0 address to allow the ChainlinkRegistry
    // contract automatically retrieve the correct address for you
    await deployer.deploy(
      MyContract,
      linkTokenAddress,
      oracle,
      jobId,
      perCallLink
    );
    const myContract = await MyContract.deployed();

    const linkToken = await LinkTokenInterface.at(linkTokenAddress);
    await linkToken.transfer(myContract.address, depositedLink);
  }
}
