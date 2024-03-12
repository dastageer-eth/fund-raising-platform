import { useState, useEffect } from "react";
import { ethers } from "ethers";
import constants from "../constants/constant";
import axios from "axios";
import queryString from "query-string";

// eslint-disable-next-line react/prop-types
const OnSaleForm = ({ isOpen, onClose, investments, id }) => {
  const [amount, setAmount] = useState(0);
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    const getAddress = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const address = await (await provider.getSigner()).address;
          setUserAddress(address);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getAddress();
  }, [userAddress]);

  const handleChange = (e) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const confirmSell = () => {
    console.log(userAddress, id, amount);

    const queryParams = queryString.stringify({
      investorAddress: userAddress,
      projectID: id,
      askAmount: amount,
    });

    const queryURL = `${constants.DB_URL}/investments/sellStakes?${queryParams}`;
    console.log(queryURL);

    axios
      .post(queryURL)
      .then((response) => {
        console.log(response);
        alert("You stake have been set for sale");
      })
      .catch((error) => {
        console.error("Error selling stake:", error);
        // Handle error
      });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Put on Sale
          </h3>
          <p>Current Price: ${investments}</p>
          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="text"
              placeholder="Ask Price"
              onChange={handleChange}
              className="mt-2 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
            />
            <button
              type="submit"
              onClick={confirmSell}
              className="mt-4 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Confirm
            </button>
          </form>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnSaleForm;
