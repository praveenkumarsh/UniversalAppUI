// filepath: e:\Personal\MiniProjects\FullStackDocumentManagement\Frontend\DocumentManagement\Doc-Project\app\App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home";

export default function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard/:appName" element={<Home />} />
    </Routes>
  );
}