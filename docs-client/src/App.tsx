import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DocView from "./pages/DocView";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/doc/:id" element={<DocView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
