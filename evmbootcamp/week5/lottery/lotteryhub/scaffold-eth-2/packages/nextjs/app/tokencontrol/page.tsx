
"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi, bytecode } from "../../../Lottery-contracts/artifacts/contracts/Lottery.sol/Lottery.json";
import { parseEther } from "viem";

const tokencontrol: NextPage = () => {

const { address: connectedAddress } = useAccount();

// Mint && Burn Token
const [Lotterycontractaddr, setLotterycontractaddr] = useState("");
const [purchaseRatio, setPurchaseRatio] = useState(1);
const [Tokenamount, setTokenamount] = useState(1);

const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-row space-x-4">
      <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Mint Token Form</h2>

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
            onChange={e => setTokenamount(Number(e.target.value))}
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
    disabled // Disabled to prevent user changes
  />
        </div>

        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
            onClick={() => {
                const Tokenvalue = parseEther(Tokenamount.toString()) / BigInt(purchaseRatio);
                writeContract({
                  abi: abi,
                  address: Lotterycontractaddr,
                  functionName: "purchaseTokens",
                  value: BigInt(Tokenvalue),
                });
              }}
              >
          Mint Token
        </button>
        {isSuccess && (
          <div>
            Tx hash:{" "}
            <a href={`https://sepolia.etherscan.io/tx/${data}`} target="_blank">
              {data}
            </a>
          </div>
        )}
        {isError && <div> Minting Error: {error.message}</div>}
      </div>
    </div>

     
     <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Burn Token Form</h2>
        
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
            <span className="label-text">Token Amount:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={Tokenamount}
            onChange={e => setTokenamount(Number(e.target.value))}
          />
        </div>

        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() => {
            writeContract({
                abi: abi,
                address: Lotterycontractaddr,
                functionName: "returnTokens",
                args: [parseEther(Tokenamount.toString())],
              });
            }}
        >
          Burn Token
        </button>

        {isSuccess && (
          <div>
            Tx hash:{" "}
            <a href={`https://sepolia.etherscan.io/tx/${data}`} target="_blank">
              {data}
            </a>
          </div>
        )}
        {isError && <div> Error: {error.message}</div>}
      </div>
    </div>
    </div>
    </div>
    

  );
};

export default tokencontrol;