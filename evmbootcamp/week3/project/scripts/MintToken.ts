import { createPublicClient, http,createWalletClient,formatEther,Address,toHex ,parseEther} from "viem";
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
  const minteraddr = params[1] as Address;
  if (!minteraddr) throw new Error ("please check your minter address");
  if (!/^0x[a-fA-F0-9]{40}$/.test(minteraddr))
    throw new Error("Invalid Minter Address");

  const tokenamount = params[2];
  if (isNaN(Number(tokenamount))) throw new Error("Please check amount value");
  

  console.log("Mint ",tokenamount,"Token.","Address: ",minteraddr);

  // Create PublicClient for sepolia network
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);
  
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const minters = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });

  const hash = await minters.writeContract({
    address: MyTokenContractAddress,
    abi,
    functionName:"mint",
    args: [minteraddr, BigInt(tokenamount)],
  });

  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed. ",receipt.status);
  console.log("MINT amount:", tokenamount)
  const balanceBN = (await publicClient.readContract({address:MyTokenContractAddress,abi,functionName:"balanceOf",args:[minteraddr],})) as any[];
    console.log(
      `Account ${
        minteraddr
      } has ${balanceBN.toString()} decimal units of MyToken\n`
    );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

