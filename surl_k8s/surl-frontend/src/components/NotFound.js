import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from "@mui/material";
function NotFoundComponent() {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '80vh',
        marginBottom: '2vw',
        fontFamily: "'Roboto', sans-serif",
    };
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/');
    };
    return (
        <div style={containerStyle}>
            <h1>We don't have an URL corresponding to your short URL</h1>
            <Button
                onClick={handleClick}
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
            >
                Generate short URl
            </Button>
        </div>
    );
}
export default NotFoundComponent;