import React, { useState } from "react";
import {Container} from "@mui/material";
import TerminalController from "../components/terminal";
import EventSender from "../components/eventSender";

function SendAndReceive() {
  const [shouldUpdateLogs, setShouldUpdateLogs] = useState(false);

  return (
    <div className="Editor">
      <header className="Editor-header">
        <Container component="main" maxWidth="xl">
          <EventSender setShouldUpdateLogs={setShouldUpdateLogs}/>
          <TerminalController shouldUpdateLogs={shouldUpdateLogs} setShouldUpdateLogs={setShouldUpdateLogs}/>
        </Container>
      </header>
    </div>
  );
}

export default SendAndReceive;