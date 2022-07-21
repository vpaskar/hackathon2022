import * as React from "react";
import { Routes, Route } from "react-router-dom";
import KubeconfigReader from "../kubeconfigReader/kubeconfigReader";
import About from "../about/about";
import {createBrowserHistory} from "history";
import Editor from "../editor/editor";

function App() {
    const history = createBrowserHistory();
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<KubeconfigReader history={history}/>} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </div>
    );
}

export default App;