import { useEffect, useState } from "react";
const Pitchfinder = require("pitchfinder");
const detectPitch = Pitchfinder.YIN();

export interface AudioData {
    spectrum: number[];
    pitch: number;
    wave: number[];
}

export interface Pitch {
    pitch: number;
}
export const useAudio = (buffer: number) => {
    const [data, setData] = useState<AudioData | null>(null);
    const [pitchs, setPitchs] = useState<Pitch[]>(Array(buffer).fill({ pitch: null }));

    useEffect(() => {
        const setAudioStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
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
                //const spectrumArray = new Uint8Array(audioAnalyser.frequencyBinCount);
                const pitchArray = new Uint8Array(audioAnalyser.fftSize);
                //audioAnalyser.getByteFrequencyData(spectrumArray);
                audioAnalyser.getByteTimeDomainData(pitchArray);

                //const spectrums = Array.from(spectrumArray)
                const spectrums: number[] = []
                const wave = Array.from(pitchArray)
                let pitch = detectPitch(pitchArray);
                if (pitch > 500) pitch = null;
                if (pitch < 100) pitch = null;
                //setData({ spectrum: spectrums, pitch: pitch, wave: wave });
                setPitchs(pitchs => [...pitchs.slice(1), { pitch: pitch }]);
            }
        }
        setAudioStream();
    }, [])

    return { pitchs: pitchs }
}
