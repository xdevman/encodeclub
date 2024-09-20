# LotteryHub Project Report

## Table of Contents
- [LotteryHub Project Report](#lotteryhub-project-report)
  - [Table of Contents](#table-of-contents)
  - [Run Project](#run-project)
  - [Compile Lottery Contract](#compile-lottery-contract)
  - [Contract Information](#contract-information)
  - [Website Pages](#website-pages)
    - [Home Page](#home-page)
    - [Deploy Contract](#deploy-contract)
    - [Close Bet](#close-bet)
    - [Place Bet Page](#place-bet-page)
    - [Open Bet Page](#open-bet-page)
    - [Claim Prize Page](#claim-prize-page)
    - [Owner Withdraw and Owner Pool Status](#owner-withdraw-and-owner-pool-status)

## Run Project

To run the project, follow these steps:

```bash
cd lotteryhub
yarn install
yarn start
```
## Compile Lottery Contract
Next, you need to compile the lottery contract. Navigate to the contract directory and run the following command:
```bash
cd packages/Lottery-contracts
npx hardhat compile
```
This will compile the smart contracts in the Lottery-contracts package.

## Contract Information

- **Contract Address**: `0x6b34d19a7c0c1947cdb16ec20ec973211e610c30`
- **Deployer Address**: `0x71242d428244A64A725A42445A7497B686fdbD84`

## Website Pages

Below are the main pages of the LotteryHub application:

### Home Page
- **Path**: `/home`
- **Description**: The main landing page of the application.

### Deploy Contract
- **Path**: `/setup`
- **Description**: Page for deploying the lottery contract.

### Close Bet
- **Path**: `/bet`
- **Description**: Page for closing bets on the lottery.

### Place Bet Page
- **Path**: `/bet`
- **Description**: Interface for users to place their bets.

### Open Bet Page
- **Path**: `/bet`
- **Description**: Page for opening a new betting round.

### Claim Prize Page
- **Path**: `/dashboard`
- **Description**: Page for users to claim their prizes and check their status.

### Owner Withdraw and Owner Pool Status
- **Path**: `/dashboard`
- **Description**: Section for the owner to withdraw funds and check pool status.
