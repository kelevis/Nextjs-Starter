import React, { useState, useEffect } from 'react';
import {dialogActionsClasses} from "@mui/material";

function App() {
    const [color, setColor] = useState('black');
    const [time, setTime] = useState(getCurrentTime());

    useEffect(() => {
        const interval = setInterval(() => {
            setColor(color => color === 'black' ? 'green' : 'black');
            setTime(getCurrentTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function getCurrentTime() {
        const date = new Date();
        return date.toLocaleTimeString();
    }

    return (
        <div>

            <h2 style={{ color }}>Please connect to Metamask Wallet.
                <br/>
                Time: {time}
            </h2>



        </div>

);
}

export default App;
