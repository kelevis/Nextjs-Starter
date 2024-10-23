"use client"
import React, {useEffect, useState} from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import {useRouter} from 'next/navigation';
import {TiThSmall} from "react-icons/ti";
import {useIconStyle} from '@/app/components/useIconStyle';


export default function MultiPageNavButton() {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const iconStyle = useIconStyle();
    const handleAction = (path: string) => {
        if (path === "/chat") {
            window.open(path, '_blank'); // 在新标签页中打开 /chat 页面
        } else {
            router.push(path); // 正常导航
        }
    };

    useEffect(() => {
        // Set mounted to true after component has mounted
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or return a loader/spinner if desired
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    variant="light"
                    // variant="bordered"
                    className="capitalize"
                    isIconOnly={true}
                >
                    <TiThSmall style={iconStyle}/>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="导航菜单"
                variant="flat"
                onAction={(key) => handleAction(key as string)}
            >
                <DropdownItem key="/hello">Hello</DropdownItem>
                <DropdownItem key="/monitor">Monitor</DropdownItem>
                <DropdownItem key="/weather">Weather</DropdownItem>
                <DropdownItem key="/pageviews">Behavior</DropdownItem>
                <DropdownItem key="/chat">Chat</DropdownItem>
                <DropdownItem key="/chat-voice">ChatVoice</DropdownItem>
                <DropdownItem key="/music">Music</DropdownItem>
                <DropdownItem key="/city">City</DropdownItem>
                <DropdownItem key="/picture">Pic</DropdownItem>


            </DropdownMenu>
        </Dropdown>
    );
}
