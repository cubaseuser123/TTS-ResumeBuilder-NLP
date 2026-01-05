//import './App.css';
// import Registration from './Registration';
import First from "./First";
import ResumeEditor from "./pages/ResumeEditor";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Registration/>; */}
        <Route path="/" element={<First />} />
        <Route path="/editor" element={<ResumeEditor />} />
        <Route path="/resume/:slug" element={<ResumeEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
