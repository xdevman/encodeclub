"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract, useReadContract, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi } from "../../../Lottery-contracts/artifacts/contracts/Lottery.sol/Lottery.json";
import { formatEther, parseEther } from "viem";

const dashboard: NextPage = () => {

const { address: connectedAddress } = useAccount();


const [Lotterycontractaddr, setLotterycontractaddr] = useState("");
const [Tokenamount, setTokenamount] = useState("1");
const [showPool, setShowPool] = useState(false);
  const { data: ownerPool } = useReadContract({
    address: Lotterycontractaddr,
    abi: abi,
    functionName: "ownerPool",
  });

  const handleCheckPool = () => {
    setShowPool(true); 
  };
const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-row space-x-4">
      <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">WithdrawOwner Form</h2>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Lottery Contract Address:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={Lotterycontractaddr}
            onChange={e => setLotterycontractaddr(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Token amount:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={Tokenamount}
            onChange={e => setTokenamount(e.target.value)}
          />
        </div>

        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() => {
            useReadContract({
                address: Lotterycontractaddr,
                abi: abi,
                functionName: "ownerPool",
              });
          }}
              >
          Check Status
        </button>
        {isSuccess && (
          <div>
            Tx hash:{" "}
            <a href={`https://sepolia.etherscan.io/tx/${data}`} target="_blank">
              {data}
            </a>
          </div>
        )}
        {isError && <div> Withdraw Error: {error.message}</div>}
      </div>
    </div>

     <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">OwnerPool Status</h2>
        
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Lottery Contract Address:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={Lotterycontractaddr}
            onChange={e => setLotterycontractaddr(e.target.value)}
          />

        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={handleCheckPool}  
        >
          Check Pool
        </button>

        {showPool && ownerPool !== undefined && (
          <div>Pool: {ownerPool ? formatEther(ownerPool as bigint) : 0}</div>
        )}
        {isError && <div> Error: {error.message}</div>}
      </div>
    </div>
    </div>
</div>
  );
};

export default dashboard;