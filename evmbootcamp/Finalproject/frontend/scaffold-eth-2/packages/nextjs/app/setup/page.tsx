
"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi, bytecode } from "../../../coursecontracts/artifacts/contracts/CourseRegistration.sol/CourseRegistration.json";
import { parseEther } from "viem";

const setup: NextPage = () => {
const { address: connectedAddress } = useAccount();


const { data, isError, error, isPending, isSuccess, deployContract } = useDeployContract();
  return (
    <center>
      <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Deploy the Contract</h2>


        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            deployContract({
              abi: abi,
              bytecode: bytecode as `0x${string}`,
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