import ConnectButton from "../components/connectButton";
import { ethers } from "ethers";
import axios from "axios";
import { useState, useEffect } from "react";
import constants from "../constants/constant";
import abis from "../abi/abis";

const WithdrawAssets = () => {
  const [chainName, setChainName] = useState("");
  const [USDTAddress, setUSDTAddress] = useState("");
  const [projects, setProjects] = useState([]);
  const [multisenderAddress, setMultisenderAddress] = useState("");

  useEffect(() => {
    const getUSDTAddress = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await (await provider.getNetwork()).name;
          // console.log(network);
          setChainName(network);
          setUSDTAddress(constants.USDTAddresses[chainName]);
          // console.log(USDTAddress);
        } catch (err) {
          console.log(err);
        }
      }
    };

    const getProjects = async () => {
      const result = await axios.get(
        `${constants.DB_URL}/projects/getAllProjects`
      );
      setProjects(result.data.projects);
      // console.log("Projects", projects);
    };

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
    getUSDTAddress();
    getProjects();
    getMultisenderAddress();
  }, [USDTAddress, chainName, multisenderAddress]);

  const PREDEFINED_RECEIVER_ADDRESS = constants.PREDEFINED_RECEIVER_ADDRESS;

  const withdrawUSDT = async (amount, id) => {
    if (!window.ethereum) return alert("Please install MetaMask.");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        multisenderAddress,
        abis.multiSenderABI,
        signer
      );
      console.log(`Sending Tokens to ${PREDEFINED_RECEIVER_ADDRESS}`);
      const amountInWei = ethers.parseUnits(amount.toString(), "mwei");
      const tx = await contract.withdrawTokenBalance(USDTAddress, amountInWei);
      await tx.wait();
      console.log(tx);
      axios.post(`${constants.DB_URL}/projects/withdraw/${id.toString()}`);
      alert("Transaction send successfully");
    } catch (err) {
      console.log(err);
    }
  };
  // const withdrawTokens = () => {};

  const length = projects.length;
  return (
    <>
      <ConnectButton />
      <h1 className="flex justify-center items-center text-4xl font-bold text-black mb-6 mt-2">
        Withdraw Assets
      </h1>
      <div className="bg-black p-8 rounded-lg max-w-2xl mx-auto my-10">
        {[...Array(length)].map((_, i) => (
          <div key={i} className="flex justify-between items-center mb-4 p-6">
            <div className="flex-grow">
              <span className="text-gray-300 mr-6">
                P-Name : {projects[i].name}
              </span>
              <br />
              <span className="text-gray-300 mr-6">
                USDT: {projects[i].totalRaised}
              </span>
              <br />
              {/* <span className="text-gray-300 mr-6">Token: 10</span> */}
            </div>
            <div className="flex-none">
              <button
                onClick={() => {
                  withdrawUSDT(projects[i].totalRaised, projects[i]._id);
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none m-2"
              >
                Withdraw USDT
              </button>
              {/* <button
                onClick={withdrawTokens}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none m-2"
              >
                Withdraw Token
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default WithdrawAssets;
