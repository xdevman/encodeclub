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


  const Delegate_wallet = parameters[1] as Address;
  if (!Delegate_wallet) throw new Error("Delegate address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(Delegate_wallet))
    throw new Error("Invalid Delegate Address");

  const account = parameters[2] as Address;
  if (!account) throw new Error("Owner Delegate address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(account))
    throw new Error("Invalid Owner Delegate Address");


//   const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const delegator = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
  });
  console.log(`delegate address to ${Delegate_wallet} Confirm? (Y/n)`);
  process.stdin.on("data", async function (d) {
    
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await delegator.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [Delegate_wallet],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed");
    } else {
      console.log("Operation cancelled");
    }

  });
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });