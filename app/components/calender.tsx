"use client"
import React from "react";
import {Calendar} from "@nextui-org/react";
import {parseDate} from '@internationalized/date';
export default function CalenderBtn() {
    return (
        <div className="flex justify-center gap-x-4">
            {/*<Calendar aria-label="Date (No Selection)" />*/}
            <Calendar aria-label="Date (Uncontrolled)" defaultValue={parseDate("2024-05-13")} />
        </div>
    );
}
