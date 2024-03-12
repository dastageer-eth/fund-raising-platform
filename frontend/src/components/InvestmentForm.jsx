import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import abis from "../abi/abis";
import constants from "../constants/constant";
/* eslint-disable react/prop-types */
// src/components/InvestmentModal.jsx
const InvestmentModal = ({
  isOpen,
  onClose,
  USDTAddress,
  id,
  contractAddress,
}) => {
  const [amount, setAmount] = useState(0);
  const [projectDetails, setProjectDetails] = useState({});

  useEffect(() => {
    const getProjectDetails = async () => {
      console.log(id);
      const result = await axios.get(
        `${constants.DB_URL}/projects/getProjectById/${id}`
      );
      console.log("result", result);
      setProjectDetails(result.data.project);
      console.log("projectDetails", projectDetails);
    };
    getProjectDetails();
    return () => {
      getProjectDetails();
    };
  }, [id]);

  const USDT_ADDRESS = USDTAddress;
  const USDT_ABI = abis.tokenABI;

  const handleInvestChange = (event) => {
    setAmount(event.target.value);
  };

  const InvestButton = async () => {
    if (!window.ethereum) return alert("Please install MetaMask.");
    if (amount == 0) return alert("Amount cannot be 0");
    try {
      console.log(constants.MultiSenderAddress);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await (await provider.getSigner()).address;
      const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
      const amountInWei = ethers.parseUnits(amount.toString(), "mwei"); // USDT has 6 decimals
      const tx = await usdtContract.transfer(contractAddress, amountInWei);
      await tx.wait();
      axios
        .post(`${constants.DB_URL}/investments/createInvestment`, {
          investorAddress: address.toString(),
          actualAmount: amount * 0.85,
          givenAmount: amount * 1, // let it multiple by 1 or else amount will go in string
          projectID: projectDetails._id.toString(),
        })
        .then((response) => {
          console.log(response);
          alert("Transaction send successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-25 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
        <button className="float-right font-bold" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">New Investment</h2>
        <div className="border-b-2 border-gray-200 mb-4">
          <div className="mb-2 font-bold">Details</div>
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div className="font-sm">
              <p>Name: {projectDetails.name}</p>
            </div>
            <div className="font-sm">
              <p>Raised </p>
              {projectDetails.amountRaised}
            </div>
            <div className="font-sm">
              <p>Price: </p>$
              {projectDetails.targetAmount / projectDetails.tokenSupply}
            </div>
          </div>
          <span>
            Min:${projectDetails.minimumBuy} Max: ${projectDetails.maximumBuy}{" "}
            Fee: 15%
          </span>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Invest</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Amount"
            onChange={handleInvestChange}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Token Amount after Fee</label>
          <div className="w-full p-2 border rounded bg-gray-100">
            {amount - amount * 0.15}
          </div>
        </div>
        <button
          onClick={InvestButton}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Invest
        </button>
      </div>
    </div>
  );
};

export default InvestmentModal;
