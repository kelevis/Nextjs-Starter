"use client";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import SimplePeer from "simple-peer";

const VoiceChat = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const localStream = useRef<HTMLAudioElement | null>(null);
    const peersRef = useRef<any[]>([]);
    const [localAudioEnabled, setLocalAudioEnabled] = useState(true);

    useEffect(() => {
        const socketInstance = io("http://localhost:6060/socket.io/");
        setSocket(socketInstance);

        // 添加连接成功和断开连接的日志
        socketInstance.on("connect", () => {
            console.log("WebSocket connected:", socketInstance.id);
        });

        socketInstance.on("disconnect", (reason) => {
            console.log("WebSocket disconnected:", reason);
        });

        socketInstance.on("signal", handleSignal);

        return () => {
            socketInstance.disconnect();
        };
    }, []);


    const handleSignal = ({ from, signal }: { from: string; signal: any }) => {
        const peer = peersRef.current.find(p => p.peerId === from);
        if (peer) {
            peer.peer.signal(signal);
        }
    };

    const joinRoom = async () => {
        if (!roomId || !socket) return;

        socket.emit("join-room", roomId);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localStream.current) {
            localStream.current.srcObject = stream;
        }

        setJoined(true);

        socket.on("user-joined", handleUserJoined);
    };

    const handleUserJoined = (userId: string) => {
        const peer = createPeer(userId, socket?.id || '');
        peersRef.current.push({
            peerId: userId,
            peer
        });
    };

    const createPeer = (userId: string, callerId: string) => {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: localStream.current?.srcObject as MediaStream
        });

        peer.on("signal", (signal:any) => {
            socket?.emit("signal", {
                target: userId,
                from: callerId,
                signal
            });
        });

        peer.on("stream", (stream:any) => {
            const audio = document.createElement("audio");
            audio.srcObject = stream;
            audio.play();
        });

        return peer;
    };

    const toggleAudio = () => {
        const enabled = !localAudioEnabled;
        if (localStream.current) {
            const audioTracks = (localStream.current.srcObject as MediaStream)?.getAudioTracks();
            if (audioTracks && audioTracks.length > 0) {
                audioTracks[0].enabled = enabled;
            }
        }
        setLocalAudioEnabled(enabled);
    };



    return (
        <div>
            {!joined ? (
                <div>
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <div>
                    <audio ref={localStream} autoPlay muted />
                    <button onClick={toggleAudio}>
                        {localAudioEnabled ? "Mute" : "Unmute"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default VoiceChat;
