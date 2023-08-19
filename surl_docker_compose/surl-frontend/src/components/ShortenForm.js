import React, {useState} from 'react';
import {Button, TextField} from '@mui/material';
import {makeStyles} from '@mui/styles';
import CopyButton from "./CopyButton";

const backend = process.env.REACT_APP_back_url;
const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        margin: '4rem',
    },
    textField: {
        width: '50%',
    },
    shortTextField: {
        width: '20%',
    },
    shortUrlContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        margin: '2rem'
    }
}));


function ShortenForm() {
    const classes = useStyles();
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');

    const handleUrlChange = (event) => {
        setLongUrl(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch(backend.concat('/add'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: longUrl}),
        });
        const data = await response.text();
        setShortUrl(process.env.REACT_APP_front_url.concat("/".concat(data.substring(17))));
    };

    return (
        <form onSubmit={handleFormSubmit} className={classes.form}>
            <TextField
                label="Enter Long URL"
                variant="outlined"
                value={longUrl}
                onChange={handleUrlChange}
                className={classes.textField}
            />
            <br/>
            <Button
                type="submit"
                variant="contained"
                color="primary"
            >
                Generate Short URL
            </Button>
            <br/>
            {shortUrl && (
                <div className={classes.shortUrlContainer}>
                    <TextField
                        label="Short URL"
                        variant="outlined"
                        value={shortUrl}
                        InputProps={{
                            readOnly: true,
                        }}
                        className={classes.shortTextField}
                    />
                    <CopyButton text={shortUrl}/>
                </div>
            )}
        </form>
    );

}

export default ShortenForm;
