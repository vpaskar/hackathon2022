import React, { useState } from "react";
import './kubeconfigReader.css';
import {TextField} from "@mui/material";
import {Button, Box, Typography, Stack, FormControl} from "@mui/material";
import { KubeConfig } from "../../api/kubeConfig";

const kubeConfigClient = new KubeConfig();

function KubeconfigReader(props) {
  const [textValue, setTextValue] = useState(localStorage["kubeconfigPath"]);
  const gotoEditor = () => {
    props.history.push("/editor");
    window.location.reload();
  }

  const onTextChange = e => setTextValue(e.target.value);
  const handleSubmit = () => {
    kubeConfigClient.set(textValue);
    // validate and if ok then redirect else show error
    gotoEditor();
  };
  const handleReset = () => {
    setTextValue("");
    localStorage["kubeconfigPath"] = ""
  }
  return (
    <div className="KubeconfigReader">
      <Box sx={{
          display: 'flex',
          m: 1,
          p: 1,
          justifyContent: 'center',
        }}>
        <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'underline',
              }}
            >
              Provide Kubeconfig
        </Typography>
      </Box>
      <Box sx={{
          display: 'flex',
          m: 1,
          p: 1,
          justifyContent: 'center',
        }}>
          <FormControl sx={{ m: 1, minWidth: 420}}>
      <TextField
          id="outlined-multiline-static"
          label="Kubeconfig content"
          multiline
          rows={10}
          onChange={onTextChange}
        />
        </FormControl>
      </Box>
      <Box sx={{
          display: 'flex',
          m: 1,
          p: 1,
          justifyContent: 'center',
        }}>
        <Stack direction="row" spacing={2}>
        <Button variant="contained" size="large" onClick={handleSubmit}>Submit</Button>
        <Button variant="contained" size="large"  onClick={handleReset}>Reset</Button>
        </Stack>
      </Box>
    </div>
  );
}

export default KubeconfigReader;
