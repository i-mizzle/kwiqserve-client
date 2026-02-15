import React, { useState, useEffect } from 'react';

const Countdown = ({seconds, className, countdownComplete}) => {

const [countDown, setCountDown] = useState(seconds);

    useEffect(() => {
        let interval = null
        if(countDown > 0) {
            interval = setInterval(() => {
                setCountDown(countDown - 1);
            }, 1000);
        }
        if (countDown === 0) {
            countdownComplete()
        }

        return () => clearInterval(interval);
    }, [countDown, countdownComplete]);

    return (
        <span className={className}>{countDown}</span>
    )
}

export default Countdown