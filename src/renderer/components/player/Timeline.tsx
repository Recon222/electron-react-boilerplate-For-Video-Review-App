import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { formatTime, calculateProgress } from '../utils/timeFormatter';

// Define the shape of our player state
export interface PlayerState {
  // File state
  filePath: string | null;
  fileName: string | null;
  duration: number;
  fps: number;

  // Playback state
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  muted: boolean;
  playbackRate: number;

  // Trim points
  inPoint: number;
  outPoint: number;

  // UI state
  isFullscreen: boolean;
  showControls: boolean;

  // Export state
  isExporting: boolean;
  exportProgress: number;
  exportFormat: string;
  exportQuality: number;
}

// Define the shape of our context actions
interface PlayerContextActions {
  // File actions
  loadFile: (filePath: string) => void;
  unloadFile: () => void;

  // Playback controls
  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  seekToPercent: (percent: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  jumpToInPoint: () => void;
  jumpToOutPoint: () => void;

  // Volume controls
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;

  // Trim controls
  setInPoint: (time: number) => void;
  setOutPoint: (time: number) => void;
  clearInPoint: () => void;
  clearOutPoint: () => void;

  // UI controls
  toggleFullscreen: () => void;
  toggleControls: () => void;

  // Export controls
  startExport: (format: string, quality: number) => void;
  cancelExport: () => void;

  // MPV reference (to be set by the VideoPlayer component)
  setMpvRef: (ref: any) => void;
}

// Define initial state
const initialPlayerState: PlayerState = {
  filePath: null,
  fileName: null,
  duration: 0,
  fps: 29.97, // Default fps

  isPlaying: false,
  currentTime: 0,
  volume: 1,
  muted: false,
  playbackRate: 1,

  inPoint: 0,
  outPoint: 0,

  isFullscreen: false,
  showControls: true,

  isExporting: false,
  exportProgress: 0,
  exportFormat: 'mp4',
  exportQuality: 80, // 0-100 quality range
};

// Create the context
const PlayerContext = createContext<{
  state: PlayerState;
  actions: PlayerContextActions;
} | undefined>(undefined);

// Provider component
interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, setState] = useState<PlayerState>(initialPlayerState);
  const mpvRef = useRef<any>(null);

  // Timer for auto-hiding controls
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to update state partially
  const updateState = (newState: Partial<PlayerState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  // Reset the auto-hide controls timer
  const resetControlsTimer = () => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    if (state.showControls) {
      controlsTimerRef.current = setTimeout(() => {
        if (state.isPlaying) {
          updateState({ showControls: false });
        }
      }, 3000);
    }
  };

  // Effect to handle setting up control auto-hide
  useEffect(() => {
    resetControlsTimer();

    // Mouse movement handler to show controls
    const handleMouseMove = () => {
      if (!state.showControls) {
        updateState({ showControls: true });
      }
      resetControlsTimer();
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, [state.isPlaying, state.showControls]);

  // Define the actions
  const actions: PlayerContextActions = {
    // File actions
    loadFile: (filePath: string) => {
      const fileName = filePath.split('/').pop() || filePath.split('\\').pop() || 'Unknown';

      // Reset player state for new file
      updateState({
        filePath,
        fileName,
        currentTime: 0,
        isPlaying: false,
        inPoint: 0,
        outPoint: 0,
      });

      // If we have mpv instance, load the file
      if (mpvRef.current) {
        mpvRef.current.command('loadfile', filePath);
      }
    },

    unloadFile: () => {
      updateState(initialPlayerState);
      if (mpvRef.current) {
        mpvRef.current.command('stop');
      }
    },

    // Playback controls
    play: () => {
      if (mpvRef.current && state.filePath) {
        mpvRef.current.property('pause', false);
        updateState({ isPlaying: true });
      }
    },

    pause: () => {
      if (mpvRef.current) {
        mpvRef.current.property('pause', true);
        updateState({ isPlaying: false });
      }
    },

    togglePlayPause: () => {
      if (state.isPlaying) {
        actions.pause();
      } else {
        actions.play();
      }
    },

    seek: (time: number) => {
      if (mpvRef.current) {
        // Ensure time is within valid range
        const clampedTime = Math.max(0, Math.min(time, state.duration));
        mpvRef.current.property('time-pos', clampedTime);
        updateState({ currentTime: clampedTime });
      }
    },

    seekToPercent: (percent: number) => {
      if (state.duration > 0) {
        const time = (percent / 100) * state.duration;
        actions.seek(time);
      }
    },

    stepForward: () => {
      if (mpvRef.current) {
        mpvRef.current.command('frame-step');
        // The time update will come from the mpv property change
      }
    },

    stepBackward: () => {
      if (mpvRef.current) {
        mpvRef.current.command('frame-back-step');
        // The time update will come from the mpv property change
      }
    },

    jumpToInPoint: () => {
      actions.seek(state.inPoint);
    },

    jumpToOutPoint: () => {
      actions.seek(state.outPoint);
    },

    // Volume controls
    setVolume: (volume: number) => {
      if (mpvRef.current) {
        const clampedVolume = Math.max(0, Math.min(volume, 1));
        mpvRef.current.property('volume', clampedVolume * 100);
        updateState({ volume: clampedVolume, muted: clampedVolume === 0 });
      }
    },

    toggleMute: () => {
      if (mpvRef.current) {
        const newMuted = !state.muted;
        mpvRef.current.property('mute', newMuted);
        updateState({ muted: newMuted });
      }
    },

    setPlaybackRate: (rate: number) => {
      if (mpvRef.current) {
        mpvRef.current.property('speed', rate);
        updateState({ playbackRate: rate });
      }
    },

    // Trim controls
    setInPoint: (time: number) => {
      const inPoint = Math.max(0, Math.min(time, state.duration));
      updateState({
        inPoint,
        outPoint: Math.max(inPoint + 1, state.outPoint) // Ensure out point is after in point
      });
    },

    setOutPoint: (time: number) => {
      const outPoint = Math.max(0, Math.min(time, state.duration));
      updateState({
        outPoint,
        inPoint: Math.min(outPoint - 1, state.inPoint) // Ensure in point is before out point
      });
    },

    clearInPoint: () => {
      updateState({ inPoint: 0 });
    },

    clearOutPoint: () => {
      updateState({ outPoint: state.duration });
    },

    // UI controls
    toggleFullscreen: () => {
      // This is handled by Electron in the actual implementation
      updateState({ isFullscreen: !state.isFullscreen });
    },

    toggleControls: () => {
      updateState({ showControls: !state.showControls });
      resetControlsTimer();
    },

    // Export controls - in a real implementation these would call to the main process
    startExport: (format: string, quality: number) => {
      if (!state.filePath || state.inPoint >= state.outPoint) {
        return;
      }

      updateState({
        isExporting: true,
        exportProgress: 0,
        exportFormat: format,
        exportQuality: quality
      });

      // In a real implementation, we would trigger the export via IPC
      console.log(`Start export: ${format}, quality: ${quality}`);
      console.log(`Trim: ${formatTime(state.inPoint)} to ${formatTime(state.outPoint)}`);

      // Simulate export progress for now
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 1;
          updateState({ exportProgress: progress });

          if (progress >= 100 || !state.isExporting) {
            clearInterval(interval);
            if (state.isExporting) {
              updateState({ isExporting: false, exportProgress: 100 });
              setTimeout(() => updateState({ exportProgress: 0 }), 1000);
            }
          }
        }, 100);
      };

      simulateProgress();
    },

    cancelExport: () => {
      // In a real implementation, we would cancel the export via IPC
      updateState({ isExporting: false, exportProgress: 0 });
    },

    // Set MPV reference
    setMpvRef: (ref: any) => {
      mpvRef.current = ref;
    }
  };

  // Context value
  const value = { state, actions };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};

// Custom hook to use the player context
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext;