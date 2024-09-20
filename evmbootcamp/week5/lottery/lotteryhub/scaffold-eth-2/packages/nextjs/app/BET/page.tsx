"use client";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useDeployContract, useReadContract, useWriteContract } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { abi } from "../../../Lottery-contracts/artifacts/contracts/Lottery.sol/Lottery.json";
import { formatEther, parseEther } from "viem";

const BetPage: NextPage = () => {

const { address: connectedAddress } = useAccount();

const [Lotterycontractaddr, setLotterycontractaddr] = useState("");
const [Tokenamount, setTokenamount] = useState("1");

const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
const [prize, setPrize] = useState(null);
const [betAmount, setBetAmount] = useState(1);
const [lotteryState, setLotteryState] = useState('');
const [betsOpen, setBetsOpen] = useState(null);
const [betsClosingTime, setBetsClosingTime] = useState(null);
const [PlayerAddress, setPlayerAddress] = useState("");
const [prizeamount, setprizeamount] = useState("1");
const [message, setMessage] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [betduration, setbetDuration] = useState(60);

const checkLotteryState = async () => {
        const { data: betsOpenData } = await useReadContract({
          address: Lotterycontractaddr,
          abi: abi,
          functionName: "betsOpen",
        });
        
        const { data: betsClosingTimeData } = await useReadContract({
          address: Lotterycontractaddr,
          abi: abi,
          functionName: "betsClosingTime",
        });

        setBetsOpen(betsOpenData);
        setBetsClosingTime(betsClosingTimeData);
};

const checkPrize = async () => {
    const { data: playerPrize } = await useReadContract({
        address: Lotterycontractaddr,
        abi: abi,
        functionName: "prize",
        args: [PlayerAddress],
      });
    setPrize(playerPrize); 
};

const claimPrize = async () => {
    try {
      const result = await writeContract({
        abi: abi,
        address: Lotterycontractaddr,
        functionName: "prizeWithdraw",
        args: [parseEther(prizeamount)],
      });
      setMessage("Prize claimed successfully! Transaction: " + result);
    } catch (error) {
      setMessage("Error claiming prize: " + error.message);
    }
  };

  const openBet = async () => {
    try {
      const closingTime = Math.floor(Date.now() / 1000) + Number(betduration);
      const result = await writeContract({
        abi: abi,
        address: Lotterycontractaddr,
        functionName: "openBets",
        args: [closingTime],
      });
      setSuccessMessage("Bet opened successfully! Transaction: " + result);
      setErrorMessage(''); // Reset error message
    } catch (error) {
      setErrorMessage("Error opening bet: " + error.message);
      setSuccessMessage(''); // Reset success message
    }
  };

const closeBet = async () => {
    try {
      const result = await writeContract({
        abi: abi,
        address: Lotterycontractaddr,
        functionName: "closeLottery",
      });
      setSuccessMessage("Bet closed successfully! Transaction: " + result);
      setErrorMessage(''); 
    } catch (error) {
      setErrorMessage("Error closing bet: " + error.message);
      setSuccessMessage(''); 
    }
  };

  const placeBet = async () => {
    try {
      const result = await writeContract({
        abi: abi,
        address: Lotterycontractaddr,
        functionName: "betMany",
        args: [BigInt(betAmount)], // تبدیل به BigInt برای ارسال به قرارداد
      });
      setSuccessMessage("Bet placed successfully! Transaction: " + result);
      setErrorMessage(''); // Reset error message
    } catch (error) {
      setErrorMessage("Error placing bet: " + error.message);
      setSuccessMessage(''); // Reset success message
    }
  };

return (
    <center>
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Betting Page</h2>

        {/* Check Lottery State */}
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Check Lottery State:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={Lotterycontractaddr}
            onChange={e => setLotterycontractaddr(e.target.value)}
          />
          <button className="btn btn-active btn-neutral" onClick={checkLotteryState}>
            Check
          </button>
        </div>
        {betsOpen !== null && (
          <div>Bet Open: {betsOpen ? 'Yes' : 'No'}</div>
        )}
        {betsClosingTime !== null && (
          <div>Closing Time: {new Date(betsClosingTime * 1000).toLocaleString()}</div>
        )}

        {/* Check Prize */}
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Check Prize:</span>
          </label>
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
            <span className="label-text">player Address:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={PlayerAddress}
            onChange={e => setPlayerAddress(e.target.value)}
          />
        </div>
          <button className="btn btn-active btn-neutral" onClick={checkPrize}>
            Check Prize
          </button>
          {prize !== null && <div>Prize: {prize ? prize : 'No Prize'}</div>}
        </div>

        {/* Claim Prize */}
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Claim Prize:</span>
          </label>
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
            <span className="label-text">Prize value:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={prizeamount}
            onChange={e => setprizeamount(e.target.value)}
          />
        </div>
          <button className="btn btn-active btn-neutral" onClick={claimPrize}>
            Claim
          </button>
          {message && <div className="mt-4">{message}</div>}
        </div>

        {/* Open Bet */}
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Open Bet:</span>
          </label>
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
            <span className="label-text">duration time in sec(example : 60):</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={betduration}
            onChange={e => setbetDuration(Number(e.target.value))}
          />
        </div>
          <button className="btn btn-active btn-neutral" onClick={openBet}>
            Open
          </button>
          {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>} 
          {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>} 
        </div>

        {/* Close Bet */}
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Close Bet:</span>
          </label>
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
          <button className="btn btn-active btn-neutral" onClick={closeBet}>
            Close
          </button>
          {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>} 
          {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}

        </div>

        {/* Place Bet */}
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Bet Amount:</span>
          </label>
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
            <span className="label-text">Bet Amount:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={betAmount}
            onChange={e => setBetAmount(Number(e.target.value))}
          />
        </div>
          <button className="btn btn-active btn-neutral" onClick={placeBet}>
            Bet
          </button>
          {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
          {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>} 
        </div>
      </div>
    </div>
    </center>
  );
};

export default BetPage;