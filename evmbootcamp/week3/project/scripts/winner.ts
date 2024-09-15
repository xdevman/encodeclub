import { createPublicClient, http,createWalletClient,formatEther,Address,toHex,hexToString} from "viem";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {privateKeyToAccount} from "viem/accounts"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";

async function main() {

  const params = process.argv.slice(1);
  
  const BallotContractAddress = params[0] as Address;
  if (!BallotContractAddress) throw new Error ("please check your Ballot Contract address");
  console.log(BallotContractAddress)
  // Create PublicClient for sepolia network
    const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const winnerName = (await publicClient.readContract({
    address: BallotContractAddress,
    abi,
    functionName: "winnerName",
  })) as `0x${string}`;
  console.log(`\nWinner: ${hexToString(winnerName, { size: 32 })}`);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  