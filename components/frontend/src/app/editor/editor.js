import React from "react";
import './editor.css';
import {Container} from "@mui/material";
import ResponsiveAppBar from "../components/header"
import TerminalController from "../components/terminal";
import EventSender from "../components/eventSender";

function Editor() {
  return (
    <div className="Editor">
      <header className="Editor-header">
        <Container component="main" maxWidth="xl">
          <ResponsiveAppBar />
          <EventSender />
          <TerminalController />
        </Container>
      </header>
    </div>
  );
}

export default Editor;
