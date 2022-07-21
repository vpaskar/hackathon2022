import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import { CleanEventTypes } from "../../api/cleanEventTypes";
import { Publisher } from "../../api/publisher";

const cleanEventTypesClient = new CleanEventTypes();
const publisherClient = new Publisher();

export default function EventSender(props) {
  const [eventTypeList, setEventTypeList] = React.useState([]);
  const [eventType, setEventType] = React.useState("");
  const [value, setValue] = React.useState('foo:bar');

  const handleChangeText = (event) => {
    setValue(event.target.value);
  };

  const handleChange = (event) => {
    setEventType(event.target.value);
  };

  const handleSendEvent = () => {
    if (eventType !== "") { 
      publisherClient.publishEvent(eventType, value)
        .then((res) => {
          props.setShouldUpdateLogs(true);
        });
    }
  }

  React.useEffect(() => {
    let mounted = true;
    cleanEventTypesClient.list()
      .then(items => {
        if(mounted) {
          setEventTypeList(items.data);
        }
      })
    return () => mounted = false;
  }, [])

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
              Send Events
        </Typography>
      </Box>
      <Box sx={{
          display: 'flex',
          m: 1,
          p: 1,
          justifyContent: 'center',
        }}>
      <FormControl sx={{ m: 1, minWidth: 360 }}>
        <InputLabel id="demo-simple-select-helper-label">Event Type</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={eventType}
          label="Event Type"
          onChange={handleChange}
        >
          {eventTypeList.map((eventType, id) => (
               <MenuItem key={id} value={eventType}>{eventType}</MenuItem>
          ))}
        </Select>
        <FormHelperText>Select Event Type</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 480 }}>
      <TextField
          id="outlined-multiline-flexible"
          maxRows={4}
          value={value}
          onChange={handleChangeText}
        />
        <FormHelperText>Enter Event Data</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 2, minWidth: 120 }}>
        <Button variant="contained" size="large" onClick={handleSendEvent}>Send Event</Button>
      </FormControl>
      </Box>
    </div>
  );
}
