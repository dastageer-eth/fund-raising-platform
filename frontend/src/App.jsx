import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListProject from "./pages/ListProject";
import ListedProjects from "./pages/ListedProjects";
import Multisend from "./pages/Multisend";
import Home from "./pages/Home";
import WithdrawAssets from "./pages/WithdrawAssets";
import UserProfile from "./pages/UserProfile";
import ProjectDetails from "./pages/ProjectDetails";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-project" element={<ListProject />} />
        <Route path="/project-details/:id" element={<ProjectDetails />} />
        <Route path="/listed-projects" element={<ListedProjects />} />
        <Route path="/multisend" element={<Multisend />} />
        <Route path="/withdraw-assets" element={<WithdrawAssets />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
