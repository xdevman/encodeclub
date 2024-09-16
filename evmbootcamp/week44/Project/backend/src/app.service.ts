import { Get, Injectable } from '@nestjs/common';
import * as tokenJson from "./assets/MyToken.json";
import * as BallotJson from "./assets/TokenizedBallot.json";
import {createPublicClient,http,Address, formatEther, createWalletClient, parseEther} from "viem";
import {sepolia} from "viem/chains";
import { privateKeyToAccount } from 'viem/accounts';
import * as dotenv from "dotenv";
import { MintTokenDto } from './dtos/mintToken.dto';
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY || "";

@Injectable()
export class AppService {
 
    publicClient;
    walletClient;
    constructor() {
      this.publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.RPC_ENDPOINT_URL),
      });
      const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
      this.walletClient = createWalletClient({
        transport: http(process.env.RPC_ENDPOINT_URL),
        chain: sepolia,
        account: account,
      });
    }

  getHello(): string {
    return 'Hello World!';
  }
  
  getContractAddress(): Address {
    return process.env.TOKEN_ADDRESS as Address;
  }

  async getTokenName(): Promise<string> {
    
    const name = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "name"
    });
    return name as string;
  }
  async getTotalSupply() {
    const totalSupplyBN = await this.publicClient.readContract({
    address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: "totalSupply"
    });
    const totalSupply = formatEther(totalSupplyBN as bigint);
    return totalSupply;
  }

  async getTransactionReceipt(hash: string) {
  const totalSupplyBN = await this.publicClient.readContract({
      address: this.getContractAddress(),
        abi: tokenJson.abi,
        functionName: "totalSupply"
      });
      const totalSupply = formatEther(totalSupplyBN as bigint);
      return totalSupply;
  
  }
  
  async waitForTransactionSuccess(TxHash: any) {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash: TxHash,
    });

    if (!receipt || receipt.status !== 'success') {
      throw new Error(`Transaction Error. Hash: ${TxHash}`);
    }

    return receipt;
  }
  async getTokenBalance(address: string): Promise<string> {
    const getbalance = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: tokenJson.abi,
      functionName: 'balanceOf',
      args: [address],
    });
    return formatEther(getbalance as bigint);
  }
  async mintTokens(body: MintTokenDto) {
    const address = body.address;
    const amount = body.amount;
    
      const mintTx = await this.walletClient.writeContract({
        address: this.getContractAddress(),
        abi: tokenJson.abi,
        functionName: 'mint',
        args: [address, parseEther(`${amount}`)],
      });

      if (await this.waitForTransactionSuccess(mintTx)) {
        console.log(`Mint ${amount} tokens to ${address}`);
        return {
          result: true,
          message: `Minted ${amount} tokens to ${address}`,
          transactionHash: mintTx,
        };
      } else {
        return {
          result: false,
          message: `Error: something Wrong to mint token check log for debug. Minter_Address: ${address}`,
          transactionHash: mintTx,
        };
      }
    } 

  async checkMinterRole(address: string): Promise<boolean> {
    const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";
    // const MINTER_ROLE =  await this.publicClient.readContract({
    //   address: this.getContractAddress(),
    //   abi: tokenJson.abi,
    //   functionName: 'MINTER_ROLE'
    // });
    const hasRole = await this.publicClient.readContract({
      address: this.getContractAddress(),
      abi: tokenJson.abi,
      functionName: 'hasRole',
      args: [MINTER_ROLE, address],
    });
    return hasRole;
  }
  
  getServerWalletAddress(): string {
    return this.walletClient.account.address;
  }

  async getProposals(proposal: string): Promise<number> {
    const ProposalsBN = await this.publicClient.readContract({
      address: this.getBallotAddress(),
      abi: BallotJson.abi,
      functionName: 'proposals',
      args: [proposal],
    });
    console.log("ProposalsBN: ", ProposalsBN)
    const secondElement = ProposalsBN[1];
    console.log("secondElement: ", secondElement)

    const proposalsBN_ = formatEther(secondElement as bigint); 

    const result_proposals = Number(proposalsBN_);
    return result_proposals * 1000000000000000000;
  }
  getBallotAddress(): Address {
    return process.env.BALLOT_ADDRESS as Address;
  }

  async Getwinner(): Promise<number>{
    
    const winningProposalBN = await this.publicClient.readContract({
      address: this.getBallotAddress(),
      abi: BallotJson.abi,
      functionName: 'winningProposal',
    });
    // console.log("winningProposalBN: ",winningProposalBN)

    const winningProposal_= formatEther(winningProposalBN as bigint);
    // console.log("winningProposal_: ",winningProposal_)
    const winningProposal = Number(winningProposal_);
    return winningProposal * 1000000000000000000; 
  }
 
}



