import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Startpage from "./pages/Startpage";
import Aboutpage from "./pages/Aboutpage";
import Servicepage from "./pages/Servicepage";
import Contactpage from "./pages/Contactpage";
import Users from "./pages/Users";
import Adminpanel from "./pages/Adminpanel";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Charts from "./pages/Charts";
import Analysis from "./pages/Analysis";
import SkinAnalysis from "./pages/SkinAnalysis";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Startpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/service" element={<Servicepage />} />
        <Route path="/contact" element={<Contactpage />} />
        <Route path="/users" element={<Users/>} />
        <Route path="/admin" element={<Adminpanel/>} />
        <Route path="/history" element={<History/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/charts" element={<Charts/>} />
        <Route path="/analysis" element={<Analysis/>} />
        <Route path="/skinanalysis" element={<SkinAnalysisAnalysis/>} />
      </Routes>
    </Router>
  );
}

export default App;
