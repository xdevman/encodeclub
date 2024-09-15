import { createPublicClient, http,createWalletClient,formatEther,Address,toHex } from "viem";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import {privateKeyToAccount} from "viem/accounts"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {

  const params = process.argv.slice(2);
  console.log("paramslogs: ",params)
  if (!params || params.length < 1)
    throw new Error("input value not provided");
  
  const MyTokenContractAddress = params[0] as Address;
  if (!MyTokenContractAddress) throw new Error ("please check your Token Contract address");
  if (!/^0x[a-fA-F0-9]{40}$/.test(MyTokenContractAddress))
    throw new Error("Invalid Token Contract Address");
  
  const targetBlockNumber = params[1];
  if (isNaN(Number(targetBlockNumber))) throw new Error("Invalid target block number");

  const proposals = params.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");
  console.log(proposals)
  console.log(targetBlockNumber)
  console.log(MyTokenContractAddress)
  // Create PublicClient for sepolia network
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
  console.log("\nDeploying Ballot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as Address,
    args: [proposals.map((prop) => toHex(prop, { size: 32 })), MyTokenContractAddress,targetBlockNumber],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});