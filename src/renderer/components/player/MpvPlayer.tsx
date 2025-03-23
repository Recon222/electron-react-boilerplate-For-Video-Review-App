// src/renderer/components/player/MpvPlayer.tsx
import React, { useEffect, useRef } from 'react';
import { ReactMPV } from 'mpv.js';
import { usePlayer } from '../../context/PlayerContext';
import './MpvPlayer.css';

interface MpvPlayerProps {
  className?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
}

const MpvPlayer: React.FC<MpvPlayerProps> = ({
  className = '',
  onMouseDown
}) => {
  const { state, actions } = usePlayer();
  const mpvRef = useRef<ReactMPV>(null);

  // Handle mpv player ready event
  const handleMPVReady = (mpv: any) => {
    console.log('MPV player is ready');

    // Store the mpv instance in our context
    actions.setMpvRef(mpv);

    // Set default options
    mpv.property('hwdec', 'auto');           // Enable hardware decoding
    mpv.property('osd-level', 0);            // Disable on-screen display
    mpv.property('osd-fractions', 'yes');    // Show fractions in time display

    // Observe properties we care about for UI updates
    mpv.observe('time-pos');                 // Current playback position
    mpv.observe('duration');                 // Media duration
    mpv.observe('pause');                    // Paused state
    mpv.observe('eof-reached');              // End of file reached
    mpv.observe('filename');                 // Current file name
    mpv.observe('volume');                   // Volume level
    mpv.observe('mute');                     // Mute state
    mpv.observe('speed');                    // Playback speed

    // If we already have a file path in state, load it
    if (state.filePath) {
      mpv.command('loadfile', state.filePath);
    }
  };

  // Handle property changes from mpv
  const handlePropertyChange = (name: string, value: any) => {
    console.log(`MPV property change: ${name} = ${value}`);

    switch(name) {
      case 'time-pos':
        if (value !== null && !Number.isNaN(value)) {
          actions.updateState({ currentTime: value });
        }
        break;
      case 'duration':
        if (value !== null && !Number.isNaN(value)) {
          actions.updateState({
            duration: value,
            outPoint: state.outPoint > 0 ? state.outPoint : value
          });
        }
        break;
      case 'pause':
        actions.updateState({ isPlaying: !value });
        break;
      case 'eof-reached':
        if (value) {
          // Handle end of file (loop or stop)
          handleEndOfFile();
        }
        break;
      case 'filename':
        if (value && typeof value === 'string') {
          actions.updateState({ fileName: value });
        }
        break;
      case 'volume':
        if (value !== null && !Number.isNaN(value)) {
          actions.updateState({ volume: value / 100 });
        }
        break;
      case 'mute':
        actions.updateState({ muted: !!value });
        break;
      case 'speed':
        if (value !== null && !Number.isNaN(value)) {
          actions.updateState({ playbackRate: value });
        }
        break;
    }
  };

  // Handle end of file
  const handleEndOfFile = () => {
    // If we're set to loop between in/out points
    if (state.inPoint > 0 || state.outPoint < state.duration) {
      if (mpvRef.current) {
        mpvRef.current.property('time-pos', state.inPoint);
        if (state.isPlaying) {
          mpvRef.current.property('pause', false);
        }
      }
    } else {
      // Otherwise just pause at the end
      actions.pause();
    }
  };

  // Handle keyboard events for the player
  const handleKeyDown = (e: KeyboardEvent) => {
    if (mpvRef.current) {
      mpvRef.current.keypress(e);
    }
  };

  // Set up keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Extension to PlayerContext to connect actual mpv methods to our context actions
  useEffect(() => {
    // Extend the actions object with actual mpv methods
    const extendActions = () => {
      const originalActions = actions;

      // Override or extend actions with actual mpv functionality
      Object.assign(actions, {
        ...originalActions,

        // Enhanced play action with mpv
        play: () => {
          if (mpvRef.current && state.filePath) {
            mpvRef.current.property('pause', false);
            actions.updateState({ isPlaying: true });
          }
        },

        // Enhanced pause action with mpv
        pause: () => {
          if (mpvRef.current) {
            mpvRef.current.property('pause', true);
            actions.updateState({ isPlaying: false });
          }
        },

        // Enhanced seek action with mpv
        seek: (time: number) => {
          if (mpvRef.current) {
            // Ensure time is within valid range
            const clampedTime = Math.max(0, Math.min(time, state.duration));
            mpvRef.current.property('time-pos', clampedTime);
            actions.updateState({ currentTime: clampedTime });
          }
        },

        // Enhanced step forward action
        stepForward: () => {
          if (mpvRef.current) {
            mpvRef.current.command('frame-step');
          }
        },
        
        // Enhanced step backward action  
        stepBackward: () => {
          if (mpvRef.current) {
            mpvRef.current.command('frame-back-step');
          }
        },
        
        // Enhanced volume control
        setVolume: (volume: number) => {
          if (mpvRef.current) {
            const clampedVolume = Math.max(0, Math.min(volume, 1));
            mpvRef.current.property('volume', clampedVolume * 100);
            actions.updateState({ volume: clampedVolume, muted: clampedVolume === 0 });
          }
        },
        
        // Enhanced mute control
        toggleMute: () => {
          if (mpvRef.current) {
            const newMuted = !state.muted;
            mpvRef.current.property('mute', newMuted);
            actions.updateState({ muted: newMuted });
          }
        },
        
        // Enhanced playback rate control
        setPlaybackRate: (rate: number) => {
          if (mpvRef.current) {
            mpvRef.current.property('speed', rate);
            actions.updateState({ playbackRate: rate });
          }
        }
      });
    };

    extendActions();
  }, [actions, state.filePath, state.duration, state.muted]);

  return (
    <ReactMPV
      className={`mpv-player ${className}`}
      onReady={handleMPVReady}
      onPropertyChange={handlePropertyChange}
      onMouseDown={onMouseDown}
      ref={mpvRef}
    />
  );
};

export default MpvPlayer;
