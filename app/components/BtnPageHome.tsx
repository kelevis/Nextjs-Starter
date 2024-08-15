"use client"
import React, {useEffect, useState} from "react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { RiHomeLine } from "react-icons/ri";
import { useIconStyle } from '@/app/components/useIconStyle';
import {useTheme} from "next-themes";  // Adjust the path as necessary

export default function NavButton() {
    const [mounted, setMounted] = useState(false);
    const iconStyle = useIconStyle();

    useEffect(() => {
        // Set mounted to true after component has mounted
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or return a loader/spinner if desired
    }

    return (
        <Link href="/" passHref>
            {/*<Button variant="bordered" className="capitalize" isIconOnly={true}>*/}
            <Button variant="light" className="capitalize" isIconOnly={true} >
               <RiHomeLine style={iconStyle}/>
            </Button>
        </Link>
    );
}
