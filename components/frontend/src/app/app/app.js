import * as React from "react";
import {Route, Routes} from "react-router-dom";
import KubeconfigReader from "../kubeconfigReader/kubeconfigReader";
import About from "../about/about";
import {createBrowserHistory} from "history";
import Editor from "../editor/editor";
import {Container} from "@mui/material";
import ResponsiveAppBar from "../components/header";
import SendAndReceive from "../senderAndReceiver/senderAndReceiver"
import { getRoutes } from "../../config/config";

function App() {
    const history = createBrowserHistory();
    const routes = getRoutes().frontEndPath;
    return (
        <div className="App">
            <ResponsiveAppBar />
                <header className="Editor-header">
                    <Container component="main" maxWidth="xl">
                        <Routes>
                            <Route path="/" element={<KubeconfigReader history={history}/>}/>
                            <Route path={routes.sendAndReceive} element={<SendAndReceive history={history}/>}/>
                            <Route path={routes.editor} element={<Editor/>}/>
                            <Route path={routes.about} element={<About/>}/>
                        </Routes>
                    </Container>
                </header>
        </div>
    );
}

export default App;