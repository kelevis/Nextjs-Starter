"use client"
import React, {useEffect, useState} from 'react';
import { Calendar, Col, Radio, Row, Select } from 'antd';
import type { CalendarProps } from 'antd';  // 导入 CalendarProps 类型
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 确保加载你需要的语言包
import localeData from 'dayjs/plugin/localeData'; // 引入 localeData 插件
import { HolidayUtil, Lunar } from 'lunar-typescript';
import type { Dayjs } from 'dayjs';
import {useMetamask} from "@/app/hooks/useMetamask";
import {useListen} from "@/app/hooks/useListen";

// 使用插件
dayjs.extend(localeData);

const App: React.FC = () => {
    const {dispatch,} = useMetamask();
    const listen = useListen();

    useEffect(() => {
        if (typeof window !== undefined) {

            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
            const local = window.localStorage.getItem("metamaskState");

            if (local) {
                listen();
            }

            // local could be null if not present in LocalStorage
            const {wallet, balance} = local ? JSON.parse(local) : {wallet: null, balance: null};
            dispatch({type: "pageLoaded", isMetamaskInstalled, wallet, balance});
        }
        console.log("连接metamask成功！")

    }, []);



    const [selectDate, setSelectDate] = useState<Dayjs>(dayjs()); // 选中的日期
    const [panelDateDate, setPanelDate] = useState<Dayjs>(dayjs()); // 面板显示的日期

    const [value, setValue] = useState(() => dayjs('2017-01-25')); // 当前显示的日期
    const [selectedValue, setSelectedValue] = useState(() => dayjs('2017-01-25')); // 选中的日期

    // 日期面板改变时的回调
    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
        setPanelDate(value);
    };

    // 日期选择时的回调
    const onSelect = (newValue: Dayjs) => {
        setValue(newValue);
        setSelectedValue(newValue);
        setSelectDate(newValue); // 更新选中的日期
    };

    // 自定义单元格渲染
    const cellRender: CalendarProps<Dayjs>['fullCellRender'] = (date, info) => {
        const d = Lunar.fromDate(date.toDate());
        const lunar = d.getDayInChinese();
        const solarTerm = d.getJieQi();
        const isWeekend = date.day() === 6 || date.day() === 0;
        const h = HolidayUtil.getHoliday(date.year(), date.month() + 1, date.date());
        const displayHoliday = h?.getTarget() === h?.getDay() ? h?.getName() : undefined;

        if (info.type === 'date') {
            return React.cloneElement(info.originNode, {
                ...info.originNode.props,
                className: `date-cell ${selectDate.isSame(date, 'date') ? 'current' : ''} ${date.isSame(dayjs(), 'date') ? 'today' : ''}`,
                children: (
                    <div>
            <span className={isWeekend ? 'weekend' : ''}>
              {date.date()}
            </span>
                        {info.type === 'date' && (
                            <div>{displayHoliday || solarTerm || lunar}</div>
                        )}
                    </div>
                ),
            });
        }

        if (info.type === 'month') {
            const d2 = Lunar.fromDate(new Date(date.year(), date.month()));
            const month = d2.getMonthInChinese();
            return (
                <div className={`month-cell ${selectDate.isSame(date, 'month') ? 'month-cell-current' : ''}`}>
                    {date.month() + 1}月（{month}月）
                </div>
            );
        }
    };

    // 获取年份标签
    const getYearLabel = (year: number) => {
        const d = Lunar.fromDate(new Date(year + 1, 0));
        return `${d.getYearInChinese()}年（${d.getYearInGanZhi()}${d.getYearShengXiao()}年）`;
    };

    // 获取月份标签
    const getMonthLabel = (month: number, value: Dayjs) => {
        const d = Lunar.fromDate(new Date(value.year(), month));
        const lunar = d.getMonthInChinese();
        return `${month + 1}月（${lunar}月）`;
    };

    return (
        <div className="w-full h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-6">Welcome to Calendar</h1>
            <div className="bg-white rounded-lg p-8 shadow-lg text-gray-800 w-full md:w-3/4 lg:w-1/2">
                <Calendar
                    value={selectDate} // 将 `value` 设置为 `selectDate`，以确保选中日期被渲染
                    fullCellRender={cellRender}
                    fullscreen={false}
                    onPanelChange={onPanelChange}
                    onSelect={onSelect}
                    headerRender={({ value, type, onChange, onTypeChange }) => {
                        const start = 0;
                        const end = 12;
                        const monthOptions = [];

                        let current = value.clone();
                        const localeData = value.localeData(); // 现在可以调用 localeData 了
                        const months = [];
                        for (let i = 0; i < 12; i++) {
                            current = current.month(i);
                            months.push(localeData.monthsShort(current));
                        }

                        for (let i = start; i < end; i++) {
                            monthOptions.push({
                                label: getMonthLabel(i, value),
                                value: i,
                            });
                        }

                        const year = value.year();
                        const month = value.month();
                        const options = [];
                        for (let i = year - 10; i < year + 10; i += 1) {
                            options.push({
                                label: getYearLabel(i),
                                value: i,
                            });
                        }

                        return (
                            <Row justify="end" gutter={8} style={{ padding: 8 }}>
                                <Col>
                                    <Select
                                        size="small"
                                        popupMatchSelectWidth={false}
                                        value={year}
                                        options={options}
                                        onChange={(newYear) => {
                                            const now = value.clone().year(newYear);
                                            onChange(now);
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Select
                                        size="small"
                                        popupMatchSelectWidth={false}
                                        value={month}
                                        options={monthOptions}
                                        onChange={(newMonth) => {
                                            const now = value.clone().month(newMonth);
                                            onChange(now);
                                        }}
                                    />
                                </Col>
                                <Col>
                                    <Radio.Group
                                        size="small"
                                        onChange={(e) => onTypeChange(e.target.value)}
                                        value={type}
                                    >
                                        <Radio.Button value="month">月</Radio.Button>
                                        <Radio.Button value="year">年</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default App;
