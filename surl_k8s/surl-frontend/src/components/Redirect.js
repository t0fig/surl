import React, { useEffect } from 'react';
import {useParams} from "react-router-dom";
import {CircularProgress} from "@mui/material";

const RedirectComponent = () => {
    let backend = process.env.REACT_APP_back_url;
    const { shortUrl } = useParams()
    const containerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
    };

    useEffect(() => {
        const redirect = async () => {
            try {
                const response =  await fetch(backend.concat(`/${shortUrl}`));
                if(response.status === 404) window.location.replace('/notfound');
                const data =   await response.json();
                window.location.replace(data.LongURL);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        redirect().then();
    }, [shortUrl]);

    return (
        <div style={containerStyle}>
            <CircularProgress size="3vw" />
        </div>
    );
};

export default RedirectComponent;
