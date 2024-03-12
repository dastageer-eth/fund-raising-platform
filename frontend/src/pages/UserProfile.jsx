import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import constants from "../constants/constant";
import ConnectButton from "../components/connectButton";
import OnSaleForm from "../components/OnSaleForm";

const UserProfile = () => {
  const [userInvestments, setUserInvestments] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [id, setId] = useState("");

  const openPopup = (price, id) => {
    setPopupOpen(true), setPrice(price), setId(id);
  };
  const closePopup = () => setPopupOpen(false);

  useEffect(() => {
    const getAllInvestments = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const address = await (await provider.getSigner()).address;
          const result = await axios.get(
            `${constants.DB_URL}/investments/getInvestmentByAddress/${address}`
          );
          //   console.log(result);
          setUserInvestments(result.data.investment);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getAllInvestments();
  }, []);

  return (
    <>
      <ConnectButton />
      <h1 className="flex items-center justify-center text-4xl font-bold text-black mb-6 mt-2">
        User Profile
      </h1>
      <div className="bg-gray-800 p-8 rounded-lg max-w-2xl mx-auto my-10">
        <div className="space-y-4">
          {userInvestments.map((user, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-700 p-4 rounded"
            >
              <div className="text-white">
                <div className="font-bold">{user.project}</div>
                <div>${user.actualAmount}</div>
              </div>
              <button
                onClick={() => {
                  openPopup(user.actualAmount, user.projectID);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                Sell
              </button>
            </div>
          ))}
          {isPopupOpen && (
            <OnSaleForm
              isOpen={isPopupOpen}
              onClose={closePopup}
              investments={price}
              id={id}
              priceFunction={setPrice}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
