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

    // Fullfillment
    string transactionHash;
    bytes32 nbConfirmations;
    bytes32 voutAddress;
    bytes32 voutValue;
  }

  // Mapping of requestId => eBtcAddress
  mapping (bytes32 => string) eBtcAddressForRequestId;

  // Mapping of eBtcAddress => swapContract
  mapping (string => SwapContract) swapContracts;


  // Accessor to a single user
  function getSwapContract(
    string eBtcAddress
  ) public view returns(
    bool,
    uint256,
    string,
    uint256,
    uint256,
    address,
    string,
    address,
    string,
    bytes32,
    bytes32,
    bytes32) {
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
      sc.transactionHash,
      sc.nbConfirmations,
      sc.voutAddress,
      sc.voutValue
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
  ) external payable {
    // id exists; hasn't been registered to before; has the correct amount of collateral
    require(swapContracts[_eBtcAddress].exists == true);
    require(swapContracts[_eBtcAddress].bEthAddress == 0);
    require(swapContracts[_eBtcAddress].requestedEthCollateral == msg.value);

    swapContracts[_eBtcAddress].bEthAddress = msg.sender;
    swapContracts[_eBtcAddress].endsAt = block.timestamp.add(4 hours);
  }

  function satisfySwapContract(
    string _eBtcAddress,
    string _transactionHash
  ) external {
    // id exists; has been registered to; before the endsAt
    require(swapContracts[_eBtcAddress].exists == true);
    require(swapContracts[_eBtcAddress].bEthAddress != address(0));
    /* require(swapContracts[_eBtcAddress].endsAt > block.timestamp); */

    swapContracts[_eBtcAddress].transactionHash = _transactionHash;

    bytes32 requestIdA = requestNbConfirmations(_eBtcAddress);
    bytes32 requestIdB = requestVoutAddress(_eBtcAddress);
    bytes32 requestIdC = requestVoutValue(_eBtcAddress);
  }

  function requestNbConfirmations(
    string _eBtcAddress
  ) private returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfillNbConfirmations.selector);
    req.add("hash", swapContracts[_eBtcAddress].transactionHash);
    req.add("encode", "true");
    req.add("copyPath", "confirmations");
    requestId = sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
    eBtcAddressForRequestId[requestId] = _eBtcAddress;
  }

  function fulfillNbConfirmations(
    bytes32 _requestId, bytes32 _result
  ) public recordChainlinkFulfillment(_requestId) {
    string storage eBtcAddress = eBtcAddressForRequestId[_requestId];
    swapContracts[eBtcAddress].nbConfirmations = _result;
  }

  function requestVoutAddress(
    string _eBtcAddress
  ) private returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfillVoutAddress.selector);
    req.add("hash", swapContracts[_eBtcAddress].transactionHash);
    req.add("encode", "true");
    req.add("copyPath", "vout.0.scriptPubKey.addresses.0");
    requestId = sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
    eBtcAddressForRequestId[requestId] = _eBtcAddress;
  }

  function fulfillVoutAddress(
    bytes32 _requestId, bytes32 _result
  ) public recordChainlinkFulfillment(_requestId) {
    string storage eBtcAddress = eBtcAddressForRequestId[_requestId];
    swapContracts[eBtcAddress].voutAddress = _result;
  }

  function requestVoutValue(
    string _eBtcAddress
  ) private returns (bytes32 requestId) {
    Chainlink.Request memory req = buildChainlinkRequest(jobId, this, this.fulfillVoutValue.selector);
    req.add("hash", swapContracts[_eBtcAddress].transactionHash);
    req.add("encode", "true");
    req.add("copyPath", "vout.0.value");
    requestId = sendChainlinkRequestTo(chainlinkOracleAddress(), req, oraclePaymentAmount);
    eBtcAddressForRequestId[requestId] = _eBtcAddress;
  }

  function fulfillVoutValue(
    bytes32 _requestId, bytes32 _result
  ) public recordChainlinkFulfillment(_requestId) {
    string storage eBtcAddress = eBtcAddressForRequestId[_requestId];
    swapContracts[eBtcAddress].voutValue = _result;
  }
}
