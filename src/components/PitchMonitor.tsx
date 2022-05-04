import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, ReferenceLine, YAxis, XAxis, Label } from 'recharts';
import { Pitch } from '../hooks/useAudio';
import { pitchData, pitchList, toLog } from '../utils/pitch';
const Pitchfinder = require("pitchfinder");
const detectPitch = Pitchfinder.YIN();

interface Props {
    stream: MediaStream | null
    buffer: number
}

const pitchdata = Object.entries(pitchData).map((v) => v[0] + "  " + Math.log2(v[1].value))

export const PitchMonitor: React.FC<Props> = ({ stream, buffer }) => {
    const [pitchs, setPitchs] = useState<Pitch[]>(Array(buffer).fill({ pitch: null }));

    useEffect(() => {
        const getPitchs = async () => {
            if (stream === null) {
                console.log("stream is null");
                return
            }
            const context = new AudioContext();
            const source = context.createMediaStreamSource(stream);
            const audioAnalyser = context.createAnalyser();
            const bufferSize = audioAnalyser.fftSize
            const processor = context.createScriptProcessor(bufferSize, 1, 1);
            //audioAnalyser.fftSize = 256;
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
                const pitchArray = new Uint8Array(audioAnalyser.fftSize);
                audioAnalyser.getByteTimeDomainData(pitchArray);
                let pitch = detectPitch(pitchArray);
                pitch = toLog(pitch);
                if (pitch > pitchData["C8"].log) pitch = null;
                if (pitch < pitchData["A0"].log) pitch = null;
                setPitchs(pitchs => [...pitchs.slice(1), { pitch: pitch }]);
            }
        }
        getPitchs();
    }, [stream])

    const getNearestPitch = (pitch: number | null) => {
        if (pitch == null) return "---"
        const pitchDiff = Object.values(pitchData).map(p => Math.abs(p.log - pitch))
        const nearestIndex = pitchDiff.indexOf(Math.min(...pitchDiff))
        const nearestPitch = Object.keys(pitchData)[nearestIndex]
        return nearestPitch
    }
    const maxPitch = Math.max(...pitchs.map(d => d.pitch))
    const minPitch = Math.min(...pitchs.filter(d => d.pitch !== 0 && d.pitch !== null).map(d => d.pitch))

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography style={{ color: 'black', fontSize: 20 }}>{"Pitch"}</Typography>
                <Typography style={{ marginLeft: 20, color: 'black', fontSize: 20 }}>{getNearestPitch(pitchs[pitchs.length - 1].pitch)}</Typography>
                <Typography style={{ color: 'gray' }}>{`(${pitchs[pitchs.length - 1].pitch ? pitchs[pitchs.length - 1].pitch.toFixed(2) : 0})`}</Typography>
            </div>
            <LineChart width={800} height={500} data={pitchs} >
                <Line type="monotone" dataKey="pitch" stroke="#8884d8" strokeWidth={2} />
                {pitchList.map((val, i) => {
                    return (
                        <ReferenceLine key={i} y={val[1].log} stroke="gray" strokeDasharray={val[1].bold ? undefined : "3 3"} >
                            <Label position="right" value={val[0]} color="gray" />
                        </ReferenceLine>
                    )
                })}
                <YAxis tick={false} type="number" domain={maxPitch === 0 ? [pitchData["C4"].log, pitchData["C5"].log] : [minPitch - 0.1, maxPitch + 0.1]} />
                <YAxis yAxisId={2} orientation="right" tick={false} type="number" domain={maxPitch === 0 ? [pitchData["C4"].log, pitchData["C5"].log] : [minPitch - 0.1, maxPitch + 0.1]} />
                <XAxis tick={false} />
                <XAxis tick={false} xAxisId={2} orientation="top" />
            </LineChart>
        </div>
    )
}
