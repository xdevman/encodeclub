"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract, useReadContract, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi, bytecode } from "../../../coursecontracts/artifacts/contracts/CourseRegistration.sol/CourseRegistration.json";
import { formatEther, parseEther } from "viem";

const dashboard: NextPage = () => {

const { address: connectedAddress } = useAccount();

const [contractaddr, setcontractaddr] = useState("");
const [Tokenamount, setTokenamount] = useState("1");
const [coursename, setcoursename] = useState("");
const [maxParticipants, setmaxParticipants] = useState(1);
const [pricecourse, setpricecourse] = useState(1);
const [message, setMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');


const withdrawassets = async () => {
  try {
    const result = await writeContract({
      address: contractaddr,
      abi: abi,
      functionName: "withdraw",
    });
    setMessage("successfully! Transaction: " + result);
  } catch (error) {
    setMessage("Error : " + error.message);
  }
};

const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
  return (
<div className="flex justify-center items-center min-h-screen">
  <div className="flex flex-row space-x-4">
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Withdraw Form</h2>

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
            <span className="label-text">Token Amount:</span>
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
        onClick= {withdrawassets}
      >
        withdraw
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
      <h2 className="card-title">Add new course</h2>

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
          <span className="label-text">name course:</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={coursename}
          onChange={e => setcoursename(e.target.value)}
        />
      </div>

      <div className="form-control w-full max-w-xs my-4">
        <label className="label">
          <span className="label-text">price:</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={pricecourse}
          onChange={e => setpricecourse(Number(e.target.value))}
        />
      </div>

      <div className="form-control w-full max-w-xs my-4">
        <label className="label">
          <span className="label-text">student limit:</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          value={maxParticipants}
          onChange={e => setmaxParticipants(Number(e.target.value))}
        />
      </div>

      <button
        className="btn btn-active btn-neutral"
        disabled={isPending}
        onClick={() => {
          writeContract({
            abi: abi,
            address: contractaddr,
            functionName: "createCourse",
            args: [coursename, pricecourse, maxParticipants],
          });
        }}
      >
        Add new Course
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

  );
};

export default dashboard;