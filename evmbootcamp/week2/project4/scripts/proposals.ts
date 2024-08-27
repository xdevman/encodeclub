import { createPublicClient, http,hexToString} from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.INFURA_API_KEY || "";



function validateParameters(parameters: string[]) {
    console.log('parameters', parameters)
    if (!parameters || parameters.length < 2)
      throw new Error("Parameters not provided");
  
    const contractAddress = parameters[0] as `0x${string}`;
    console.log('contractAddress', contractAddress)
    if (!contractAddress) throw new Error("Contract address not provided");

    const proposal_number = Number(parameters[1]);
  
    return { contractAddress, proposal_number }
  }
  
  async function main() {
  
    const { contractAddress, proposal_number } = validateParameters(process.argv.slice(2));
  
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://sepolia.infura.io/v3/${providerApiKey}`),
    });
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number:", blockNumber);
  
    for (let proposallist = 0; proposallist < proposal_number; proposallist++) {
      const proposal = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "proposals",
        args: [BigInt(proposallist)],
      })) as any[];
      console.log(`[${proposallist}] ${hexToString(proposal[0], { size: 32 })}`)
    }
  
  }
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });