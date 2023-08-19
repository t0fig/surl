import React from 'react';

const PageTitle = ({title}) => {
    const pageTitleStyle = {
        fontFamily: "'Roboto', sans-serif",
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '4rem',
    };

    return <h1 style={pageTitleStyle}>{title}</h1>;
};

export default PageTitle;
