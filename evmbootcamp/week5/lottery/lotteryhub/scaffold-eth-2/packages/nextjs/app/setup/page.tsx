
"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi, bytecode } from "../../../Lottery-contracts/artifacts/contracts/Lottery.sol/Lottery.json";
import { parseEther } from "viem";

const setup: NextPage = () => {
const { address: connectedAddress } = useAccount();
const [tokenName, setTokenName] = useState("LotteryHubToken");
const [tokenSymbol, setTokenSymbol] = useState("LTH");
const [purchaseRatio, setPurchaseRatio] = useState(1);
const [betPrice, setBetPrice] = useState("1");
const [betFee, setBetFee] = useState("1");
const { data, isError, error, isPending, isSuccess, deployContract } = useDeployContract();
  return (
    <center>
      <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Deploy the Contract</h2>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Token name:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={tokenName}
            onChange={e => setTokenName(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter tokenSymbol:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={tokenSymbol}
            onChange={e => setTokenSymbol(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">purchaseRatio:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={purchaseRatio}
            onChange={e => setPurchaseRatio(Number(e.target.value))}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter betPrice:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={betPrice}
            onChange={e => setBetPrice(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">BetFee:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={betFee}
            onChange={e => setBetFee(e.target.value)}
          />
        </div>

        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            deployContract({
              abi: abi,
              bytecode: bytecode as `0x${string}`,
              args: [tokenName, tokenSymbol, purchaseRatio, parseEther(betPrice), parseEther(betFee)],
            })
          }
        >
          Deploy
        </button>
        {isSuccess && (
          <div>
            Tx hash:{" "}
            <a href={`https://sepolia.etherscan.io/tx/${data}`} target="_blank">
              {data}
            </a>
          </div>
        )}
        {isError && <div> deploying Error: {error.message}</div>}
      </div>
    </div>
    </center>
  );
};

export default setup;