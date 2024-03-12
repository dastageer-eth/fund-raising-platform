import { useEffect, useState } from "react";
import ConnectButton from "../components/connectButton";
import constants from "../constants/constant";
import axios from "axios";
import { ethers } from "ethers";
import abis from "../abi/abis";
import { useParams } from "react-router-dom";
import queryString from "query-string";

const ProjectDetails = () => {
  const [projectDetails, setProjectDetails] = useState({
    info: [],
    investmentJson: {},
    noOfTokens: [],
    askPrice: [],
  });
  const [USDTAddress, setUSDTAddress] = useState("");
  const [chainName, setChainName] = useState("");
  const { id } = useParams();

  const formatAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };

  useEffect(() => {
    const fetchData = async () => {
      const projectInfo = await axios
        .get(`${constants.DB_URL}/projects/getProjectById/${id}`)
        .then((res) => res.data.project);
      const noOfTokens = await axios
        .get(`${constants.DB_URL}/returns/investorsReturns/${id}`)
        .then((res) => res.data.investments);
      const askPrice = await axios
        .get(`${constants.DB_URL}/investments/getInvestmentByProject/${id}`)
        .then((res) => res.data.investment);

      console.log(projectInfo);
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        info: projectInfo,
        noOfTokens,
        askPrice,
      }));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchInvestmentJson = async () => {
      const investmentJson = await axios
        .get(
          `${constants.DB_URL}/investments/getOnSaleInvestmentByProject/${id}`
        )
        .then((res) => res.data.investments);

      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        investmentJson,
      }));
    };

    fetchInvestmentJson();
  }, []);

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
    getUSDTAddress();
  }, [USDTAddress, chainName]);

  const BuyStake = async (amount, seller_address) => {
    if (!window.ethereum) return alert("Please install MetaMask.");
    if (amount === 0) return alert("Amount cannot be 0");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await (await provider.getSigner()).address;
      console.log(USDTAddress);
      const usdtContract = new ethers.Contract(
        USDTAddress,
        abis.tokenABI,
        signer
      );
      const amountInWei = ethers.parseUnits(amount.toString(), "mwei"); // USDT has 6 decimals
      await usdtContract
        .transfer(seller_address, amountInWei)
        .then((tx) => tx.wait());

      const queryParams = queryString.stringify({
        investorAddress: seller_address,
        projectID: id,
        newInvestorAddress: address,
      });
      const queryURL = `${constants.DB_URL}/investments/buyStakes?${queryParams}`;

      axios
        .post(queryURL)
        .then((response) => {
          console.log(response);
          alert("Transaction sent successfully");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getNoOfToken = (address) => {
    const token = projectDetails.noOfTokens.find((t) => t.address === address);
    return token ? token.amount.toFixed(2) : "0.00";
  };

  const getAskAmount = (address) => {
    const ask = projectDetails.askPrice.find(
      (a) => a.investorAddress === address && a.saleStatus
    );
    return ask ? ask.askAmount : "N/A";
  };

  return (
    <>
      <ConnectButton />
      <h1 className="flex items-center justify-center text-4xl font-bold text-black mb-6 mt-2">
        Project Details
      </h1>
      <div className="p-8  text-black">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border border-gray-600 bg-black rounded-lg text-white">
            Project Status:{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>
              {projectDetails.info.status}
            </span>
          </div>
          <div className="p-4 border border-gray-600 bg-black rounded-lg text-white">
            Amount to raise:{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>
              {projectDetails.info.targetAmount}
            </span>
          </div>
          <div className="p-4 border border-gray-600 bg-black rounded-lg text-white">
            Total Raised:{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>
              {projectDetails.info.amountRaised}
            </span>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-3xl mb-4 font-bold color text-red-600">
            On-sale
          </div>
          <div className="border border-gray-600">
            <div className="grid grid-cols-5 p-5 font-bold text-xl">
              <div>Seller Address</div>
              <div>No. Token</div>
              <div>Current price</div>
              <div>Ask price</div>
            </div>
            <>
              {Object.entries(projectDetails.investmentJson).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-5 p-5 bg-gray-600 rounded-lg m-2 text-white text-l font-bold"
                  >
                    <div>{formatAddress(key)}</div>
                    <div>{getNoOfToken(key)}</div>
                    <div>{value}</div>
                    <div>{getAskAmount(key)}</div>
                    <button
                      onClick={() => BuyStake(getAskAmount(key), key)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
                    >
                      Buy
                    </button>
                  </div>
                )
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
