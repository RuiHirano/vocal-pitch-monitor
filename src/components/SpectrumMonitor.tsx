import React, { useEffect, useRef, useState } from 'react';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data2 = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

interface Props {
    data: number[]
}

export const SpectrumMonitor: React.FC<Props> = ({ data }) => {

    const modifyData = (data: number[]) => {
        const newData = data.map((d, i) => {
            return {
                spectrum: d,
            }
        })
        return newData
    }
    const data3 = modifyData(data)
    return (
        <div>
            <BarChart width={350} height={140} data={data3}>
                <Bar dataKey="spectrum" fill="#8884d8" />
            </BarChart>
        </div>
    )
}
