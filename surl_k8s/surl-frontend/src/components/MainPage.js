import {createTheme, ThemeProvider} from "@mui/material/styles";
import PageTitle from "./PageTitel";
import ShortenForm from "./ShortenForm";
import React from "react";

function MainPage() {
    const theme = createTheme({
        spacing: 16,
    });
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
    };

    return (
        <ThemeProvider theme={theme}>
            <PageTitle title="SURL"/>
            <div style={containerStyle}>
                <ShortenForm/>
            </div>
        </ThemeProvider>
    )

}

export default MainPage;