import { viem } from "hardhat";
const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
import { toHex, hexToString, formatEther } from "viem";

async function main() {
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
    // const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
    console.log("\nDeploying Ballot contract");
    const ballotContract = await viem.deployContract("Ballot", [
      PROPOSALS.map((prop) => toHex(prop, { size: 32 })),
    ]);
    console.log("Ballot contract deployed to:", ballotContract.address);
    console.log("Proposals: ");
    for (let index = 0; index < PROPOSALS.length; index++) {
      const proposal = await ballotContract.read.proposals([BigInt(index)]);
      const name = hexToString(proposal[0], { size: 32 });
      console.log({ index, name, proposal });
    } 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});