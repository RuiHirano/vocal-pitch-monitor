import React from 'react';
import { PitchMonitor } from '../components/PitchMonitor';
import { useAudio } from '../hooks/useAudio';
import { Typography } from '@mui/material';
import { EchoButton } from '../components/EchoButton';
import { Recorder } from '../components/Recorder';
import { DecibelMonitor } from '../components/DecibelMonitor';

export const Main: React.FC = () => {
    const { stream } = useAudio()

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10vw', marginRight: '10vw', marginBottom: '10vh' }}>
            <div style={{}}>
                <div style={{ margin: 50 }}>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', margin: 30 }} variant='h3'>Vocal Pitch Monitor</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold' }} variant='h6'>Monitor your voice simply and easily</Typography>
                    <Typography style={{ textAlign: 'center' }} variant='body1'>*Earphones must be used</Typography>
                </div>
                <div style={{ marginTop: 50 }} />
                <PitchMonitor stream={stream} buffer={300} />
                <DecibelMonitor stream={stream} buffer={300} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Recorder stream={stream} />
                    <EchoButton stream={stream} />
                </div>
            </div>
        </div >
    );
}
