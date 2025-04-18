import { Routes, Route } from "react-router-dom";
import Home from "./routes/home";
// import Login from "./routes/login";

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      {/* <Route path="/login" element={<Login />} /> */}
    </Routes>
  );
}