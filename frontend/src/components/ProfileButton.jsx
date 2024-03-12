import { useNavigate } from "react-router-dom";

const ProfileButton = () => {
  let navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/user-profile")}
      className="bg-black p-2 rounded-full m-2 absolute top-0 right-60"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </button>
  );
};

export default ProfileButton;
