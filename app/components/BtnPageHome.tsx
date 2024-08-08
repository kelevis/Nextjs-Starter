"use client"
import React from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { RiHomeLine } from "react-icons/ri";
import { useIconStyle } from '@/app/components/useIconStyle';  // Adjust the path as necessary

export default function NavButton() {
    const iconStyle = useIconStyle();
    return (
        <Link href="/" passHref>
            {/*<Button variant="bordered" className="capitalize" isIconOnly={true}>*/}
            <Button variant="light" className="capitalize" isIconOnly={true} >
               <RiHomeLine style={iconStyle}/>
            </Button>
        </Link>
    );
}
