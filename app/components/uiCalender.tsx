"use client"
import React from "react";
import {Calendar} from "@nextui-org/react";
import {parseDate} from '@internationalized/date';
import {today, getLocalTimeZone} from "@internationalized/date";
import {I18nProvider} from "@react-aria/i18n";

export default function CalenderBtn() {
    return (
        <div className="flex justify-center gap-x-4">
            {/*<Calendar aria-label="Date (No Selection)" />*/}
            <I18nProvider locale="zh-Cn">
                <Calendar
                    // aria-label="Date (Uncontrolled)"
                    // defaultValue={parseDate("2024-05-13")}
                    aria-label="Date (Min Date Value)"
                    defaultValue={today(getLocalTimeZone())}
                    showMonthAndYearPickers
                    // minValue={today(getLocalTimeZone())}
                />
            </I18nProvider>
        </div>
    );
}
