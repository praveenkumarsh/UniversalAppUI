// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/helpers/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/:app?"
          element={
            // <PrivateRoute>
              <Home />
            // </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
