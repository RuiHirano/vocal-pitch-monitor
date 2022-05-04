import { Checkbox, FormControlLabel, Slider, Stack } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { VolumeDown, VolumeUp } from '@mui/icons-material';

interface Props {
    stream: MediaStream | null
}

export const EchoButton: React.FC<Props> = ({ stream }) => {
    const audioRef = useRef<HTMLAudioElement>(null)
    if (audioRef.current) audioRef.current.srcObject = stream
    const [isEchoOn, setIsEchoOn] = useState(false)
    const [volume, setVolume] = useState<number>(1)

    useEffect(() => {
        if (audioRef.current) {
            if (isEchoOn) {
                audioRef.current.play()
                audioRef.current.volume = volume
            } else {
                audioRef.current.pause()
            }
        }
    }, [isEchoOn, volume])

    return (
        <div>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <FormControlLabel
                    value="echo"
                    control={<Checkbox checked={isEchoOn} onChange={() => { setIsEchoOn(!isEchoOn) }} />}
                    label="Echo"
                    labelPlacement="start"
                />
                {/*isEchoOn && <div style={{ width: '100%' }}>
                    <Stack spacing={2} direction="row" >
                        <VolumeDown />
                        <Slider aria-label="Volume" step={0.01} min={0} max={1} value={volume} onChange={(e, v) => { if (typeof v === "number") setVolume(v) }} />
                        <VolumeUp />
                    </Stack>
    </div>*/}
            </Stack>
            <audio ref={audioRef} />
        </div>
    )
}
