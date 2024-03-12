/* eslint-disable react/prop-types */
import InvestmentModal from "../components/InvestmentForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ProjectCard = ({
  Name,
  Price,
  TotalRaised,
  Target,
  USDTAddress,
  id,
  contractAddress,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  let navigate = useNavigate();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="bg-black rounded-lg shadow overflow-hidden w-full p-3 flex flex-col justify-between">
        <div>
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Name: {Name}
          </div>
          <div className="block mt-1 text-md leading-tight font-medium text-white">
            Price: {Price}
          </div>
          <div className="block mt-1 text-md leading-tight font-medium text-white">
            Total raised: {TotalRaised}
          </div>
          <div className="block mt-1 text-md leading-tight font-medium text-white">
            Target: {Target}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleOpenModal}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center mx-2"
          >
            Invest
          </button>
          <button
            onClick={() => navigate(`/project-details/${id}`)}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded self-center"
          >
            Details
          </button>
        </div>
      </div>
      {isModalOpen && (
        <InvestmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          USDTAddress={USDTAddress}
          id={id}
          contractAddress={contractAddress}
        />
      )}
    </>
  );
};

export default ProjectCard;
