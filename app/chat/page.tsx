"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useListen} from "@/app/hooks/useListen";
import {useMetamask} from "@/app/hooks/useMetamask";
import {Button, Input} from "@nextui-org/react";
import dynamic from "next/dynamic"; // 动态导入组件，防止 SSR 问题
import * as config from "@/config";

const EmojiPicker = dynamic(() => import('emoji-picker-react'), {ssr: false}); // 动态加载 Emoji Picker

interface Message {
    UserId: string;
    targetUserId: string;
    content: string;
}

export default function Home() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const [targetUserId, setTargetUserId] = useState<string>('');
    const [userId, setUserId] = useState<string>(''); // 用户输入的 userId
    const [connected, setConnected] = useState<boolean>(false); // 判断是否已连接
    const [https, setHttps] = useState<boolean>(false); // 判断是否已连接
    const [showPicker, setShowPicker] = useState<boolean>(false); // 控制表情选择器的显示
    // const messagesEndRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance}} = useMetamask();
    const listen = useListen();

    function testNetwork() {
        // 在新窗口中发起一个 HTTPS 请求
        // const newWindow = window.open(`https://36.138.57.57:5050`, '_blank');
        const newWindow = window.open(`https:websocket-jpxi.onrender.com`, '_blank');
        // const newWindow = window.open(`https:localhost:8080`, '_blank');
        setHttps(true); // 设置为已测试
        if (newWindow) {
            newWindow.onload = () => {
                console.log('HTTPS request successful');
                newWindow.close(); // 关闭新窗口
                setHttps(true); // 设置为已测试
            };
            newWindow.onerror = () => {
                console.error('Failed to perform HTTPS request');
                newWindow.close(); // 关闭新窗口
            }
        }
    }

    function connectWeb(userId: string) {
        // 检查 userId 是否有效
        if (!userId) {
            console.error('User ID is required to connect to WebSocket');
            return;
        }

        // 创建一个新的 WebSocket 连接
        // const ws = new WebSocket(`wss://36.138.57.57:5050/ws/${userId}`);
        const ws = new WebSocket(`wss://websocket-jpxi.onrender.com/ws/${userId}`);
        // const ws = new WebSocket(`ws://localhost:8080/ws/${userId}`);

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            setConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const messageData: Message = JSON.parse(event.data);

                setMessages((prevMessages) => [
                    ...prevMessages,
                    `${messageData.UserId}: ${messageData.content}`
                ]);
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        };


        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket server');
            setConnected(false);
        };

        // 将新的 WebSocket 连接存储在 state 中
        setSocket((prevSocket) => {
            // 关闭之前的 WebSocket 连接
            if (prevSocket) {
                prevSocket.close();
            }
            return ws;
        });
    }

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }

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
    }, [messages]);

    const sendMessage = () => {
        if (socket && message && targetUserId) {
            const msg: Message = {
                UserId: userId,
                targetUserId: targetUserId,
                content: message,
            };
            socket.send(JSON.stringify(msg));
            setMessages((prevMessages) => [...prevMessages, `${userId}: ${message}`]);
            setMessage('');
        }
    };

    // const onEmojiClick = (event: any, emojiObject: any) => {
    //     setShowPicker(false)
    //     setMessage(message + emojiObject.emoji);
    // };

    const onEmojiClick = (emojiObject: any, event: any) => {
        console.log("Selected emoji:", emojiObject); // 调试输出
        if (emojiObject && emojiObject.emoji) {
            setMessage(prevMessage => prevMessage + emojiObject.emoji);
        } else {
            console.error("Emoji not found in the selected object.");
        }
        setShowPicker(false);
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen p-6">
            {!https && (
                <div className="text-center space-y-4">
                    <h1 className="text-lg font-semibold">The Network is connecting</h1>
                    <Button color="primary" variant="flat" onClick={testNetwork}>
                        Test Network
                    </Button>
                </div>
            )}

            {https && !connected && (
                <div className="text-center space-y-4">
                    <h1 className="text-lg font-semibold">Enter your User ID to connect</h1>
                    <div className="w-full max-w-md">
                        <Input
                            variant="bordered"
                            type="text"
                            placeholder="Your User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    connectWeb(userId);
                                }
                            }}
                        />
                        <Button color="primary" variant="flat" onClick={() => connectWeb(userId)} className="w-full mt-2">
                            Connect
                        </Button>
                    </div>
                </div>
            )}

            {https && connected && (
                <div className="w-full max-w-2xl mx-auto space-y-6 text-center">
                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">WebSocket Chat</h1>

                    {/* Chat messages container */}
                    <div ref={messagesEndRef} className="w-full h-96 p-4 mt-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        {messages.map((msg, index) => {
                            const isSender = msg.startsWith(`${userId}:`); // 判断是否是当前用户发送的消息
                            return (
                                <p key={index} className={isSender
                                    ? "block w-fit max-w-[75%] border-2 border-gray-400 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 break-words mb-2"
                                    : "block w-fit max-w-[75%] border-2 border-purple-dark dark:border-purple-400 bg-purple-100 dark:bg-purple-900 text-purple-dark dark:text-purple-400 rounded-lg px-3 py-2 break-words mb-2"}>
                                    {msg}
                                </p>
                            );
                        })}
                    </div>

                    {/* Target User ID Input */}
                    <div className="w-full">
                        <Input
                            variant="bordered"
                            type="text"
                            placeholder="Target User ID"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            className="mb-4"
                        />
                    </div>

                    {/* Message Input with Emoji Button */}
                    <div className="relative w-full">
                        <Input
                            variant="bordered"
                            type="text"
                            placeholder="Enter a message"
                            value={message}
                            className="mb-4"
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <Button
                            variant="light"
                            onClick={() => setShowPicker((val) => !val)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2"
                        >
                            😀
                        </Button>

                        {showPicker && (
                            <div className="absolute z-10 right-0 bottom-full mb-2">
                                <EmojiPicker onEmojiClick={onEmojiClick} />
                            </div>
                        )}
                    </div>




                    {/* Send Button */}
                    <Button color="primary" variant="flat" onClick={sendMessage} className="w-full py-3">
                        Send
                    </Button>
                </div>
            )}


        </div>



    );
}
