import React, { useEffect, useState } from 'react';
import { BarChart, Bar, YAxis, XAxis, Cell } from 'recharts';

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
            //audioAnalyser.maxDecibels = -30;
            //audioAnalyser.minDecibels = -80;

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
                let decibel = average(Array.from(decibelArray))
                decibel = decibel * 100
                //if (decibel && decibel > 500) decibel = null;
                //if (decibel && decibel < 100) decibel = null;
                setDecibels(decibels => [...decibels.slice(1), { decibel: decibel }]);
            }
        }
        getDecibels();
    }, [stream])

    const getColorByLebel = (decibel: number, max: number, min: number) => {
        const rate = decibel / (max - min)
        //if (rate > 0.8) return 'red'
        //if (rate < 0.5) return 'blue'
        if (decibel > 4000) return 'red'
        if (decibel < 3700) return 'blue'
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
                <YAxis tick={false} type="number" domain={[minDecibel - 20, maxDecibel + 50]} />
                <YAxis yAxisId={2} orientation="right" tick={false} type="number" domain={[minDecibel - 20, maxDecibel + 50]} />
                <XAxis tick={false} />
                <XAxis tick={false} xAxisId={2} orientation="top" />
            </BarChart>
        </div>
    )
}
