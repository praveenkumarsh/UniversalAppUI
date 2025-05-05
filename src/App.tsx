// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/helpers/PrivateRoute";
import AuthRedirector from "./components/helpers/AuthRedirector";
import OAuthSuccess from "./pages/OAuthSuccess";
import Profile from "./components/dashboard/Profile";
import ViewPaste from "./components/dashboard/ViewPaste";
import RedirectShortUrl from "./components/dashboard/RedirectShortUrl";

export default function App() {
  return (
    <Router>
      <AuthRedirector />
      <Routes>
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/paste/:key" element={<ViewPaste />} />
        <Route path="/shorturl/:shortCode" element={<RedirectShortUrl />} />
        <Route
          path="/:app?"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
