import React, { useState } from "react";
import './kubeconfigReader.css';
import {TextField} from "@mui/material";
import {Button, Paper} from "@mui/material";

function KubeconfigReader(props) {
  const [textValue, setTextValue] = useState(localStorage["kubeconfigPath"]);

  const gotoEditor = () => {
    props.history.push("/editor");
    window.location.reload();
  }

  const onTextChange = e => setTextValue(e.target.value);
  const handleSubmit = () => {
    localStorage["kubeconfigPath"] = textValue;
    // validate and if ok then redirect else show error
    gotoEditor();
  };
  const handleReset = () => {
    setTextValue("");
    localStorage["kubeconfigPath"] = ""
  }
  return (
    <div className="KubeconfigReader">
      <Paper>
        <h2>Form Demo</h2>

        <TextField
          onChange={onTextChange}
          value={textValue}
          label={"Text Value"} //optional
        />

        <Button onClick={handleSubmit}>Submit</Button>
        <Button onClick={handleReset}>Reset</Button>
      </Paper>
    </div>
  );
}

export default KubeconfigReader;
