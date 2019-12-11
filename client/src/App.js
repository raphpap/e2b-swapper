import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Button, Typography, Grid, TextField } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

import MyContract from "./contracts/MyContract.json";
import getWeb3 from "./utils/getWeb3";

import { theme } from "./utils/theme";
import Header from "./components/Header";
import SwapContractReader from "./components/SwapContractReader";
import UserActionList from "./components/UserActionList";
import CreateForm from "./components/CreateForm";
import CancelForm from "./components/CancelForm";
import AcceptForm from "./components/AcceptForm";
import FullfillForm from "./components/FullfillForm";
import PlaceholderMessage from "./components/PlaceholderMessage";
import "./App.css";

const GAS = 500000;
const GAS_PRICE = "20000000000";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    randomLow: 1,
    randomHigh: 6,
    resultReceived: false,
    result: "0",
    exists: false,
    offeredEth: null,
    requestedBtc: null,
    requestedEthCollateral: null,
    endsAt: null,
    eEthAddress: null,
    eBtcAddress: 'mYbTcAdDrEsSee',
    bEthAddress: null,
    transactionHash: null,
    nbConfirmations: null,
    voutAddress: null,
    voutValue: null
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const networkId = await web3.eth.net.getId();
      if (networkId !== 3) {
        throw new Error("Select the Ropsten network from your MetaMask plugin");
      }
      const deployedNetwork = MyContract.networks[networkId];
      const contract = new web3.eth.Contract(
        MyContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract });

      window.ethereum.on("accountsChanged", async accounts => {
        const newAccounts = await web3.eth.getAccounts();
        this.setState({ accounts: newAccounts });
      });

      // Refresh on-chain data every 1 second
      const component = this;
      async function loopRefresh() {
        await component.refreshState();
        setTimeout(loopRefresh, 1000);
      }
      loopRefresh();
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  refreshState = async () => {
    const swapContractInfo = await this.state.contract.methods
      .getSwapContract(this.state.eBtcAddress)
      .call();

    if (swapContractInfo[0]) {
      this.setState({
        exists: true,
        offeredEth: swapContractInfo[1].toString(),
        requestedBtc: swapContractInfo[2].toString(),
        requestedEthCollateral: swapContractInfo[3].toString(),
        endsAt: swapContractInfo[4].toString(),
        eEthAddress: swapContractInfo[5].toString(),
        bEthAddress: swapContractInfo[7].toString(),
        transactionHash: swapContractInfo[8].toString(),
        nbConfirmations: this.state.web3.utils.hexToAscii(swapContractInfo[9].toString()),
        voutAddress: this.state.web3.utils.hexToAscii(swapContractInfo[10].toString()),
        voutValue: this.state.web3.utils.hexToAscii(swapContractInfo[11].toString()),
      });
    } else {
      this.setState({
        exists: false,
        offeredEth: null,
        requestedBtc: null,
        requestedEthCollateral: null,
        endsAt: null,
        eEthAddress: null,
        bEthAddress: null,
        transactionHash: null,
        nbConfirmations: null,
        voutAddress: null,
        voutValue: null,
      });
    }
  };

  handleUpdateEBtcAddress = (value) => {
    this.setState({ eBtcAddress: value });
  };

  // handleRequestResult = async () => {
  //   await this.state.contract.methods
  //     .makeRequest(this.state.randomLow.toString(), this.state.randomHigh.toString())
  //     .send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
  // };
  //
  // handleResetResult = async () => {
  //   await this.state.contract.methods
  //     .resetResult()
  //     .send({ from: this.state.accounts[0], gas: GAS, gasPrice: GAS_PRICE });
  // };

  handleCreateContract = async ({offeredEth, requestedBtc, requestedEthCollateral}) => {
    const {web3, contract, accounts, eBtcAddress} = this.state;

    await contract.methods
      .initiateSwapContract(
        eBtcAddress.toString(),
        Number(requestedBtc).toFixed(8).toString(),
        web3.utils.toHex(web3.utils.toWei(requestedEthCollateral, 'ether').toString())
      )
      .send({
        from: accounts[0],
        value: web3.utils.toWei(offeredEth, 'ether'),
        gas: GAS,
        gasPrice: GAS_PRICE
      });
  }

  handleAcceptContract = async () => {
    const {web3, contract, accounts, eBtcAddress, requestedEthCollateral} = this.state;

    await contract.methods
      .acceptSwapContract(
        eBtcAddress.toString(),
      )
      .send({
        from: accounts[0],
        value: requestedEthCollateral,
        gas: GAS,
        gasPrice: GAS_PRICE
      });
  }

  handleFullfillContract = async ({transactionHash}) => {
    const {contract, accounts, eBtcAddress} = this.state;

    await contract.methods
      .satisfySwapContract(
        eBtcAddress.toString(),
        transactionHash.toString()
      )
      .send({
        from: accounts[0],
        gas: GAS,
        gasPrice: GAS_PRICE
      });
  }

  render() {
    if (!this.state.web3) {
      return (
        <ThemeProvider theme={theme}>
          <div className="App">
            <Router>
              <Header />
            </Router>

            <Typography>Loading Web3, accounts, and contract...</Typography>
          </div>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Header />

            <Grid container direction="row">
              <Grid container item xs={12} md={4}>
                <SwapContractReader
                  onChange={(value) => this.handleUpdateEBtcAddress(value)}
                  {...this.state}
                />
              </Grid>

              <Grid container item xs={12} md={8}>
                  <UserActionList />

                  <Switch>
                    <Route path="/create">
                      <CreateForm
                        onChange={(value) => this.handleUpdateEBtcAddress(value)}
                        handleCreateContract={this.handleCreateContract}
                        exists={this.state.exists}
                        eBtcAddress={this.state.eBtcAddress}
                      />
                    </Route>
                    <Route path="/cancel">
                      <CancelForm />
                    </Route>
                    <Route path="/accept">
                      <AcceptForm
                        onChange={(value) => this.handleUpdateEBtcAddress(value)}
                        handleAcceptContract={this.handleAcceptContract}
                        exists={this.state.exists}
                        eBtcAddress={this.state.eBtcAddress}
                        requestedEthCollateral={this.state.requestedEthCollateral}
                        web3={this.state.web3}
                      />
                    </Route>
                    <Route path="/fullfill">
                      <FullfillForm
                        onChange={(value) => this.handleUpdateEBtcAddress(value)}
                        handleFullfillContract={this.handleFullfillContract}
                        exists={this.state.exists}
                        eBtcAddress={this.state.eBtcAddress}
                        bEthAddress={this.state.bEthAddress}
                      />
                    </Route>
                    <Route path="/">
                      <PlaceholderMessage
                        eBtcAddress={this.state.eBtcAddress}
                      />
                    </Route>
                  </Switch>
              </Grid>
            </Grid>
          </Router>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
