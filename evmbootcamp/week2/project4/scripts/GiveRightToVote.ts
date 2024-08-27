import { createPublicClient, http, createWalletClient,Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as Address;

  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");

  const voter_wallet = parameters[1] as Address;
  if (!voter_wallet) throw new Error("Voter not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voter_wallet))
    throw new Error("Invalid Voter");

  console.log("Give Right To Vote To: ", parameters[1] as Address);
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const hash = await deployer.writeContract({
    address: contractAddress,
    abi,
    functionName: "giveRightToVote",
    args: [voter_wallet],
  });

  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Transaction confirmed. wallet address ${voter_wallet}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});