import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import RedirectComponent from "./components/Redirect";
import MainPage from "./components/MainPage";
import NotFoundComponent from "./components/NotFound";

function App() {
    return (
        <Router><Routes>
            <Route path="/notfound" element={<NotFoundComponent/>}/>
            <Route path=":shortUrl" element={<RedirectComponent/>}/>
            <Route path="/" element={<MainPage/>}/>
        </Routes></Router>
    );
}

export default App;
