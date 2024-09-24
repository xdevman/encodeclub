
"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi, bytecode } from "../../../coursecontracts/artifacts/contracts/CourseRegistration.sol/CourseRegistration.json";
import { parseEther } from "viem";
import { writeContract } from "viem/actions";

const store: NextPage = () => {
const { address: connectedAddress } = useAccount();

const [contractaddr, setcontractaddr] = useState("");
const [courseId, setcourseId] = useState(0);
const [message, setMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [pricecourse, setpricecourse] = useState(1);

const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
const registernewcs = async () => {
  try {
    const result = await writeContract({
      abi: abi,
      address: contractaddr,
      functionName: "register",
      args: [courseId],
      value:pricecourse
    });
    setMessage("successfully! Transaction: " + result);
  } catch (error) {
    setMessage("Error : " + error.message);
  }
};

  return (
    <center>
      <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Register new course</h2>

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
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Price:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={pricecourse}
            onChange={e => setpricecourse(Number(e.target.value))}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick = {registernewcs}
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

export default store;