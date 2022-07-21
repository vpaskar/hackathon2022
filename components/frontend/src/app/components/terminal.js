import React, {useState} from 'react';
import Terminal, { ColorMode, LineType } from 'react-terminal-ui';
import styles from "./overrides.css"

const TerminalController = (props = {}) => {
  const [terminalLineData] = useState([
    {type: LineType.Output, value: 'Logs from function:'},
    {type: LineType.Input, value: 'Log line 1'},
  ]);
  
  return (
    <div>
      <Terminal
        classname={styles}
        colorMode={ ColorMode.Dark }  
        lineData={ terminalLineData } />
    </div>
  )
};

export default TerminalController;

