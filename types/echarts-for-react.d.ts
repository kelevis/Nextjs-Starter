declare module 'echarts-for-react' {
    import * as React from 'react';
    import { EChartsOption } from 'echarts';

    interface ReactEChartsProps {
        option: EChartsOption;
        style?: React.CSSProperties;
        className?: string;
        notMerge?: boolean;
        lazyUpdate?: boolean;
        theme?: string;
        onChartReady?: (echartsInstance: any) => void;
        onEvents?: Record<string, (e: any) => void>;
    }

    export default class ReactECharts extends React.Component<ReactEChartsProps> {}
}
