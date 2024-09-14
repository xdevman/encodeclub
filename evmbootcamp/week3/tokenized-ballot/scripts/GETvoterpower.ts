import { createPublicClient, http,createWalletClient,formatEther,Address,toHex } from "viem";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {privateKeyToAccount} from "viem/accounts"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";

async function main() {

  const params = process.argv.slice(2);
  if (!params || params.length < 1)
    throw new Error("input value not provided");
  
  const BallotContractAddress = params[0] as Address;
  if (!BallotContractAddress) throw new Error ("please check your Ballot Contract address");
  if (!/^0x[a-fA-F0-9]{40}$/.test(BallotContractAddress))
    throw new Error("Invalid Ballot Contract Address");
  const voteraddr = params[1] as Address;
  if (!voteraddr) throw new Error ("please check your minter address");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voteraddr))
    throw new Error("Invalid Minter Address");
// Create PublicClient for sepolia network
const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  
  // Get voter power 
  const votepower_ = await publicClient.readContract({address:BallotContractAddress,abi,functionName:"getVotePower",args:[voteraddr],});
    console.log(`VOTERPOWER : Account ${voteraddr} ---> ${votepower_}`);
  
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  
  