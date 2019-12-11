# LinkSwap

## Description
LinkSwap is the first step towards a truly trustless way to trade Ethereum with Bitcoin.

The contract is currently deployed [here on Ropsten](https://ropsten.etherscan.io/address/0x3f458ebe40f6fa1bc8546884dfb82b6becb2546d), and uses data from [the BTC Tesnet](https://live.blockcypher.com/btc-testnet).

## How this works

###### Alice creates a contract by entering:
- A never used before BTC address
- The number of offered ETH
- The requested amount of BTC
- A possible ETH collateral (to avoid Bob from freezing her funds without consequences)

###### Anyone can read the contract information if they know the BTC address

###### Bob can accept a contract by sending the right aount of ETH as a collateral
- Coincidently, his ETH adress is the only one who can receive Alice's ETH if Alice receives her requested BTC
- Bob should then read the contract to validate that he "got the spot"
- Bob now has 4 hours to proceed to the BTC payment to Alice

###### On the BTC chain, Bob proceeds to send AS A SINGLE TRANSACTION the EXACT AMOUNT of requested BTC to Alice
- Bob must take note of the transaction hash (id) and wait for at least 6 confirmations

###### On the platform, Bob then fullfills the contract by inputing the transaction hash

###### Honeycomb's Oracle then uses Tatum's API to fetch the following information:
- Nb. confirmations (must be > 6)
- voutAddress (must be equal to Alice's BTC address)
- voutValue (must be equal to Alice's requested BTC amount)
- If all is good, Bob receives his collateral back along with Alice's ETH

###### Alice can cancel her contract if either of the following is true:
- The contract hasn't been accepted yet
  - Alice receives her balance back
- The contract has been accepted but more than 4 hours has passed withouth fullfillment
  - Alice receives her balance back along with the ETH collateral
- Once cancelled, the Contract's information cannot be read anymore

## Technical limitations

The contract's functions are currently quite costly to call, especially the `fullfillment call` due to value type conversions.

The BTC adress is currently trimmed down to 32 characters (during the `expected` vs `result obained via oracle` only) due to a current technical limitation with Chainlink oracles. This is quite bad for the BTC Testnet since addresses are very long (40 chars). On BTC mainnet, addresses are often 26-34 char so this limitation could be worked-around.

Currently, 3 different calls are made to the Honeycomb Oracle to fetch all three needed informations for validation. A single call would be better.

# Local development

## Before installation

- Sign up to the [Honeycomb marketplace](https://honeycomb.marketplace) to access the job listings

- Install [npm](https://www.npmjs.com/get-npm)

- Install truffle globally using:

`npm install -g truffle`

- Install the Metamask add-on to your browser and create a wallet.
Note down the mnemonics.
Fund it with [Ropsten ETH](https://faucet.metamask.io/) and [Ropsten LINK](https://ropsten.chain.link/).

- Create an [Infura](https://infura.io/) account, get an endpoint URL for the Ropsten testnet and note it down.

- Install [nv](https://github.com/jcouture/nv) to load the environment variables

- (Optional) Install [Visual Studio Code](https://code.visualstudio.com/)

## Installation

- Clone this repo

- Install the dependencies:

`npm install`

- Create the file that you are going to enter your environment variables:

`cp .env.example .env`

- Open the newly created `.env` file and enter RPC_URL and PRIVATE_KEYS you noted earlier.

- Deploy the contract (Ropsten LINK will be transferred from your wallet to the contract automatically during deployment)

`nv .env npm run migrate:live`

## Helper Scripts

```bash
Fund the Deployed Contract

nv .env npm run script-1
```

```bash
(User 1) - Create a Swap Contract

nv .env npm run script-2
```

```bash
(Anyone) - Read a Swap Contract

nv .env npm run script-3
```

```bash
(User 2) - Accept a Swap Contract

nv .env npm run script-4
```

```bash
(User 2) - Fulfill a Swap Contract

nv .env npm run script-5
```

```bash
(User 2) - Request nbConfirmations

nv .env npm run script-5.1
```

```bash
(User 2) - Request voutAddress

nv .env npm run script-5.2
```

```bash
(User 2) - Request voutValue

nv .env npm run script-5.3
```

```bash
(User 1) - Cancel a Swap Contract

nv .env npm run script-6
```

## Running the Client

Simply go into the `client` folder and follow the instructions
