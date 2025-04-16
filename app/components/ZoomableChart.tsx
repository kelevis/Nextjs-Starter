// 'use client';
//
// import React from 'react';
// import ReactECharts from 'echarts-for-react';
// import { useTheme } from 'next-themes';
// import * as echarts from 'echarts';
//
// interface ChartProps {
//     dates: string[];
//     values: number[];
// }
//
// const ZoomableChart: React.FC<ChartProps> = ({ dates, values }) => {
//     const { resolvedTheme } = useTheme();
//     const isDarkMode = resolvedTheme === 'dark' || resolvedTheme === 'purple-dark';
//
//     const axisTextColor = isDarkMode ? '#bbb' : '#666';
//     const axisLineColor = isDarkMode ? '#555' : '#ccc';
//     const gridLineColor = isDarkMode ? '#333' : '#eee';
//
//     const option: echarts.EChartsOption = {
//         // 配置标题部分
//         title: {
//             text: '📈 成交量趋势图',  // 设置图表标题文本
//             left: 'center',  // 标题居中显示
//             top: 10,  // 设置标题距离顶部的间距
//             textStyle: {
//                 fontSize: 20,  // 设置字体大小
//                 fontWeight: 700,  // 设置字体粗细
//                 color: axisTextColor,  // 根据主题来设置标题颜色
//             },
//         },
//
//         // 配置提示框（tooltip）部分
//         tooltip: {
//             trigger: 'axis',  // 设置触发方式为轴触发（即鼠标悬浮在轴上）
//             backgroundColor: isDarkMode ? 'rgba(30,30,30,0.9)' : 'rgba(50,50,50,0.8)',  // 根据主题设置背景色
//             borderColor: isDarkMode ? '#444' : '#777',  // 设置边框颜色
//             textStyle: {
//                 color: '#fff',  // 设置文本颜色为白色
//             },
//             formatter: (params: any) => {
//                 const data = params[0];  // 获取数据
//                 return `${data.axisValue}<br/>成交量: <b>${data.data}</b>`;  // 格式化显示日期和成交量
//             },
//         },
//
//         // 配置 X 轴部分
//         xAxis: {
//             type: 'category',  // 设置为类目轴（用于离散的类目数据，如日期等）
//             name: '日期',  // 设置 X 轴名称为“日期”
//             data: dates,  // 设置 X 轴数据（日期数组）
//             boundaryGap: false,  // 不留白，紧密显示数据
//             axisLine: {
//                 lineStyle: {
//                     color: axisLineColor  // 设置 X 轴线的颜色
//                 }
//             },
//             axisLabel: {
//                 color: axisTextColor,  // 设置 X 轴刻度标签颜色
//                 rotate: 45,  // 设置刻度标签旋转45度
//                 fontSize: 11,  // 设置字体大小为11px
//             },
//         },
//
//         // 配置 Y 轴部分
//         yAxis: {
//             type: 'value',  // 设置为数值轴（用于连续数据）
//             name: '成交量',  // 设置 Y 轴名称为“成交量”
//             axisLine: {
//                 lineStyle: {
//                     color: axisLineColor  // 设置 Y 轴线的颜色
//                 }
//             },
//             splitLine: {  // 配置网格线样式
//                 lineStyle: {
//                     type: 'dashed',  // 设置网格线为虚线
//                     color: gridLineColor,  // 设置网格线的颜色
//                 },
//             },
//             axisLabel: {
//                 color: axisTextColor,  // 设置 Y 轴刻度标签颜色
//             },
//         },
//
//         // 配置图表的缩放功能
//         dataZoom: [
//             {
//                 type: 'inside',  // 内置缩放，允许通过鼠标滚轮或拖动缩放
//                 start: 90,  // 初始显示的开始比例
//                 end: 100,  // 初始显示的结束比例
//             },
//             {
//                 type: 'slider',  // 滑动条缩放，用户通过滑动条选择显示的数据范围
//                 start: 90,  // 初始显示的开始比例
//                 end: 100,  // 初始显示的结束比例
//                 height: 18,  // 设置滑动条高度
//                 bottom: 10,  // 设置滑动条距离底部的间距
//             },
//         ],
//
//         // 配置图表数据系列
//         series: [
//             {
//                 name: '成交量',  // 设置数据系列的名称
//                 type: 'line',  // 设置为折线图
//                 data: values,  // 设置数据（成交量）
//                 smooth: true,  // 设置折线平滑
//                 symbol: 'circle',  // 设置数据点的标记形状为圆形
//                 symbolSize: 6,  // 设置数据点的大小
//                 itemStyle: {  // 设置数据点样式
//                     color: '#5470C6',  // 设置数据点颜色
//                     borderColor: '#fff',  // 设置数据点边框颜色
//                     borderWidth: 2,  // 设置数据点边框宽度
//                     shadowColor: 'rgba(0, 0, 0, 0.2)',  // 设置数据点的阴影颜色
//                     shadowBlur: 5,  // 设置数据点的阴影模糊度
//                 },
//                 lineStyle: {  // 设置折线的样式
//                     width: 2,  // 设置折线宽度
//                     color: {  // 设置折线颜色为渐变色
//                         type: 'linear',
//                         x: 0,
//                         y: 0,
//                         x2: 1,
//                         y2: 0,
//                         colorStops: [
//                             { offset: 0, color: '#73C0DE' },  // 起始颜色
//                             { offset: 1, color: '#5470C6' },  // 结束颜色
//                         ],
//                     },
//                 },
//                 areaStyle: {  // 设置折线下方区域的填充样式
//                     color: {  // 设置区域颜色为渐变色
//                         type: 'linear',
//                         x: 0,
//                         y: 0,
//                         x2: 0,
//                         y2: 1,
//                         colorStops: [
//                             { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },  // 起始颜色（有透明度）
//                             { offset: 1, color: 'rgba(84, 112, 198, 0)' },  // 结束颜色（透明）
//                         ],
//                     },
//                 },
//             },
//         ],
//
//         // 配置图表的网格（内边距）
//         grid: {
//             left: '5%',  // 设置左侧间距
//             right: '5%',  // 设置右侧间距
//             bottom: 60,  // 设置底部间距
//             top: 60,  // 设置顶部间距
//             containLabel: true,  // 确保标签不会被裁切
//         },
//     };
//
//
//     return <ReactECharts option={option} style={{ height: '480px', width: '100%' }} />;
// };
//
// export default ZoomableChart;


