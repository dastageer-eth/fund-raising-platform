import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import ConnectButton from "../components/connectButton";
import constants from "../constants/constant";
import contractsABI from "../abi/abis";

const MultiSendForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [chainName, setChainName] = useState("");
  const [multisenderAddress, setMultisenderAddress] = useState("");
  const [entries, setEntries] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getMultisenderAddress = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await (await provider.getNetwork()).name;
          // console.log(network);
          setChainName(network);
          setMultisenderAddress(constants.MultiSenderAddress[chainName]);
          // console.log(USDTAddress);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getMultisenderAddress();
  }, [multisenderAddress, chainName]);

  useEffect(() => {
    const getAllProject = async () => {
      const result = await axios.get(
        `${constants.DB_URL}/projects/getAllProjects`
      );
      // console.log(result);
      const arr = result.data.projects;
      // const len = arr.length;
      setProjects(arr);
    };
    getAllProject();
  }, []);

  const handleTokenAddressChange = (event) => {
    setTokenAddress(event.target.value);
  };

  const handleNameChange = async (event) => {
    event.preventDefault();
    const result = await axios.get(
      `${constants.DB_URL}/projects/getProjectByName/${event.target.value}`
    );
    const projectId = await axios.get(
      `${constants.DB_URL}/returns/investorsReturns/${result.data.project._id}`
    );
    setEntries(projectId.data.investments);
  };

  const sendTokens = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");
    if (tokenAddress == ethers.ZeroAddress)
      return alert("Token Address cannot be zero Address");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        multisenderAddress,
        contractsABI.multiSenderABI,
        signer
      );
      const tokenContract = new ethers.Contract(
        tokenAddress,
        contractsABI.tokenABI,
        signer
      );
      const decimals = await tokenContract.decimals();
      console.log();
      const addresses = entries.map((e) => e.address);
      const amounts = entries.map((e) =>
        BigInt(e.amount.toFixed(2) * 10 ** Number(decimals))
      );
      console.log(contract);
      console.log(tokenAddress, addresses, amounts);
      const tx = await contract.sendToken(tokenAddress, addresses, amounts);
      await tx.wait();
    } catch (err) {
      console.log(err);
    }
  };

  const approveToken = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenAddress,
        contractsABI.tokenABI,
        signer
      );
      const balance = await tokenContract.balanceOf(signer.address);
      const approveTx = await tokenContract.approve(
        multisenderAddress,
        balance
      );
      await approveTx.wait();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ConnectButton />
      <h1 className="flex items-center justify-center text-4xl font-bold text-black mb-6 mt-2">
        Multisend
      </h1>
      <div className="bg-black rounded-lg shadow-lg max-w-lg mx-auto my-10 p-4">
        <div className="mb-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <select
            type="text"
            id="name"
            onChange={handleNameChange}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
          >
            <option className="text-white" key={null} value={null}>
              Please select an option
            </option>
            {projects.map((obj, index) => {
              // console.log("obj", obj.name);
              return (
                <option className="text-white" key={index} value={obj.name}>
                  {obj.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-2">
          <label
            htmlFor="tokenAddress"
            className="block text-sm font-medium text-gray-300"
          >
            TokenAddress
          </label>
          <input
            type="text"
            id="tokenAddress"
            onChange={handleTokenAddressChange}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"
          />
        </div>
        <div className="flex justify-between px-2 py-4">
          <span className="text-base font-medium text-gray-300">Addresses</span>
          <span className="text-base font-medium text-gray-300">Amounts</span>
        </div>

        {entries.map((entry, index) => (
          <div
            key={index}
            className="flex justify-between mb-2 items-center p-2 "
          >
            <span className="text-gray-300 text">{entry.address}</span>
            <span className="text-gray-300 ">{entry.amount.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            onClick={approveToken}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none m-2"
          >
            Approve
          </button>
          <button
            onClick={sendTokens}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none m-2"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default MultiSendForm;
