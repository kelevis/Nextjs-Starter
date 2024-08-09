"use client";
import React, {useEffect, useState} from 'react';
import {Button} from "@nextui-org/react";

const WeatherMonitor: React.FC = () => {
    const [city, setCity] = useState('Chengdu');
    const [weather, setWeather] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async (city: string) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4d91476cc231f72effb0b1663f085be0&lang=zh_cn`, {cache: 'no-store'});
            const data = await response.json();
            if (response.ok) {
                setWeather(data);
                setError(null);
            } else {
                setWeather(null);
                setError(data.message || 'Error fetching weather data');
            }
        } catch (error) {
            setWeather(null);
            setError('Error fetching weather data');
        }
    };

    useEffect(() => {
        fetchWeather(city);

        // Set up interval to fetch weather every 1 minute
        const interval = setInterval(() => fetchWeather(city), 60000);

        return () => clearInterval(interval);  // Cleanup interval on component unmount
    }, [city]);

    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.target.value);
    };

    const handleCitySubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchWeather(city);
    };

    return (
        <div className="p-4">
            <h1 className="text-fuchsia-200 font-bold mb-4">Weather</h1>

            <form onSubmit={handleCitySubmit} className="mb-4 space-x-2">
                <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    className="p-2 border border-gray-300 rounded"
                    placeholder="English City name"
                />
                <Button type="submit" color="primary" variant="flat" radius={"sm"} >Fetch Weather</Button>
            </form>


            {error && <p className="text-red-500">{error}</p>}
            {weather && (
                <div>
                    <h2 className="text-lg font-semibold">{weather.name}</h2>
                    <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Weather: {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                </div>
            )}
        </div>
    );
};

export default WeatherMonitor;
