
"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract, useReadContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi, bytecode } from "../../../coursecontracts/artifacts/contracts/CourseRegistration.sol/CourseRegistration.json";
import { parseEther } from "viem";

const status: NextPage = () => {
const { address: connectedAddress } = useAccount();

const [contractaddr, setcontractaddr] = useState("");
const [courseId, setcourseId] = useState(0);


// برای خواندن اطلاعات از قرارداد
const { data, isError, error, isLoading ,isPending,isSuccess} = useReadContract({
    address: contractaddr,
    abi: abi,
    functionName: "getCourse",
    args:[courseId]
  });

  const handleCheckStatus = () => {
       
  };
  return (
    <center>
      <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">check courses</h2>

  <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Contract Address:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={contractaddr}
            onChange={e => setcontractaddr(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">CourseId:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={courseId}
            onChange={e => setcourseId(Number(e.target.value))}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={handleCheckStatus}
        >
          check Status
        </button>
        {isSuccess && (
            <div>
           
            Course Data: {data ? data.toString() : "No data available"} 
          </div>
            
          )}

        {isError && <div> deploying Error: {error.message}</div>}
      </div>
    </div>
    </center>
  );
};

export default status;