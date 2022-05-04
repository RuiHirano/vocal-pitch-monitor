import { Typography } from '@mui/material';
import React from 'react';
import { LineChart, Line, ReferenceLine, YAxis, XAxis, Label } from 'recharts';
import { Pitch } from '../hooks/useAudio';
import { pitchData, pitchList } from '../utils/pitch';

interface Props {
    data: Pitch[]
}

export const PitchMonitor: React.FC<Props> = ({ data }) => {

    const getNearestPitch = (pitch: number | null) => {
        console.log("getNearestPitch", pitch)
        if (pitch == null) return "---"
        const pitchDiff = Object.values(pitchData).map(p => Math.abs(p.value - pitch))
        const nearestIndex = pitchDiff.indexOf(Math.min(...pitchDiff))
        const nearestPitch = Object.keys(pitchData)[nearestIndex]
        return nearestPitch
    }
    const maxPitch = Math.max(...data.map(d => d.pitch))
    const minPitch = Math.min(...data.filter(d => d.pitch !== 0 && d.pitch !== null).map(d => d.pitch))
    console.log(maxPitch, minPitch)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Typography style={{ color: 'black', fontSize: 20 }}>{getNearestPitch(data[data.length - 1].pitch)}</Typography>
                <Typography style={{ color: 'gray' }}>{`(${data[data.length - 1].pitch ? data[data.length - 1].pitch.toFixed(2) : 0})`}</Typography>
            </div>
            <LineChart width={800} height={500} data={data} >
                <Line type="monotone" dataKey="pitch" stroke="#8884d8" strokeWidth={2} />
                {pitchList.map((val, i) => {
                    return (
                        <ReferenceLine y={val[1].value} stroke="gray" strokeDasharray={val[1].bold ? undefined : "3 3"} >
                            <Label position="right" value={val[0]} color="gray" />
                        </ReferenceLine>
                    )
                })}
                <YAxis tick={false} type="number" domain={maxPitch === 0 ? [pitchData["C4"].value, pitchData["C5"].value] : [minPitch, maxPitch]} />
                <YAxis yAxisId={2} orientation="right" tick={false} type="number" domain={maxPitch === 0 ? [pitchData["C4"].value, pitchData["C5"].value] : [minPitch, maxPitch]} />
                <XAxis tick={false} />
                <XAxis tick={false} xAxisId={2} orientation="top" />
            </LineChart>
        </div>
    )
}
