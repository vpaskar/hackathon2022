import React from "react";
import {Container} from "@mui/material";
import TerminalController from "../components/terminal";
import EventSender from "../components/eventSender";

function SendAndReceive() {
  return (
    <div className="Editor">
      <header className="Editor-header">
        <Container component="main" maxWidth="xl">
          <EventSender />
          <TerminalController />
        </Container>
      </header>
    </div>
  );
}

export default SendAndReceive;