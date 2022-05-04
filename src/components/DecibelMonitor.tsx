import { Slider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, YAxis, XAxis, Cell } from 'recharts';
import { styled } from '@mui/material/styles';

const ThresholdSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-thumb': {
        "&:nth-child(3)": {
            color: "blue !important",
            backgroundColor: 'lightblue',
        },
        "&:nth-child(4)": {
            color: "green !important",
            backgroundColor: 'lightgreen',
        },
        "&:nth-child(5)": {
            color: "green !important",
            backgroundColor: 'lightgreen',
        },
        "&:nth-child(6)": {
            color: "red !important",
            backgroundColor: 'lightcoral',
        },
        border: '1px solid currentColor',
        '&:hover': {
            boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
        },
    },
}));

const average = function (array: number[]) {
    var result = 0
    array.forEach((val) => {
        result += val;
    })
    return result / array.length;
};

interface Props {
    stream: MediaStream | null
    buffer: number
}

export interface Decibel {
    decibel: number;
}

export const DecibelMonitor: React.FC<Props> = ({ stream, buffer }) => {
    const [decibels, setDecibels] = useState<Decibel[]>(Array(buffer).fill({ decibel: null }));
    const [range, setRange] = useState<number[]>([20, 40, 50, 70])

    useEffect(() => {
        const getDecibels = async () => {
            if (stream === null) {
                console.log("stream is null");
                return
            }
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const audioAnalyser = context.createAnalyser();
            const bufferSize = audioAnalyser.fftSize
            const processor = context.createScriptProcessor(bufferSize, 1, 1);
            audioAnalyser.fftSize = 32;
            //audioAnalyser.maxDecibels = -20;
            //audioAnalyser.minDecibels = -30;

            source.connect(processor);
            processor.connect(context.destination);
            processor.onaudioprocess = function (e) {
                const input = e.inputBuffer.getChannelData(0);
                const bufferData = new Float32Array(bufferSize);
                for (let i = 0; i < bufferSize; i++) {
                    bufferData[i] = input[i];
                }

                source.connect(audioAnalyser);
                const decibelArray = new Uint8Array(audioAnalyser.fftSize);
                audioAnalyser.getByteFrequencyData(decibelArray);
                // decibel: 20~40 to 0~100
                let decibel = (average(Array.from(decibelArray)) - 20) * (5 / 2)
                if (decibel < range[0]) decibel = 0;
                if (decibel > range[3]) decibel = 0;
                //decibel = decibel * 100
                //if (decibel && decibel > 500) decibel = null;
                //if (decibel && decibel < 100) decibel = null;
                setDecibels(decibels => [...decibels.slice(1), { decibel: decibel }]);
            }
        }
        getDecibels();
    }, [stream, range])

    const getColorByLebel = (decibel: number, max: number, min: number) => {
        //if (rate > 0.8) return 'red'
        //if (rate < 0.5) return 'blue'
        if (decibel > range[2]) return 'red'
        if (decibel < range[1]) return 'blue'
        return 'green'
    }

    const maxDecibel = Math.max(...decibels.map(d => d.decibel))
    const minDecibel = Math.min(...decibels.filter(d => d.decibel !== 0 && d.decibel !== null).map(d => d.decibel))
    return (
        <div>
            <BarChart width={800} height={200} data={decibels} >
                <Bar type="monotone" dataKey="decibel" strokeWidth={2} >
                    {
                        decibels.map((dec, index) => (
                            <Cell fill={getColorByLebel(dec.decibel, maxDecibel, minDecibel)} />
                        ))
                    }
                </Bar>
                <YAxis tick={false} type="number" domain={[range[0] - 5, range[3] + 5]} />
                <YAxis yAxisId={2} orientation="right" tick={false} type="number" domain={[range[0] - 5, range[3] + 5]} />
                <XAxis tick={false} />
                <XAxis tick={false} xAxisId={2} orientation="top" />
            </BarChart>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ThresholdSlider
                    getAriaLabel={() => 'range'}
                    style={{ width: '80%' }}
                    value={range}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(e, v) => { if (typeof v !== "number") setRange(v) }}
                    valueLabelDisplay="auto"
                />
            </div>
        </div>
    )
}
