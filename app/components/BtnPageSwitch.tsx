"use client"
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import {useRouter} from 'next/navigation';
import {TiThSmall} from "react-icons/ti";
import {useIconStyle} from '@/app/components/useIconStyle';


export default function MultiPageNavButton() {
    const router = useRouter();
    const iconStyle = useIconStyle();


    const handleAction = (path: string) => {
        router.push(path);
    };

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


            </DropdownMenu>
        </Dropdown>
    );
}
