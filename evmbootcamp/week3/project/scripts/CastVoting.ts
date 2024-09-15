import { createPublicClient, http,createWalletClient,formatEther,Address,toHex, hexToString } from "viem";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {privateKeyToAccount} from "viem/accounts"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main(){

    const params = process.argv.slice(2);
    if (!params || params.length < 1)
      throw new Error("input value not provided");
    
    const BallotContractAddress = params[0] as Address;
    if (!BallotContractAddress) throw new Error ("please check your Ballot Contract address");
    if (!/^0x[a-fA-F0-9]{40}$/.test(BallotContractAddress))
      throw new Error("Invalid Ballot Contract Address");
    
    const proposalIndex = params[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");

    const tokenamount = params[2];
    if (isNaN(Number(tokenamount))) throw new Error("Please check amount value");
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
      });
  
  console.log("Proposal selected: ");
  const proposal = (await publicClient.readContract({
          address: BallotContractAddress,
          abi,
          functionName: "proposals",
          args: [BigInt(proposalIndex)],
        })) as any[];
  const name = hexToString(proposal[0], { size: 32 });
  console.log("Voting to proposal", name, "Vote Count: ",tokenamount);
  console.log("Confirm? (Y/n)");
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  process.stdin.on("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await voter.writeContract({
        address: BallotContractAddress,
        abi,
        functionName: "vote",
        args: [proposalIndex, tokenamount],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed");
      console.log("Account:", voter.account.address,"with",tokenamount,"voterpower, voted to:",name);
    } else {
      console.log("Operation cancelled");
    }
  });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });