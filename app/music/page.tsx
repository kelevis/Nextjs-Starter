"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button, Slider } from "@nextui-org/react";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";

const HomePage = () => {
    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
    const listen = useListen();
    const MetamaskNotInstall = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const MetamaskInstall = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;
    const MetamaskInstallAndConnected = status !== "pageNotLoaded" && typeof wallet === "string";

    useEffect(() => {
        if (typeof window !== undefined) {

            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");
            console.log("local:", local)
            console.log("window:", window)

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！")

    }, []);

    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [lyrics, setLyrics] = useState<{ time: number; text: string; translation: string }[]>([]);
    const [currentLyric, setCurrentLyric] = useState<string>("");
    const [currentTranslation, setCurrentTranslation] = useState<string>("");

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Load track and lyrics
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
        return lyricLines.map((line) => {
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
        }).filter(Boolean) as { time: number; text: string; translation: string }[];
    };

    const updateProgress = () => {
        if (audioRef.current) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            setDuration(audioRef.current.duration);

            // Update current lyric based on currentTime
            const currentTime = audioRef.current.currentTime;
            const currentLine = lyrics.find((lyric) => lyric.time > currentTime);
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
            return; // 如果是数组，直接返回，因为我们不处理数组类型
        }
        if (audioRef.current) {
            const newTime = (value / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(value);
        }
    };

    return (
        <div className="music-player">
            <h2>Music Player</h2>
            {currentTrack ? (
                <div>
                    <audio ref={audioRef} src={currentTrack} onTimeUpdate={updateProgress} />
                    <Button onPress={togglePlayPause}>{playing ? "Pause" : "Play"}</Button>
                    <Slider
                        value={progress}
                        minValue={0}
                        maxValue={100}
                        onChange={handleSliderChange}
                    />
                    <p>Duration: {Math.round(duration)} seconds</p>

                    {/* Display synchronized lyrics */}
                    <div className="lyrics">
                        <p>{currentLyric}</p>
                        <p>{currentTranslation}</p>
                    </div>
                </div>
            ) : (
                <p>Loading track...</p>
            )}
        </div>
    );
};

export default HomePage;
