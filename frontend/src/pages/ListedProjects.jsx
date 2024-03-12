import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import ConnectButton from "../components/connectButton";
import constants from "../constants/constant";

const ListedProjects = () => {
  const [chainName, setChainName] = useState("");
  const [USDTAddress, setUSDTAddress] = useState("");
  const [projects, setProjects] = useState([]);

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

    getUSDTAddress();
    getProjects();
  }, [USDTAddress, chainName]);

  const length = projects.length;
  return (
    <div className="bg-white min-h-screen p-12">
      <ConnectButton />
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-black rounded-lg mb-6">
          Listed Projects
        </h1>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(length)].map((key, i) => (
            <>
              <ProjectCard
                key={key}
                Name={projects[i].name}
                Price={projects[i].targetAmount / projects[i].tokenSupply}
                TotalRaised={projects[i].amountRaised}
                Target={projects[i].targetAmount}
                USDTAddress={USDTAddress}
                id={projects[i]._id}
                contractAddress={constants.MultiSenderAddress[chainName]}
              />
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListedProjects;
