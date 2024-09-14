import { createPublicClient, http,createWalletClient,formatEther,Address,toHex } from "viem";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import {privateKeyToAccount} from "viem/accounts"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  
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
  console.log("\nDeploying Token contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as Address,
  });

  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("MyToken contract deployed to:", receipt.contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
