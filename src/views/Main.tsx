import React, { useEffect, useRef, useState } from 'react';
import { PitchMonitor } from '../components/PitchMonitor';
import { SpectrumMonitor } from '../components/SpectrumMonitor';
import { AudioData, useAudio } from '../hooks/useAudio';
import { Typography } from '@mui/material';

export const Main: React.FC = () => {
    const { pitchs } = useAudio(300)

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '10vw', marginRight: '10vw' }}>
            <div style={{}}>
                <div style={{ margin: 50 }}>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold', margin: 30 }} variant='h3'>Vocal Pitch Monitor</Typography>
                    <Typography style={{ textAlign: 'center', fontWeight: 'bold' }} variant='h6'>Monitor your voice simply and easily</Typography>
                    <Typography style={{ textAlign: 'center' }} variant='body1'>*Earphones must be used</Typography>
                </div>
                <div style={{ marginTop: 50 }} />
                <PitchMonitor data={pitchs} />
            </div>
        </div >
    );
}
