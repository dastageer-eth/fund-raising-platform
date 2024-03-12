import { useNavigate } from "react-router-dom";
import ConnectButton from "../components/connectButton";

const Home = () => {
  let navigate = useNavigate();
  return (
    <>
      <ConnectButton />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <button
          onClick={() => navigate("/listed-projects")}
          className="w-56 text-white bg-indigo-500 hover:bg-indigo-700 font-bold py-4 px-8 rounded-full m-2 text-lg"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate("/list-project")}
          className="w-56 text-white bg-red-500 hover:bg-red-700 font-bold py-4 px-8 rounded-full text-lg m-2"
        >
          List projects
        </button>
        <button
          onClick={() => navigate("/multisend")}
          className="w-56 text-white bg-gray-500 hover:bg-gray-700 font-bold py-4 px-8 rounded-full m-2 text-lg"
        >
          Multisend
        </button>
        <button
          onClick={() => navigate("/withdraw-assets")}
          className="w-56 text-white bg-blue-500 hover:bg-blue-700 font-bold py-4 px-8 rounded-full text-lg"
        >
          Withdraw Assets
        </button>
      </div>
    </>
  );
};

export default Home;
