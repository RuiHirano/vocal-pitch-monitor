import { useEffect, useState } from "react";

export interface AudioData {
    spectrum: number[];
    pitch: number;
    wave: number[];
}

export interface Pitch {
    pitch: number;
}
export const useAudio = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        const setAudioStream = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            setStream(stream)
        }
        setAudioStream();
    }, [])

    return { stream: stream }
}
