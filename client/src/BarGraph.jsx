import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const valueFormatter = (value) => `${value}`;

const getChartSetting =(ml)=>({
    yAxis: [
        {
            label: 'Product Count',
        },
    ],
    series: [{ dataKey: 'count',label:`Bar Chart Stats - ${ml}`, valueFormatter }],
    height: 300,
    sx: {
        [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
            transform: 'translateX(-10px)',
        },
    },
});

export default function TickPlacementBars(props) {
    const { monthLabel, barGraphData } = props;

    const chartSetting = getChartSetting(monthLabel)
    return (
        <div style={{ width: '100%' }}>

            <BarChart
                dataset={barGraphData}
                xAxis={[
                    { scaleType: 'band', dataKey: 'range', tickPlacement: 'middle', tickLabelPlacement: "middle" },
                ]}
                {...chartSetting}
            />
        </div>
    );
}