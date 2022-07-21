import React, {useState} from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import styles from "./overrides.css";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const TerminalController = (props = {}) => {
  const [terminalLineData] = useState([
    {type: LineType.Input, value: 'Log line 1'},
  ]);

  const [terminalHeader, setTerminalHeader] = useState("Function Logs");

  const handleChange = (event) => {
    setTerminalHeader("Function logs from " + event.target.value);
  };
  
  return (
    <div>
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
              href="/"
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
              Receive Events
        </Typography>
      </Box>
    <Box sx={{
          display: 'flex',
          m: 1,
          p: 1,
          justifyContent: 'center',
        }}>
      <FormControl sx={{ m: 1, minWidth: 360}}>
        <InputLabel id="demo-simple-select-helper-label">Function</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={"age"}
          label="Function"
          onChange={handleChange}
        >
          <MenuItem value={"Function1"}>Function1</MenuItem>
          <MenuItem value={"Function2"}>Function2</MenuItem>
          <MenuItem value={"Function3"}>Function3</MenuItem>
        </Select>
        <FormHelperText>Select Function Name</FormHelperText>
      </FormControl>
      </Box>
      <Terminal
        name={terminalHeader}
        classname={styles}
        colorMode={ ColorMode.Dark }  
        lineData={ terminalLineData } />
    </div>
  )
};

export default TerminalController;

