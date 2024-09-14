import { createPublicClient, http,createWalletClient,formatEther,Address,toHex,hexToString} from "viem";
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
  // Create PublicClient for sepolia network
    const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const winnerpropose = (await publicClient.readContract({address:BallotContractAddress,abi,functionName:"winningProposal"})) as any[];
  console.log(`Winner: ${hexToString(winnerpropose[0], { size: 32 })}`)
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  