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

    // Bitcoin giver information
    address bEthAddress;

    // Fullfillment
    string transactionHash;
    bytes32 nbConfirmations;
    bytes32 voutAddress;
    bytes32 voutValue;

    // Result
    bool fullfilled;
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
    address,
    string,
    bytes32,
    bytes32,
    bytes32,
    bool
  ) {
    SwapContract storage sc = swapContracts[eBtcAddress];
    return (
      sc.exists,
      sc.offeredEth,
      sc.requestedBtc,
      sc.requestedEthCollateral,
      sc.endsAt,
      sc.eEthAddress,
      sc.bEthAddress,
      sc.transactionHash,
      sc.nbConfirmations,
      sc.voutAddress,
      sc.voutValue,
      sc.fullfilled
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
    swapContracts[_eBtcAddress].fullfilled = false;
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
    require(swapContracts[_eBtcAddress].eEthAddress == 0);
    require(msg.value > 0);

    createSwapContract(
      msg.value,
      _requestedBtc,
      _requestedEthCollateral,
      msg.sender,
      _eBtcAddress
    );
  }

  function cancelSwapContract(
    string _eBtcAddress
  ) public payable {
    require(swapContracts[_eBtcAddress].exists == true);
    require(swapContracts[_eBtcAddress].fullfilled == false);
    require(swapContracts[_eBtcAddress].eEthAddress == msg.sender);

    // If never got accepted, can withdraw own balance
    if (swapContracts[_eBtcAddress].bEthAddress == 0) {
      swapContracts[_eBtcAddress].eEthAddress.transfer(swapContracts[_eBtcAddress].offeredEth);
      swapContracts[_eBtcAddress].exists = false;
    // If accepted but endsAt is passed, can withdraw own balance and collateral
    } else if (block.timestamp > swapContracts[_eBtcAddress].endsAt) {
      swapContracts[_eBtcAddress].eEthAddress.transfer(swapContracts[_eBtcAddress].offeredEth + swapContracts[_eBtcAddress].requestedEthCollateral);
      swapContracts[_eBtcAddress].exists = false;
    }
  }

  function acceptSwapContract(
    string _eBtcAddress
  ) external payable {
    // id exists; hasn't been registered to before; has the correct amount of collateral
    require(swapContracts[_eBtcAddress].exists == true);
    require(swapContracts[_eBtcAddress].bEthAddress == 0);
    require(swapContracts[_eBtcAddress].requestedEthCollateral == msg.value);

    swapContracts[_eBtcAddress].bEthAddress = msg.sender;
    // After that time, contract creator is allowed to withdraw
    swapContracts[_eBtcAddress].endsAt = block.timestamp.add(4 hours);
  }

  function satisfySwapContract(
    string _eBtcAddress,
    string _transactionHash
  ) external {
    // id exists; has been registered to; before the endsAt
    require(swapContracts[_eBtcAddress].exists == true);
    require(swapContracts[_eBtcAddress].bEthAddress != address(0));
    require(swapContracts[_eBtcAddress].fullfilled == false);

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

    if (swapContracts[eBtcAddress].nbConfirmations != 0 && swapContracts[eBtcAddress].voutAddress != 0 && swapContracts[eBtcAddress].voutValue != 0) {
      tryToCompleteContract(eBtcAddress);
    }
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

    if (swapContracts[eBtcAddress].nbConfirmations != 0 && swapContracts[eBtcAddress].voutAddress != 0 && swapContracts[eBtcAddress].voutValue != 0) {
      tryToCompleteContract(eBtcAddress);
    }
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

    if (swapContracts[eBtcAddress].nbConfirmations != 0 && swapContracts[eBtcAddress].voutAddress != 0 && swapContracts[eBtcAddress].voutValue != 0) {
      tryToCompleteContract(eBtcAddress);
    }
  }

  function tryToCompleteContract(
    string _eBtcAddress
  ) private {
    if (
      uint256(swapContracts[_eBtcAddress].nbConfirmations) >= 6 &&
      stringToBytes32(_eBtcAddress) == swapContracts[_eBtcAddress].voutAddress &&
      stringToBytes32(swapContracts[_eBtcAddress].requestedBtc) == swapContracts[_eBtcAddress].voutValue &&
      swapContracts[_eBtcAddress].exists == true &&
      swapContracts[_eBtcAddress].fullfilled == false
    ) {
      // Contract is fullfilled and bEthAddress can receive the offered eth + his own collateral back
      swapContracts[_eBtcAddress].fullfilled = true;
      swapContracts[_eBtcAddress].bEthAddress.transfer(swapContracts[_eBtcAddress].offeredEth + swapContracts[_eBtcAddress].requestedEthCollateral);
    }
  }

  function stringToBytes32(
    string memory source
  ) private returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly {
      result := mload(add(source, 32))
    }
  }
}
