"use client"
import React, {useState, useEffect} from 'react';
// import {Card, CardBody} from "@nextui-org/react";

const DashboardClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const day = time.toLocaleDateString(undefined, {weekday: 'long'});
    const date = time.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'});

    return (


                <div>
                    <div className="clock flex flex-row gap-4 justify-center">
                        <div className="date">
                            <span className="day">{day}</span>
                            <span className="date">{date}</span>
                        </div>
                        <div className="time">
                            <span className="hours">{hours < 10 ? '0' + hours : hours}</span>:
                            <span className="minutes">{minutes < 10 ? '0' + minutes : minutes}</span>:
                            <span className="seconds">{seconds < 10 ? '0' + seconds : seconds}</span>
                        </div>

                    </div>
                </div>

    );
};

export default DashboardClock;

