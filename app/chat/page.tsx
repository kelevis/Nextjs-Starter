"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useListen} from "@/app/hooks/useListen";
import {useMetamask} from "@/app/hooks/useMetamask";
import {Button, Input} from "@nextui-org/react";
import * as config from "@/config";

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
    const messagesEndRef = useRef<HTMLTextAreaElement>(null);

    const {dispatch, state: {status, isMetamaskInstalled, wallet, balance},} = useMetamask();
    const listen = useListen();

    function testNetwork() {
        // 在新窗口中发起一个 HTTPS 请求
        const newWindow = window.open(`https://36.138.57.57:5050`, '_blank');
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
        const ws = new WebSocket(`wss://36.138.57.57:5050/ws/${userId}`);

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


    }, [messages]); // 依赖 userId，当 userId 变化时重新执行

    const sendMessage = () => {
        if (socket && message && targetUserId) {
            const msg: Message = {
                UserId: userId,
                targetUserId: targetUserId,
                content: message,
            };
            socket.send(JSON.stringify(msg));
            setMessages((prevMessages) => [...prevMessages, `${userId}: ${message}`]);
            // setMessage('');
        }
    };

    return (
        <div className="w-full h-full ">

            {!https && (
                <div className="mx-auto px-auto text-center space-y-2 sm:py-20 sm:px-6 lg:px-8">
                    <h1>Enter your User ID to connect</h1>
                    <div className="flex justify-center">
                        <form className="flex flex-col gap-2">
                            <Button color="primary" variant="flat" onClick={testNetwork}>
                                Test Network
                            </Button>
                        </form>
                    </div>


                </div>
            )}

            {https && !connected && (
                <div className="mx-auto px-auto text-center space-y-2 sm:py-20 sm:px-6 lg:px-8">
                    <h1>Enter your User ID to connect</h1>
                    <div className="flex justify-center">
                        <form className="flex flex-col gap-2">
                            <Input
                                variant="bordered"
                                type="text"
                                placeholder="Your User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                width="300px" // 设置输入框的宽度
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // 阻止表单提交
                                        connectWeb(userId); // 连接WebSocket
                                    }
                                }}
                            />
                            <Button color="primary" variant="flat" onClick={() => connectWeb(userId)}>
                                Send
                            </Button>
                        </form>
                    </div>


                </div>
            )}


            {https && connected && (
                <div className="mx-auto px-auto text-center space-y-2 sm:py-20 sm:px-6 lg:px-8">
                    <div className="flex w-full space-x-2 space-y-2 my-4 gap-6 text-center">


                        <form className="flex flex-col text-center gap-3">
                            <h1>WebSocket Chat </h1>
                            <h2>Connected as {userId} </h2>
                            <Input
                                variant="bordered"
                                type="text"
                                placeholder="Target User ID"
                                value={targetUserId}
                                onChange={(e) => setTargetUserId(e.target.value)}
                            />
                            <Input
                                variant="bordered"
                                type="text"
                                placeholder="Enter a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            {/*<button onClick={sendMessage}>Send</button>*/}
                            <Button color="primary" variant="flat" onClick={sendMessage}>
                                Send
                            </Button>


                            {/*<ul>*/}
                            {/*    {messages.map((msg, index) => (*/}
                            {/*        <li key={index}>{msg}</li>*/}
                            {/*    ))}*/}
                            {/*</ul>*/}

                        </form>

                        <textarea
                            ref={messagesEndRef}
                            readOnly
                            value={messages.join('\n')}
                            className="w-full h-84 p-2 mt-2 border rounded"
                        />


                    </div>


                </div>
            )}


        </div>
    );
}
