import { useState } from "react";
import { useWriteContract } from "wagmi";

export const CastVotes = () => {
  const [ballotAddress, setballotAddress] = useState("");
  const [proposalIndex, setproposalIndex] = useState("");
  const [voteAmount, setvoteAmount] = useState("");

  const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Casting Votes</h2>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the address for the ballot:</span>
          </label>
          <input
            type="text"
            placeholder="0x...."
            className="input input-bordered w-full max-w-xs"
            value={ballotAddress}
            onChange={e => setballotAddress(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the index of your chosen proposal:</span>
          </label>
          <input
            type="text"
            placeholder="2"
            className="input input-bordered w-full max-w-xs"
            value={proposalIndex}
            onChange={e => setproposalIndex(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter your vote amount for this proposal:</span>
          </label>
          <input
            type="text"
            placeholder="100"
            className="input input-bordered w-full max-w-xs"
            value={voteAmount}
            onChange={e => setvoteAmount(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            writeContract({
              abi: [
                {
                  inputs: [
                    {
                      internalType: "uint256",
                      name: "proposal",
                      type: "uint256"
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256"
                    }
                  ],
                  name: "vote",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function"
                },
              ],
              address: ballotAddress,
              functionName: "vote",
              args: [BigInt(proposalIndex), BigInt(voteAmount)],
            })
          }
        >
          Submit Vote
        </button>
        {isSuccess && <div>Tx hash: <p>{data}</p></div>}
        {isError && <div>Error: {error.message}</div>}
      </div>
    </div>
  );
}