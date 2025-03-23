import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  Button,
  Dialog,
  Classes,
  Icon,
  // Overlay not currently used
} from '../../utils/blueprintComponents';
import { usePlayer } from '../../context/PlayerContext';
import Timeline from './Timeline';
import TransportControls from './TransportControls';
import ExportPanel from './ExportPanel';
import MpvPlayer from './MpvPlayer';
import './VideoPlayer.css';

interface VideoPlayerProps {
  showFrameInfo?: boolean;
  showExportButton?: boolean;
  height?: number | string;
  width?: number | string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  showFrameInfo = true,
  showExportButton = true,
  height = '100%',
  width = '100%',
}) => {
  const { state, actions } = usePlayer();
  const playerRef = useRef<HTMLDivElement>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);
  // Keeping for future drag animation implementation
  const [_isDragging, _setIsDragging] = useState(false);

  // Placeholder for mpv.js reference
  // Will be properly implemented when we integrate mpv.js
  const mpvRef = useRef<any>(null);

  // Drag and drop handlers are implemented inline in the Card component

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') {
        return; // Don't handle shortcuts when in input fields
      }

      switch (e.key.toLowerCase()) {
        case ' ': // Space
          actions.togglePlayPause();
          e.preventDefault();
          break;
        case 'arrowleft':
          if (e.shiftKey) {
            actions.seek(state.currentTime - 10); // Skip 10 seconds
          } else {
            actions.stepBackward();
          }
          e.preventDefault();
          break;
        case 'arrowright':
          if (e.shiftKey) {
            actions.seek(state.currentTime + 10); // Skip 10 seconds
          } else {
            actions.stepForward();
          }
          e.preventDefault();
          break;
        case 'j':
          actions.stepBackward();
          e.preventDefault();
          break;
        case 'k':
          actions.togglePlayPause();
          e.preventDefault();
          break;
        case 'l':
          actions.stepForward();
          e.preventDefault();
          break;
        case 'i':
          actions.setInPoint(state.currentTime);
          e.preventDefault();
          break;
        case 'o':
          actions.setOutPoint(state.currentTime);
          e.preventDefault();
          break;
        case 'f':
          actions.toggleFullscreen();
          e.preventDefault();
          break;
        case 'm':
          actions.toggleMute();
          e.preventDefault();
          break;
        default:
          // No action needed
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions, state.currentTime]);

  // Effect to pause video when export dialog is shown
  useEffect(() => {
    if (showExportDialog && state.isPlaying) {
      actions.pause();
    }
  }, [showExportDialog, state.isPlaying, actions]);

  // Handler for export button click
  const handleExportClick = () => {
    setShowExportDialog(true);
  };

  return (
    <Card
      className={`video-player-container ${state.isFullscreen ? 'fullscreen' : ''}`}
      style={{ height, width }}
      ref={playerRef}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropZone(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropZone(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDropZone(false);

        if (e.dataTransfer.files.length > 0) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith('video/')) {
            actions.loadFile(file.path || file.name);
          }
        }
      }}
    >
      <div className="video-viewport">
        {!state.filePath ? (
          <div className="empty-player">
            <Icon icon="media" size={40} />
            <div className="empty-text">
              <h3>No video loaded</h3>
              <p>Drop a video file here or use the open button</p>
              <Button
                icon="folder-open"
                text="Open Video"
                intent="primary"
                className={Classes.BUTTON}
                onClick={() => {
                  // Open dialog to select a file
                  window.electron.ipcRenderer.invoke('open-file-dialog')
                    .then((result: string[]) => {
                      if (result && result.length > 0) {
                        actions.loadFile(result[0]);
                      }
                    });
                }}
              />
            </div>
          </div>
        ) : (
          // Using the actual mpv player component
          <MpvPlayer 
            onMouseDown={actions.togglePlayPause}
          />
        )}

        {/* Overlay for drag and drop */}
        {showDropZone && (
          <div className="drop-zone">
            <Icon icon="upload" size={40} />
            <h3>Drop video file to load</h3>
          </div>
        )}

        {/* Video controls overlay (appears on mousemove) */}
        {state.filePath && state.showControls && (
          <div className="video-controls-overlay">
            <Button
              icon={state.isFullscreen ? 'minimize' : 'maximize'}
              title={
                state.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
              }
              minimal
              className="fullscreen-button"
              onClick={actions.toggleFullscreen}
            />
          </div>
        )}
      </div>

      {/* Timeline component */}
      <Timeline showFrameInfo={showFrameInfo} />

      {/* Transport controls */}
      <TransportControls
        showExportButton={showExportButton}
        compact={state.isFullscreen}
      />

      {/* Export dialog */}
      <Dialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        title="Export Video"
        className="export-dialog"
      >
        <ExportPanel onClose={() => setShowExportDialog(false)} />
      </Dialog>
    </Card>
  );
};

export default VideoPlayer;
