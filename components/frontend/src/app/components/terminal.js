import React, {useState, useEffect} from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import styles from "./overrides.css";
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { Function } from "../../api/function";

const functionClient = new Function();

const TerminalController = ({shouldUpdateLogs, setShouldUpdateLogs}) => {
  const [terminalLineData, setTerminalLineData] = useState([
    {type: LineType.Input, value: ''},
  ]);

  const [terminalHeader, setTerminalHeader] = useState("Function Logs");
  const [functionList, setFunctionList] = useState([]);
  const [func, setFunc] = useState("");
  const [funcNamespace, setFuncNamespace] = useState("");

  useEffect(() => {
    let mounted = true;
    functionClient.list()
        .then(items => {
        if(mounted) {
            setFunctionList(items.data)
        }
        })
    return () => mounted = false;
  }, [])

  const getLogs = (func, funcNamespace) => {
    functionClient.logs(func, funcNamespace)
        .then(items => {
            setTerminalLineData([
                {type: LineType.Output, value: items.data},
            ])
            setShouldUpdateLogs(false);
        })
  };

  const handleChange = (event) => {
    setFunc(event.target.value);
    setTerminalHeader("Function logs from " + event.target.value);
    const nameSpace = functionList.find(ele => ele.name === event.target.value).namespace;
    setFuncNamespace(nameSpace);
    getLogs(event.target.value, nameSpace);
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
          value={func}
          label="Function"
          onChange={handleChange}
        >
          {functionList.map((func, id) => (
               <MenuItem key={id} value={func.name}>{func.name}</MenuItem>
          ))}
        </Select>
        <FormHelperText>Select Function Name</FormHelperText>
      </FormControl>
      </Box>
      <Terminal
        name={terminalHeader}
        classname={styles}
        colorMode={ ColorMode.Dark }  
        lineData={ terminalLineData } />
      {shouldUpdateLogs && getLogs(func, funcNamespace)}
    </div>
  )
};

export default TerminalController;

