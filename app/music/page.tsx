"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Slider } from "@nextui-org/react";
import { useMetamask } from "@/app/hooks/useMetamask";
import { useListen } from "@/app/hooks/useListen";

const HomePage = () => {
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet, balance },
    } = useMetamask();
    const listen = useListen();

    const MetamaskNotInstall = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const MetamaskInstall = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const MetamaskInstallAndConnected = status !== "pageNotLoaded" && typeof wallet === "string";

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            // User was previously connected, start listening to MM
            if (local) {
                listen();
            }

            const { wallet, balance } = local ? JSON.parse(local) : { wallet: null, balance: null };
            dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
        }
    }, []);

    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [lyrics, setLyrics] = useState<{ time: number; text: string; translation: string }[]>([]);
    const [currentLyric, setCurrentLyric] = useState<string>("");
    const [currentTranslation, setCurrentTranslation] = useState<string>("");

    const audioRef = useRef<HTMLAudioElement | null>(null);

    const loadTrackAndLyrics = async () => {
        try {
            const trackResponse = await fetch("/api/music");
            const trackData = await trackResponse.json();
            if (trackData.url) {
                setCurrentTrack(trackData.url);
            }

            const lyricsResponse = await fetch("/api/lyrics");
            const lyricsData = await lyricsResponse.json();
            if (lyricsData.lyrics) {
                const parsedLyrics = parseLyrics(lyricsData.lyrics);
                setLyrics(parsedLyrics);
            }
        } catch (error) {
            console.error("Error loading music or lyrics:", error);
        }
    };

    useEffect(() => {
        loadTrackAndLyrics();
    }, []);

    const parseLyrics = (lyrics: string) => {
        const lyricLines = lyrics.split("\n");
        return lyricLines
            .map((line) => {
                const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
                if (match) {
                    const time = parseInt(match[1], 10) * 60 + parseInt(match[2], 10) + parseInt(match[3], 10) / 1000;
                    const [englishText, translation] = match[4].split(/(?=\s\[)/);
                    return {
                        time,
                        text: englishText.trim(),
                        translation: translation?.trim() || "",
                    };
                }
                return null;
            })
            .filter(Boolean) as { time: number; text: string; translation: string }[];
    };

    const updateProgress = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration)) {
            const currentTime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;

            setProgress((currentTime / duration) * 100);
            setDuration(currentTime);

            const currentLine = lyrics.find((lyric) => lyric.time > currentTime) || lyrics[lyrics.length - 1];
            if (currentLine) {
                setCurrentLyric(currentLine.text);
                setCurrentTranslation(currentLine.translation);
            }
        }
    };

    const togglePlayPause = () => {
        if (playing) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setPlaying(!playing);
    };

    const handleSliderChange = (value: number | number[]) => {
        if (Array.isArray(value)) {
            return;
        }
        if (audioRef.current) {
            const newTime = (value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(value);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full text-center space-y-6">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Music Player</h2>

                {currentTrack ? (
                    <div>
                        <audio ref={audioRef} src={currentTrack} onTimeUpdate={updateProgress} />
                        <Button
                            onPress={togglePlayPause}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                        >
                            {playing ? "Pause" : "Play"}
                        </Button>

                        <div className="mt-6">
                            <Slider
                                value={progress}
                                minValue={0}
                                maxValue={100}
                                step={1}
                                onChange={handleSliderChange}
                                className="w-full"
                            />
                        </div>

                        <p className="text-600 mt-2">Duration: {Math.round(duration)} seconds</p>

                        {/* Display synchronized lyrics */}
                        <div className="mt-6 lyrics text-xl">
                            <p className="text-700 font-semibold">{currentLyric}</p>
                            <p className="text-500">{currentTranslation}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading track...</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
