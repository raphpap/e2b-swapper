pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract MyContract is ChainlinkClient{
  uint256 private oraclePaymentAmount;
  bytes32 private jobId;

  struct SwapContract {
    // Contract information
    bool exists;
    uint offeredEth;
    string requestedBtc;
    uint256 endAt;

    // Ethereum giver information
    address eEthAddress;
    string eBtcAddress;

    // Bitcoin giver information
    address bEthAddress;
  }

  mapping (string => SwapContract) swapContracts;

  // Accessor to a single user
  function getSwapContract(string eBtcAddress) public view returns(bool, uint256, string, uint256, address, string, address) {
    SwapContract storage sc = swapContracts[eBtcAddress];
    return (
      sc.exists,
      sc.offeredEth,
      sc.requestedBtc,
      sc.endAt,
      sc.eEthAddress,
      sc.eBtcAddress,
      sc.bEthAddress
    );
  }

  // Instantiate a swap contract
  function createSwapContract(
    uint offeredEth,
    string requestedBtc,
    address eEthAddress,
    string eBtcAddress
  ) private {
    swapContracts[eBtcAddress].exists = true;
    swapContracts[eBtcAddress].offeredEth = offeredEth;
    swapContracts[eBtcAddress].requestedBtc = requestedBtc;
    swapContracts[eBtcAddress].eEthAddress = eEthAddress;
    swapContracts[eBtcAddress].eBtcAddress = eBtcAddress;
  }

  constructor(
    address _link,
    address _oracle,
    bytes32 _jobId,
    uint256 _oraclePaymentAmount
  ) public {
      setChainlinkToken(_link);
      setChainlinkOracle(_oracle);
      jobId = _jobId;
      oraclePaymentAmount = _oraclePaymentAmount;
  }

  function initiateSwapContract(
      string _eBtcAddress,
      string _requestedBtc
  ) public payable {
    require(swapContracts[_eBtcAddress].exists == false);
    require(msg.value > 0);

    createSwapContract(
      msg.value,
      _requestedBtc,
      msg.sender,
      _eBtcAddress
    );
  }
}
