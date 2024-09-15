# Weekend Project 3 Report




## 1. Deploying MyToken Contract

- **Command:**
  ```bash
  npx ts-node --files ./scripts/DeployMyToken.ts
 - output 
 ```bash 
Last block number: 6693044
Deployer address: 0x71242d428244A64A725A42445A7497B686fdbD84
Deployer balance: 0.099925588992131222 ETH

Deploying Token contract
Transaction hash: 0xf68574c2cc293ad05c1a494e31617e533068cab0fa522d9c10f329de1ea135c7
Waiting for confirmations...
Token contract deployed to: 0xe3c023e9b3f9e6b7e6886ffe904e42a098a68624
```
 - Status: Success

## 2. Minting Tokens
- **Command:**
  ```bash
  npx ts-node --files ./scripts/MintToken.ts 0xe3c023e9b3f9e6b7e6886ffe904e42a098a68624 0x71242d428244A64A725A42445A7497B686fdbD84 100
  ```
- **output:**
```bash 
Transaction hash: 0x52886f72b9c40431b3afb9856801d27a1660fc50b975d7f42e67939fe1fc0f2e
Waiting for confirmations...
Transaction confirmed: success
Block: 6693053
```
- status : **success**

## 3. Delegating Votes
- **Command:**
  ```bash
  npx ts-node --files ./scripts/SelfDelegate.ts 0xe3c023e9b3f9e6b7e6886ffe904e42a098a68624 0x71242d428244A64A725A42445A7497B686fdbD84
  ```
- output:
  ```terminal
  Transaction hash: 0xbe8e9ca84d9c3e62a84a06902ae29f05cbd777faa09fadc915764a84b5b24e75 
  Waiting for confirmations...
  Transaction confirmed: success
  Current Block: 6693057
  ```
- status: success
## 4. Deploying TokenizedBallot Contract
- **Command:**
  ```bash
  npx ts-node --files ./scripts/DeployBallotContract.ts 0xe3c023e9b3f9e6b7e6886ffe904e42a098a68624 6693057 "X" "telegram" "whatsapp"
  ```
- output:
  ```bash
  Last block number: 6693061
  Deployer address: 0x71242d428244A64A725A42445A7497B686fdbD84
  Deployer balance: 0.099488734638597072 ETH
  Deploying Ballot contract
  Transaction hash:
  0x33e61fd432b2e9d9ff33a1daf760936fa7ed63b29edad34700fa08b1a96ddc44
  Waiting for confirmations...
  Ballot contract deployed to: 0xd0669521f0b47314044fa356ed01663248690f7a
  ```
- status: Success 
 ## 5. Casting a Vote
 - **command:**
  ```bash 
  npx ts-node --files ./scripts/CastVoting.ts 0xd0669521f0b47314044fa356ed01663248690f7a 1 10
  ```
- output: 
 ```bash
 Transaction hash:
 0x885e7889f583c28bb121049eb98e7a54df2f49aa35b9e2901a004d1b4ff179cd
 Waiting for confirmations...
 Transaction confirmed: success
 ```
