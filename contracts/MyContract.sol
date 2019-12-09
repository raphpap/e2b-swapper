pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";

contract MyContract is ChainlinkClient{
  uint256 private oraclePaymentAmount;
  bytes32 private jobId;

  struct SwapContract {
    // Contract information
    bool exists;
    uint256 offeredEth;
    string requestedBtc;
    uint256 requestedEthCollateral;
    uint256 endsAt;

    // Ethereum giver information
    address eEthAddress;
    string eBtcAddress;

    // Bitcoin giver information
    address bEthAddress;
    uint256 bEthCollateral;
  }

  mapping (string => SwapContract) swapContracts;

  // Accessor to a single user
  function getSwapContract(string eBtcAddress) public view returns(bool, uint256, string, uint256, uint256, address, string, address, uint256) {
    SwapContract storage sc = swapContracts[eBtcAddress];
    return (
      sc.exists,
      sc.offeredEth,
      sc.requestedBtc,
      sc.requestedEthCollateral,
      sc.endsAt,
      sc.eEthAddress,
      sc.eBtcAddress,
      sc.bEthAddress,
      sc.bEthCollateral
    );
  }

  // Instantiate a swap contract
  function createSwapContract(
    uint256 _offeredEth,
    string _requestedBtc,
    uint256 _requestedEthCollateral,
    address _eEthAddress,
    string _eBtcAddress
  ) private {
    swapContracts[_eBtcAddress].exists = true;
    swapContracts[_eBtcAddress].offeredEth = _offeredEth;
    swapContracts[_eBtcAddress].requestedBtc = _requestedBtc;
    swapContracts[_eBtcAddress].requestedEthCollateral = _requestedEthCollateral;
    swapContracts[_eBtcAddress].eEthAddress = _eEthAddress;
    swapContracts[_eBtcAddress].eBtcAddress = _eBtcAddress;
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
      string _requestedBtc,
      uint256 _requestedEthCollateral
  ) public payable {
    require(swapContracts[_eBtcAddress].exists == false);
    require(msg.value > 0);

    createSwapContract(
      msg.value,
      _requestedBtc,
      _requestedEthCollateral,
      msg.sender,
      _eBtcAddress
    );
  }

  function acceptSwapContract(
    string _eBtcAddress
  ) public payable {
    // ID exists
    require(swapContracts[_eBtcAddress].exists == true);
    // Hasn't been registered to before
    require(swapContracts[_eBtcAddress].bEthAddress == 0);
    // Has the correct amount of collateral
    require(swapContracts[_eBtcAddress].requestedEthCollateral == msg.value);

    swapContracts[_eBtcAddress].bEthAddress = msg.sender;
    swapContracts[_eBtcAddress].endsAt = block.timestamp.add(4 hours);
  }
}
