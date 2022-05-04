import React from 'react';

import { BarChart, Bar } from 'recharts';

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
