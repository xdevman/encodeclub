import { expect } from "chai";
import { viem } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { parseEther } from  "viem";

// const MINTER_ROLE = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0"

const TEST_RATIO = 100n;
const TEST_PRICE = 10n;
const TEST_PURCHASE_SIZE = parseEther("1");
const TEST_RETURN_TOKENS_SIZE = parseEther("50");

async function deployContractFixture() {
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount] = await viem.getWalletClients();
  const myTokenContract = await viem.deployContract("MyToken");
  const nftContract = await viem.deployContract("MyNFT");
  const TokenSaleContract = await viem.deployContract("TokenSale",[TEST_RATIO,TEST_PRICE,myTokenContract.address,nftContract.address]);
  const MINTER_ROLE = await myTokenContract.read.MINTER_ROLE();
  const giveMinterRoleTokenTx = await myTokenContract.write.grantRole([MINTER_ROLE,TokenSaleContract.address]);
  await publicClient.waitForTransactionReceipt({hash: giveMinterRoleTokenTx});
  return {
    publicClient,
    owner,
    otherAccount,
    TokenSaleContract,
    myTokenContract,
    nftContract,
  };
}
describe("NFT Shop", async () => {
  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const {TokenSaleContract} = await loadFixture(deployContractFixture)
      const ratio = await TokenSaleContract.read.ratio(); //TODO
      expect(ratio).to.equal(TEST_RATIO);
    });
    it("defines the price as provided in parameters", async () => {
      const {TokenSaleContract} = await loadFixture(deployContractFixture)
      const price = await TokenSaleContract.read.price(); //TODO
      expect(price).to.equal(TEST_PRICE);
    });
    it("uses a valid ERC20 as payment token", async () => {
      const {TokenSaleContract} = await loadFixture(deployContractFixture)
      const paymentTokenAddress = await TokenSaleContract.read.paymentToken(); //TODO
      const paymentTokenContract = await viem.getContractAt("MyToken", paymentTokenAddress);
      const [totalSupply, decimals, name, symbol] = await Promise.all([
      paymentTokenContract.read.totalSupply(),
      paymentTokenContract.read.decimals(),
      paymentTokenContract.read.name(),
      paymentTokenContract.read.symbol(),
    ]);
    // console.log("totalsupply:", totalSupply,'\n decimals:',decimals,"\n names:",name,"\n symbol:", symbol)
 
    expect(totalSupply).to.equal(0n);
    expect(decimals).to.equal(18);
    expect(name).to.equal("MyToken");
    expect(symbol).to.equal("MTK");
    });
    it("uses a valid ERC721 as NFT collection", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user buys an ERC20 from the Token contract", async () => {  
    it("charges the correct amount of ETH", async () => {
      const { publicClient, TokenSaleContract, myTokenContract,otherAccount } = await loadFixture(deployContractFixture);
      const ethtokenbalancebefore = await publicClient.getBalance({address:otherAccount.account.address});

      //TODO : call the contract using otherAccount to buy token
      const buyTokensTx = await TokenSaleContract.write.buyTokens({
        value: TEST_PURCHASE_SIZE,
        account: otherAccount.account,
      });
      const receipt = await publicClient.getTransactionReceipt({
        hash: buyTokensTx,
      });
      
      const gasUsed = receipt.gasUsed;
      const gasPrice = receipt.effectiveGasPrice;
      const txcost = gasUsed * gasPrice;

      if (!receipt.status || receipt.status !== "success") throw new Error("Transaction False");    
    
      const ethtokenbalanceafter = await publicClient.getBalance({address: otherAccount.account.address});
      const diff = ethtokenbalanceafter - ethtokenbalancebefore - txcost;
      expect(diff).to.equal(TEST_PURCHASE_SIZE);
    })
    it("gives the correct amount of tokens", async () => {
      const { publicClient, TokenSaleContract, myTokenContract,otherAccount } = await loadFixture(deployContractFixture);
      const tokenbalancebefore = await myTokenContract.read.balanceOf([otherAccount.account.address]);

      //TODO : call the contract using otherAccount to buy token
      const buyTokensTx = await TokenSaleContract.write.buyTokens({
        value: TEST_PURCHASE_SIZE,
        account: otherAccount.account,
      });
      const receipt = await publicClient.getTransactionReceipt({
        hash: buyTokensTx,
      });
      

      if (!receipt.status || receipt.status !== "success") throw new Error("Transaction False");    
    
      const tokenbalanceafter = await myTokenContract.read.balanceOf([otherAccount.account.address]);
      const diff = tokenbalanceafter - tokenbalancebefore;
      expect(diff).to.equal(TEST_PURCHASE_SIZE * TEST_RATIO);
      });
  })
  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    })
    it("burns the correct amount of tokens", async () => {
      const { publicClient, TokenSaleContract, myTokenContract,otherAccount } = await loadFixture(deployContractFixture);
      //TODO : call the contract using otherAccount to buy token
      const buyTokensTx = await TokenSaleContract.write.buyTokens({
        value: TEST_PURCHASE_SIZE,
        account: otherAccount.account,
      });
      const BuyTokensTxReceipt = await publicClient.getTransactionReceipt({
        hash: buyTokensTx,
      });
      if (!BuyTokensTxReceipt.status || BuyTokensTxReceipt.status !== "success") throw new Error("Transaction False");
      const tokenbalancebefore = await myTokenContract.read.balanceOf([otherAccount.account.address]);

      const approveTokensTx = await myTokenContract.write.approve([TokenSaleContract.address,TEST_RETURN_TOKENS_SIZE],{account:otherAccount.account});
      
      const approveTokensTxReceipt = await publicClient.getTransactionReceipt({
        hash: approveTokensTx,
      });
      if (!approveTokensTxReceipt.status || approveTokensTxReceipt.status !== "success") throw new Error("Transaction False");

      const returnTokensTx = await TokenSaleContract.write.returnTokens([TEST_RETURN_TOKENS_SIZE,],{account: otherAccount.account});  

      const returnTokensTxReceipt = await publicClient.getTransactionReceipt({
        hash: returnTokensTx,
      });

      if (!returnTokensTxReceipt.status || returnTokensTxReceipt.status !== "success") throw new Error("Transaction False");    

      const tokenbalanceafter = await myTokenContract.read.balanceOf([otherAccount.account.address]);
      const diff = tokenbalancebefore - tokenbalanceafter;
      expect(diff).to.equal(TEST_RETURN_TOKENS_SIZE);
    });
  })
  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    })
    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  })
  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    })
    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});