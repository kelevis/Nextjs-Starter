"use client"
import React from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { PiSunDim } from "react-icons/pi";
export default function BtnThemeSwitch() {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["light"]));
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setSelectedKeys(new Set([localStorage.getItem("theme")||'light']))
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const handleAction = (key:string) => {
        setTheme(key)
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button
                    // variant="bordered"
                    variant="bordered"
                    className="capitalize"
                    isIconOnly={true}
                >
                    <PiSunDim/>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys as any}
                onAction={(key) => {
                    handleAction(key as string)  //断言,判定为string类型
                }}
            >
                <DropdownItem key="light">light</DropdownItem>
                <DropdownItem key="dark">dark</DropdownItem>
                <DropdownItem key="purple-dark">purple-dark</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
