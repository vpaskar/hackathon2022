import * as React from "react";
import { Routes, Route } from "react-router-dom";
import KubeconfigReader from "../kubeconfigReader/kubeconfigReader";
import Editor from "../editor/editor";
import About from "../welcome/about";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/reader" element={<KubeconfigReader />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </div>
    );
}

export default App;