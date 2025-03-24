'use client';
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";

const socket = io("https://webrtc-server-6yco.onrender.com"); // 连接信令服务器
const ICE_SERVERS = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function WebRTCChat() {
    const [roomId, setRoomId] = useState("");
    const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [peerConnections, setPeerConnections] = useState<{ [key: string]: RTCPeerConnection }>({});
    const [mediaEnabled, setMediaEnabled] = useState({ video: true, audio: true });

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStream = useRef<MediaStream | null>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    const {dispatch} = useMetamask();
    const listen = useListen();

    useEffect(() => {
        if (typeof window !== undefined) {
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            // user was previously connected, start listening to MM
            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！");

    }, []);

    useEffect(() => {
        socket.on("room-joined", ({ roomId, users }) => {
            console.log(`已加入房间: ${roomId}, 当前用户: ${users.join(", ")}`);
            setJoinedRoom(roomId);
            setUsers(users);
            startLocalStream();
        });

        // socket.on("user-joined", async ({ userId }) => {
        //     console.log(`用户加入: ${userId}`);
        //     setUsers((prevUsers) => [...prevUsers, userId]);
        //     if (Object.keys(peerConnections).length === 1) {
        //         console.log(`为用户 ${userId} 创建 offer`);
        //         await createOffer(userId);
        //     }
        // });
        socket.on("user-joined", async ({ userId }) => {
            console.log(`用户加入: ${userId}`);
            setUsers((prevUsers) => [...prevUsers, userId]);
            // 无论 peerConnections 的数量如何，都尝试创建 offer
            console.log(`为用户 ${userId} 创建 offer`);
            await createOffer(userId);
        });

        socket.on("user-left", ({ userId }) => {
            console.log(`用户离开: ${userId}`);
            setUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
            closePeerConnection(userId);
        });

        socket.on("offer", async ({ from, offer }) => {
            console.log(`收到来自 ${from} 的 offer`);
            await handleOffer(from, offer);
        });

        socket.on("answer", async ({ from, answer }) => {
            console.log(`收到来自 ${from} 的 answer`);
            await peerConnections[from].setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.on("ice-candidate", async ({ from, candidate }) => {
            console.log(`收到来自 ${from} 的 ICE 候选者`);
            await peerConnections[from].addIceCandidate(new RTCIceCandidate(candidate));
        });

        return () => {
            socket.off("room-joined");
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };
    }, [peerConnections]);

    const startLocalStream = async () => {
        try {
            console.log("开始获取本地视频流");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            console.log("本地视频流获取成功");
        } catch (error) {
            console.error("获取本地视频失败:", error);
        }
    };

    // const createPeerConnection = (userId: string) => {
    //     console.log(`为用户 ${userId} 创建 RTCPeerConnection`);
    //     const peerConnection = new RTCPeerConnection(ICE_SERVERS);
    //     localStream.current?.getTracks().forEach((track) => {
    //         console.log(`将本地轨道 ${track.kind} 添加到 RTCPeerConnection`);
    //         peerConnection.addTrack(track, localStream.current!);
    //     });
    //
    //     peerConnection.ontrack = (event) => {
    //         console.log(`收到来自 ${userId} 的远程流`);
    //         const remoteVideo = document.createElement("video");
    //         remoteVideo.srcObject = event.streams[0];
    //         remoteVideo.autoplay = true;
    //         remoteVideo.playsInline = true;
    //         remoteVideo.className = "w-1/2 rounded-md shadow-md";
    //         videoContainerRef.current?.appendChild(remoteVideo);
    //         console.log(`远程视频流已添加到 DOM`);
    //     };
    //
    //     peerConnection.onicecandidate = (event) => {
    //         if (event.candidate) {
    //             console.log(`发送 ICE 候选者给 ${userId}`);
    //             socket.emit("ice-candidate", { roomId, to: userId, candidate: event.candidate });
    //         }
    //     };
    //
    //     setPeerConnections((prev) => ({ ...prev, [userId]: peerConnection }));
    //     return peerConnection;
    // };
    const createPeerConnection = (userId: string) => {
        console.log(`为用户 ${userId} 创建 RTCPeerConnection`);
        const peerConnection = new RTCPeerConnection(ICE_SERVERS);
        if (!localStream.current) {
            console.error("本地流未初始化");
            return;
        }
        localStream.current.getTracks().forEach((track) => {
            console.log(`将本地轨道 ${track.kind} 添加到 RTCPeerConnection`);
            peerConnection.addTrack(track, localStream.current!);
        });

        peerConnection.ontrack = (event) => {
            console.log(`收到来自 ${userId} 的远程流`, event.streams[0]);
            if (!event.streams || event.streams.length === 0) {
                console.error("远程流为空");
                return;
            }
            const remoteVideo = document.createElement("video");
            remoteVideo.srcObject = event.streams[0];
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            remoteVideo.className = "w-1/2 rounded-md shadow-md";
            videoContainerRef.current?.appendChild(remoteVideo);
            console.log(`远程视频流已添加到 DOM`);
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`发送 ICE 候选者给 ${userId}`);
                socket.emit("ice-candidate", { roomId, to: userId, candidate: event.candidate });
            }
        };

        setPeerConnections((prev) => ({ ...prev, [userId]: peerConnection }));
        return peerConnection;
    };

    const createOffer = async (userId: string) => {
        console.log(`为用户 ${userId} 创建 offer`);
        const peerConnection = createPeerConnection(userId);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", { roomId, to: userId, offer });
        console.log(`offer 已发送给 ${userId}`);
    };

    const handleOffer = async (from: string, offer: RTCSessionDescriptionInit) => {
        console.log(`处理来自 ${from} 的 offer`);
        const peerConnection = createPeerConnection(from);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { roomId, to: from, answer });
        console.log(`answer 已发送给 ${from}`);
    };

    const closePeerConnection = (userId: string) => {
        console.log(`关闭与 ${userId} 的连接`);
        peerConnections[userId]?.close();
        setPeerConnections((prev) => {
            const newConnections = { ...prev };
            delete newConnections[userId];
            return newConnections;
        });

        // 移除视频窗口
        const videoElements = videoContainerRef.current?.querySelectorAll("video") || [];
        videoElements.forEach((video) => {
            if (video.srcObject instanceof MediaStream) {
                video.srcObject.getTracks().forEach((track) => track.stop());
                video.remove();
            }
        });
        console.log(`与 ${userId} 的连接已关闭`);
    };

    const toggleVideo = () => {
        if (localStream.current) {
            localStream.current.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
            setMediaEnabled((prev) => ({ ...prev, video: !prev.video }));
        }
    };

    const toggleAudio = () => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
            setMediaEnabled((prev) => ({ ...prev, audio: !prev.audio }));
        }
    };

    const joinRoom = () => {
        if (!roomId.trim()) return;
        console.log(`尝试加入房间: ${roomId}`);
        socket.emit("join-room", roomId);
    };

    const leaveRoom = () => {
        console.log(`离开房间: ${roomId}`);
        socket.emit("leave-room", { roomId });
        setJoinedRoom(null);
        setUsers([]);
        setRoomId("");
        Object.keys(peerConnections).forEach(closePeerConnection);
    };

    return (
        <div className="p-6 max-w-lg mx-auto shadow-lg rounded-xl">
            <h1 className="text-2xl font-bold mb-4">WebRTC 音视频聊天室</h1>

            {joinedRoom ? (
                <>
                    <p className="text-green-600">已加入房间: {joinedRoom}</p>
                    <h2 className="text-lg font-semibold mt-4">在线用户:</h2>
                    <ul className="list-disc pl-6">
                        {users.map((user) => (
                            <li key={user}>{user}</li>
                        ))}
                    </ul>

                    <div ref={videoContainerRef} className="flex flex-wrap gap-4 mt-4">
                        <video ref={localVideoRef} autoPlay playsInline className="w-1/2 rounded-md shadow-md" />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button onClick={toggleVideo} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600">
                            {mediaEnabled.video ? "关闭视频" : "开启视频"}
                        </button>
                        <button onClick={toggleAudio} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                            {mediaEnabled.audio ? "关闭语音" : "开启语音"}
                        </button>
                        <button onClick={leaveRoom} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">
                            退出房间
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <input type="text" placeholder="输入房间 ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full p-2 border rounded-md" />
                    <button onClick={joinRoom} className="mt-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
                        加入房间
                    </button>
                </>
            )}
        </div>
    );
}