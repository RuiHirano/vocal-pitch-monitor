import { IconButton, Stack } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Pause, PlayArrow, RadioButtonChecked } from '@mui/icons-material';

interface Props {
    stream: MediaStream | null
}

export const Recorder: React.FC<Props> = ({ stream }) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [status, setStatus] = useState<string>('none'); // none, recording, play
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    useEffect(() => {
        if (stream) {
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder)
        }
    }, [stream])

    const handleStart = () => {
        if (mediaRecorder) {
            setStatus('recording')
            mediaRecorder.start();
            mediaRecorder.ondataavailable = function (e) {
                const audioURL = window.URL.createObjectURL(e.data);
                if (audioRef.current) {
                    audioRef.current.src = audioURL;
                    setAudioUrl(audioURL);
                }
            }
        } else {
            console.log("no media recorder")
        }
    }

    const handleStop = () => {
        setStatus('none')
        if (mediaRecorder) {
            mediaRecorder.stop();
        } else {
            console.log("no media recorder")
        }
    }

    const handlePlay = () => {
        setStatus('play')
        if (audioRef.current) {
            audioRef.current.onpause = () => {
                handlePause()
            }
            audioRef.current.play()
        }
    }

    const handlePause = () => {
        setStatus('none')
        if (audioRef.current) {
            audioRef.current.pause()
        }
    }

    return (
        <div>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                {status === "recording" ?
                    <IconButton onClick={handleStop}>
                        <RadioButtonChecked style={{ color: "red" }} />
                    </IconButton> :
                    <IconButton onClick={handleStart} disabled={status === "play"}>
                        <RadioButtonChecked style={{ color: status === "play" ? undefined : "black" }} />
                    </IconButton>
                }
                {status === "play" ?
                    <IconButton onClick={handlePause}>
                        <Pause style={{ color: 'blue' }} />
                    </IconButton> :
                    <IconButton onClick={handlePlay} disabled={audioUrl === null || status === "recording"}>
                        <PlayArrow style={{ color: audioUrl === null || status === "recording" ? undefined : "black" }} />
                    </IconButton>
                }
            </Stack>
            <audio ref={audioRef} />
        </div>
    )
}
