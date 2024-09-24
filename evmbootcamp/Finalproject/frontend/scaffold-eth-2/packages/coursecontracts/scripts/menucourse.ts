import { viem } from "hardhat";
import { parseEther, formatEther, Address } from "viem";
import * as readline from "readline";
import { parse } from "path";

let contractAddress: Address;

async function main() {
  await initContract();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  mainMenu(rl);
}

async function getAccounts() {
  return await viem.getWalletClients();
}

async function getClient() {
  return await viem.getPublicClient();
}

async function initContract() {
  const contract = await viem.deployContract("CourseRegistration", []);
  contractAddress = contract.address;
  console.log(`Contract deployed at: ${contractAddress}\n`);
}

async function mainMenu(rl: readline.Interface) {
  menuOptions(rl);
}

function menuOptions(rl: readline.Interface) {
  rl.question(
    "Select operation: \n Options: \n [0]: Exit \n [1]: Create Course \n [2]: Register for Course \n [3]: Get Course Details \n",
    async (answer: string) => {
      console.log(`Selected: ${answer}\n`);
      const option = Number(answer);
      switch (option) {
        case 0:
          rl.close();
          return;
        case 1:
          rl.question("Enter course name:\n", async (name) => {
            rl.question("Enter course fee (in ETH):\n", async (fee) => {
                rl.question("Enter course maxParticipants:\n", async (details) => {
                    try {
                        // Ensure fee is converted to a BigInt or appropriate type
                        const parsedFee = parseEther(fee.trim());
                        await createCourse(name, parseEther(fee), details);
                    } catch (error) {
                        console.log("Error creating course\n", error);
                    }
                mainMenu(rl);
              });
            });
          });
          break;
        case 2:
          rl.question("Enter course ID:\n", async (courseId) => {
            rl.question("Enter your address:\n", async (userAddress) => {
              try {
                await registerForCourse(courseId, userAddress);
              } catch (error) {
                console.log("Error registering for course\n", error);
              }
              mainMenu(rl);
            });
          });
          break;
        case 3:
          rl.question("Enter course ID:\n", async (courseId) => {
            await getCourseDetails(courseId);
            mainMenu(rl);
          });
          break;
        default:
          console.log("Invalid option\n");
          mainMenu(rl);
      }
    }
  );
}

async function createCourse(name: string, fee: bigint, details: bigint) {
  // console.log('Name:', name);
  //   console.log('Fee:', fee);
  //   console.log('Details:', details);
  //   console.log('Details type:', typeof details);
  const contract = await viem.getContractAt("CourseRegistration", contractAddress);
  const tx = await contract.write.createCourse([name, fee, details]);

  const publicClient = await getClient();
  const receipt = await publicClient.getTransactionReceipt({ hash: tx });
  console.log(`Course created (${receipt?.transactionHash})\n`);
}

async function registerForCourse(courseId: bigint, userAddress: string) {
  const contract = await viem.getContractAt("CourseRegistration", contractAddress);
  const tx = await contract.write.register([courseId], { value: parseEther("1") });
  const publicClient = await getClient();
  const receipt = await publicClient.getTransactionReceipt({ hash: tx });
  console.log(`Registered for course (${receipt?.transactionHash})\n`);
}

async function getCourseDetails(courseId: bigint) {
  const contract = await viem.getContractAt("CourseRegistration", contractAddress);
  const course = await contract.read.getCourse([courseId]);
  console.log("Getcourse function", course)
  console.log(`Course Details:\n Name: ${course[0]}\n Fee: ${course[1]} ETH\n MAX Participants : ${course[2]}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
