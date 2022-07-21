import { Link } from "react-router-dom";
import { Button } from "@mui/material"; 

function Linker(props) {
    return (
        <Link to={props.link}>
            <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
            >
                {props.name}
            </Button>
        </Link>
        
    )
}

export default Linker;