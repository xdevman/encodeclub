import { createPublicClient, http,createWalletClient,formatEther,Address,toHex } from "viem";
import { sepolia } from "viem/chains";
import { abi, bytecode } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import {privateKeyToAccount} from "viem/accounts"
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const params = process.argv.slice(2);
  if (!params || params.length < 1)
    throw new Error("input value not provided");
  
  const MyTokenContractAddress = params[0] as Address;
  if (!MyTokenContractAddress) throw new Error ("please check your Token Contract address");
  if (!/^0x[a-fA-F0-9]{40}$/.test(MyTokenContractAddress))
    throw new Error("Invalid Token Contract Address");
  const Delegateaddr = params[1] as Address;
  if (!Delegateaddr) throw new Error ("please check your Delegate address");
  if (!/^0x[a-fA-F0-9]{40}$/.test(Delegateaddr))
    throw new Error("Invalid Delegate Address");

// Create PublicClient for sepolia network
    const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });

  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  // TODO : self delegate address

  console.log("Delegate addr: ", Delegateaddr);

  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const delegators = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });

  const hash = await delegators.writeContract({
    address: MyTokenContractAddress,
    abi,
    functionName:"delegate",
    args: [Delegateaddr],
  });


  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed.",receipt.status);


}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });