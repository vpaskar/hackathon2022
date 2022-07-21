import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import styles from './Form.css';

const style = {
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export const Form = ({onSubmit, fields}) => {
    const createElement = (field) => {
        switch (field.type) {
            case 'text-input':
                return <div className="form-group">
                   <TextField sx={{ m: 1, width: 400 }}
                        key={field.name}
                        id={field.name}
                        required
                        size="small"
                        label={field.label}
                    />
                </div>
        }
        return "";
    };


    return (
        <Box sx={style}>
            <form onSubmit={onSubmit}>
                {
                    fields.map((field) => (
                        createElement(field)
                    ))
                }
                <div className="form-group" align="center">
                    <button class={styles.button} type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </Box>
    );
};
export default Form;
