"use client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { hexToString } from "viem";
import { CastVotes } from "~~/components/CastVotes";
import { useAccount, useBalance, useReadContract, useSignMessage, useWriteContract } from "wagmi";
const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p>
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <p className="text-center text-lg">Here we are!</p>
      <WalletInfo></WalletInfo>
      {/* <RandomWord></RandomWord> */}
    </>
  );
}
function Castnewvote(){
  const [BallotAddress, setBallotAddress] = useState("");
  const [Proposal_index, setproposalIndex] = useState("");
  const [VoteCount, setvoteCount] = useState("");

  const { data, isError, error, isPending, isSuccess, writeContract } = useWriteContract();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Cast New Vote</h2>

        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter Ballot Contract Address:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={BallotAddress}
            onChange={e => setBallotAddress(e.target.value)}
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
            value={Proposal_index}
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
            value={VoteCount}
            onChange={e => setvoteCount(e.target.value)}
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
              address: BallotAddress,
              functionName: "vote",
              args: [BigInt(Proposal_index), BigInt(VoteCount)],
            })
          }
        >
          Vote
        </button>
        {isSuccess && <div>TxHash: <p>{data}</p></div>}
        {isError && <div>Error: {error.message}</div>}
      </div>
    </div>
  );

}
function WalletInfo() {
  const { address, isConnecting, isDisconnected, chain } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletAction></WalletAction>
        <WalletBalance address={address as `0x${string}`}></WalletBalance>
        <TokenInfo address={address as `0x${string}`}></TokenInfo>
        <ApiData address={address as `0x${string}`}></ApiData>
        {/* <ApiData address={address as `0x${string}`}></ApiData> */}
        <DelegateVotes address={address as `0x${string}`}></DelegateVotes>
        <Castnewvote></Castnewvote>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");
  const { data, isError, isPending, isSuccess, signMessage } = useSignMessage();
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing signatures</h2>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text">Enter the message to be signed:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={signatureMessage}
            onChange={e => setSignatureMessage(e.target.value)}
          />
        </div>
        <button
          className="btn btn-active btn-neutral"
          disabled={isPending}
          onClick={() =>
            signMessage({
              message: signatureMessage,
            })
          }
        >
          Sign message
        </button>
        {isSuccess && <div>Signature: {data}</div>}
        {isError && <div>Error signing message</div>}
      </div>
    </div>
  );
}
function WalletBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useBalance({
    address: params.address,
  });

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useBalance wagmi hook</h2>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    </div>
  );
}

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useReadContract wagmi hook</h2>
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
      </div>
    </div>
  );
}

function TokenName() {
  const { data, isError, isLoading } = useReadContract({
    address: "0xe3c023e9b3f9e6b7e6886ffe904e42a098a68624",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name}</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0xe3c023e9b3f9e6b7e6886ffe904e42a098a68624",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = data ? Number(data) : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance}</div>;
}

function RandomWord() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("https://randomuser.me/api/")
      .then(res => res.json())
      .then(data => {
        setData(data.results[0]);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing useState and useEffect from React library</h2>
        <h1>
          Name: {data.name.title} {data.name.first} {data.name.last}
        </h1>
        <p>Email: {data.email}</p>
      </div>
    </div>
  );

}
function ApiData(params: { address: `0x${string}` }) {
  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Testing API Coupling</h2>
        <TokenAddressFromApi></TokenAddressFromApi>
        <RequestTokens address={params.address}></RequestTokens>

        <p><strong>VOTE RESULTS</strong></p>
        {/* <GetProposalsFromApi></GetProposalsFromApi> */}
        <WinnerName></WinnerName>
      </div>
    </div>
  );
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/contract-address")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address from API: {data.result}</p>
    </div>
  );
}
function Delegator(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0x71242d428244A64A725A42445A7497B686fdbD84",
    abi: [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "delegates",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
    ],
    functionName: "delegates",
    args: [params.address],
  });

  if (isLoading) return <div>Fetching delegate…</div>;
  if (isError) return <div>Error fetching delegate</div>;
  return <div>Delegate Address: {data as string}</div>;
}
function WinnerName() {
  const { data, isError, isLoading, error } = useReadContract({
    address: '0xd0669521f0b47314044fa356ed01663248690f7a',  //Tokenized Ballot Contract
    abi: [
      {
        inputs: [],
        name: "winnerName",
        outputs: [
          {
            internalType: "bytes32",
            name: "winnerName_",
            type: "bytes32"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
    ],
    functionName: 'winnerName',
  });
  if (isLoading) return <div>Fetching winner...</div>;
  if (isError) return <div>Error fetching winner { }</div>;
  const winnerProposal = data ? data : "There is not winner!";
  return (
    <div>
      {
        winnerProposal === "There is not winner!"
          ? "There is not winner!"
          : `Winner proposal is ${hexToString(winnerProposal, { size: 32 })}`
      }
    </div>
  );
}


function GetProposalsFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/list-proposal/3")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Result votes: {data.result}</p>
    </div>
  );
}

function WinningProposalFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/winning-proposal")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>404: No Token info</p>;

  return (
    <div>
      <p>Winning Proposal from API: {data.result}</p>
    </div>
  );
}

function DelegateVotes(params: { address: `0x${string}` }) {
  const [delegateAddr, setdelegateAddress] = useState("");
  const { data, isError, isPending, isSuccess, writeContract } = useWriteContract();

  return (
    <div className="card w-96 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <h2 className="card-title">Delegating votes</h2>
        <Delegator address={params.address}></Delegator>
        <div className="form-control w-full max-w-xs my-4">
          <label className="label">
            <span className="label-text"> delegate Address to:</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={delegateAddr}
            onChange={e => setdelegateAddress(e.target.value)}
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
                      internalType: "address",
                      name: "delegatee",
                      type: "address"
                    }
                  ],
                  name: "delegate",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function"
                },
              ],
              address: "0x71242d428244A64A725A42445A7497B686fdbD84",
              functionName: 'delegate',
              args: [delegateAddr],
            })
          }
        >
          Send Delegate
        </button>
        {isSuccess && <div>TX hash: <p>{data}</p></div>}
        {isError && <div>Error Cast New Vote</div>}
      </div>
    </div>
  );
}

function RequestTokens(params: { address: string }) {
  const [data, setData] = useState<{ result: boolean; msg: string; txhash: string; }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address, amount:50 };

  if (isLoading) return <p>Requesting tokens from API...</p>;
  if (!data)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Request tokens
      </button>
    );

  return (
    <div>
      <p>Result from API: {data.result ? "worked" : "failed"}</p>
      <p>Message: {data.msg ? data.msg : "error"}</p>
      <p>Tx Hash: {data.txhash ? data.txhash : "error"}</p>
    </div>
  );
}



export default Home;