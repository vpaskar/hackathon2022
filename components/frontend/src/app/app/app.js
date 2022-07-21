import * as React from "react";
import {Route, Routes} from "react-router-dom";
import KubeconfigReader from "../kubeconfigReader/kubeconfigReader";
import About from "../about/about";
import {createBrowserHistory} from "history";
import Editor from "../editor/editor";
import {Container} from "@mui/material";
import ResponsiveAppBar from "../components/header";
import EventSender from "../components/eventSender";
import TerminalController from "../components/terminal";

function App() {
    const history = createBrowserHistory();
    return (
        <div className="App">
                <header className="Editor-header">
                    <Container component="main" maxWidth="xl">
                        <ResponsiveAppBar/>
                        <Routes>
                            <Route path="/" element={<KubeconfigReader history={history}/>}/>
                            <Route path="/editor" element={<Editor/>}/>
                            <Route path="/about" element={<About/>}/>
                        </Routes>
                    </Container>
                </header>
            {/*<EventSender/>*/}
            {/*<TerminalController/>*/}
        </div>
    );
}

export default App;