import React from 'react';
import ReactECharts from 'echarts-for-react';

const ZoomableChart = ({
                           dates,
                           values,
                           chartType = 'line', // 默认折线图
                           isDarkMode = false,
                       }: {
    dates: string[];
    values: number[];
    chartType?: 'line' | 'bar';
    isDarkMode?: boolean;
}) => {
    const axisTextColor = isDarkMode ? '#ccc' : '#333';
    const axisLineColor = isDarkMode ? '#666' : '#999';
    const gridLineColor = isDarkMode ? '#444' : '#eee';

    const option: echarts.EChartsOption = {
        title: {
            text: '📈 二手房趋势图',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 20,
                fontWeight: 700,
                color: axisTextColor,
            },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: isDarkMode ? 'rgba(30,30,30,0.9)' : 'rgba(50,50,50,0.8)',
            borderColor: isDarkMode ? '#444' : '#777',
            textStyle: {
                color: '#fff',
            },
            formatter: (params: any) => {
                const data = params[0];
                return `${data.axisValue}<br/>成交量: <b>${data.data}</b>`;
            },
        },
        xAxis: {
            type: 'category',
            name: '日期',
            data: dates,
            boundaryGap: chartType === 'bar',
            axisLine: { lineStyle: { color: axisLineColor } },
            axisLabel: {
                color: axisTextColor,
                rotate: 45,
                fontSize: 11,
            },
        },
        yAxis: {
            type: 'value',
            name: '成交量',
            axisLine: { lineStyle: { color: axisLineColor } },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: gridLineColor,
                },
            },
            axisLabel: {
                color: axisTextColor,
            },
        },
        dataZoom: [
            { type: 'inside', start: 90, end: 100 },
            { type: 'slider', start: 90, end: 100, height: 18, bottom: 10 },
        ],
        series: [
            {
                name: '成交量',
                type: chartType,
                data: values,
                smooth: chartType === 'line',
                symbol: 'circle',
                symbolSize: 6,
                itemStyle: {
                    color: '#5470C6', // 👈 实心圆点设置
                },
                lineStyle: chartType === 'line'
                    ? {
                        width: 2,
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 1,
                            y2: 0,
                            colorStops: [
                                { offset: 0, color: '#73C0DE' },
                                { offset: 1, color: '#5470C6' },
                            ],
                        },
                    }
                    : undefined,
                areaStyle: chartType === 'line'
                    ? {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(84, 112, 198, 0.3)' },
                                { offset: 1, color: 'rgba(84, 112, 198, 0)' },
                            ],
                        },
                    }
                    : undefined,
            },
        ],

        grid: {
            left: '5%',
            right: '5%',
            bottom: 60,
            top: 60,
            containLabel: true,
        },
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default ZoomableChart;
