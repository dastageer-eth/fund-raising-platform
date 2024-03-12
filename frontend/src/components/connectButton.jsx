import { ethers } from "ethers";
import { useState, useEffect } from "react";
import ProfileButton from "./ProfileButton";

const ConnectButton = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            const address = await (await provider.getSigner()).address;
            setWalletAddress(address);
            setIsConnected(true);
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    };
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const address = await (await provider.getSigner()).address;
        setWalletAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  };

  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  return (
    <>
      <ProfileButton />
      <button
        type="button"
        onClick={!isConnected ? connectWallet : null}
        className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 absolute top-0 right-0 p-4 m-2"
      >
        {isConnected
          ? `Connected: ${formatAddress(walletAddress)}`
          : "Connect Wallet"}
      </button>
    </>
  );
};

export default ConnectButton;
