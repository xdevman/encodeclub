import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Telegram", "X", "Whatsapp"];

async function deployContract() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2, account3, account4] = await viem.getWalletClients();
    const ballotContract = await viem.deployContract("Ballot", [PROPOSALS.map((prop) => toHex(prop, { size: 32 }))]);
    return { publicClient, deployer, account1, account2, account3, account4, ballotContract };
}

describe("Ballot", async () => {
    describe("when the contract is deployed", async () => {
        it("has the provided proposals", async () => {
            const { ballotContract } = await loadFixture(deployContract);
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.read.proposals([BigInt(index)]);
                expect(hexToString(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
            }
        });

        it("has zero votes for all proposals", async () => {
            const { ballotContract } = await loadFixture(deployContract);
            for (let index = 0; index < PROPOSALS.length; index++) {
                const proposal = await ballotContract.read.proposals([BigInt(index)]);
                expect(proposal[1]).to.eq(0n);
            }
        });

        it("sets the deployer address as chairperson", async () => {
            const { ballotContract, deployer } = await loadFixture(deployContract);
            const chairperson = await ballotContract.read.chairperson();
            expect(chairperson.toLowerCase()).to.equal(deployer.account.address);
        });

        it("sets the voting weight for the chairperson as 1", async () => {
            const { ballotContract, deployer } = await loadFixture(deployContract);
            const chairpersonVoter = await ballotContract.read.voters([deployer.account.address]);
            expect(chairpersonVoter[0]).to.eq(1n);
        });
    });

    describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
        it("gives right to vote for another address", async () => {
            const { ballotContract, account1 } = await loadFixture(deployContract);
            await ballotContract.write.giveRightToVote([account1.account.address]);
            const account1Voter = await ballotContract.read.voters([account1.account.address]);
            expect(account1Voter[0]).to.eq(1n);
        });

        it("cannot give right to vote for someone that has voted", async () => {
            const { ballotContract, account1 } = await loadFixture(deployContract);
            await ballotContract.write.giveRightToVote([account1.account.address]);
            const ballotContractAsAccount1 = await viem.getContractAt(
                "Ballot",
                ballotContract.address,
                { client: { wallet: account1 } }
            );
            await ballotContractAsAccount1.write.vote([BigInt(0)]);
            await expect(
                ballotContract.write.giveRightToVote([account1.account.address])
            ).to.be.rejectedWith("The voter already voted.");
        });

        it("cannot give right to vote for someone that already has voting rights", async () => {
            const { ballotContract, account1 } = await loadFixture(deployContract);
            await ballotContract.write.giveRightToVote([account1.account.address]);
            await expect(
                ballotContract.write.giveRightToVote([account1.account.address])
            ).to.be.rejectedWith("Voter already has right to vote.");
        });
    });

    describe("when the voter interacts with the vote function in the contract", async () => {
        it("should register the vote", async () => {
            const { ballotContract, deployer } = await loadFixture(deployContract);
            await ballotContract.write.vote([BigInt(0)]);
            const chairpersonVoter = await ballotContract.read.voters([deployer.account.address]);
            const proposal0 = await ballotContract.read.proposals([BigInt(0)]);
            expect(chairpersonVoter[1]).to.eq(true);
            expect(proposal0[1]).to.eq(chairpersonVoter[0]);
        });
    });

    describe("when the voter interacts with the delegate function in the contract", async () => {
        it("should transfer voting power", async () => {
            const { ballotContract, deployer, account1 } = await loadFixture(deployContract);
            await ballotContract.write.giveRightToVote([account1.account.address]);
            await ballotContract.write.delegate([account1.account.address]);
            const chairpersonVoter = await ballotContract.read.voters([deployer.account.address]);
            const account1Voter = await ballotContract.read.voters([account1.account.address]);
            expect(chairpersonVoter[1]).to.eq(true);
            expect(account1Voter[0]).to.eq(2n);
        });

        it("should revert when delegating to oneself", async () => {
            const { ballotContract, deployer } = await loadFixture(deployContract);
            await expect(
                ballotContract.write.delegate([deployer.account.address])
            ).to.be.rejectedWith("Self-delegation is disallowed.");
        });

        it("should revert when delegating without the right to vote", async () => {
            const { ballotContract, account1 } = await loadFixture(deployContract);
            await expect(
                ballotContract.write.delegate([account1.account.address])
            ).to.be.rejectedWith("You have no right to vote.");
        });
    });

    describe("when an account without right to vote interacts with the vote function in the contract", async () => {
        it("should revert", async () => {
            const { ballotContract, account1 } = await loadFixture(deployContract);
            await expect(
                ballotContract.write.vote([BigInt(0)])
            ).to.be.rejectedWith("Has no right to vote.");
        });
    });

    describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
        it("should return 0", async () => {
            const { ballotContract } = await loadFixture(deployContract);
            const winningProposal = await ballotContract.read.winningProposal();
            expect(winningProposal).to.eq(0n);
        });
    });

    describe("when someone interacts with the winnerName function before any votes are cast", async () => {
        it("should return name of proposal 0", async () => {
            const { ballotContract } = await loadFixture(deployContract);
            const winnerName = await ballotContract.read.winnerName();
            expect(hexToString(winnerName, { size: 32 })).to.eq(PROPOSALS[0]);
        });
    });

    describe("when someone interacts with the winnerName function after votes are cast", async () => {
        it("should return the name of the winning proposal", async () => {
            const { ballotContract, account1, account2, account3, account4 } = await loadFixture(deployContract);

            // Vote and delegate the votes
            await ballotContract.write.vote([BigInt(0)]);
            await ballotContract.write.giveRightToVote([account1.account.address]);
            await ballotContract.write.giveRightToVote([account2.account.address]);
            await ballotContract.write.giveRightToVote([account3.account.address]);
            await ballotContract.write.giveRightToVote([account4.account.address]);

            const ballotContractAsAccount1 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: account1 } });
            const ballotContractAsAccount2 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: account2 } });
            const ballotContractAsAccount3 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: account3 } });
            const ballotContractAsAccount4 = await viem.getContractAt("Ballot", ballotContract.address, { client: { wallet: account4 } });

            await ballotContractAsAccount1.write.vote([BigInt(1)]);
            await ballotContractAsAccount2.write.vote([BigInt(2)]);
            await ballotContractAsAccount3.write.vote([BigInt(2)]);
            await ballotContractAsAccount4.write.vote([BigInt(2)]);

            const winnerProposal = await ballotContract.read.winningProposal();
            expect(winnerProposal).to.eq(2n);
            const winnerName = await ballotContract.read.winnerName();
            expect(hexToString(winnerName, { size: 32 })).to.eq(PROPOSALS[2]);
        });
    });
});
