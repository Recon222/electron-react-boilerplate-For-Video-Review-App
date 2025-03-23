import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Dialog, Classes, Icon, Overlay } from '../../utils/blueprintComponents';
import { usePlayer } from '../../context/PlayerContext';
import Timeline from './Timeline';
import TransportControls from './TransportControls';
import ExportPanel from './ExportPanel';
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
  const [isDragging, setIsDragging] = useState(false);

  // Placeholder for mpv.js reference
  // Will be properly implemented when we integrate mpv.js
  const mpvRef = useRef<any>(null);

  // Effect to handle file drops
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDropZone(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDropZone(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setShowDropZone(false);

      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('video/')) {
          // In a real implementation, we'd handle file path differently
          // For now, we'll just use the file name
          actions.loadFile(file.path || file.name);
        }
      }
    };

    const element = playerRef.current;
    if (element) {
      element.addEventListener('dragover', handleDragOver as EventListener);
      element.addEventListener('dragleave', handleDragLeave as EventListener);
      element.addEventListener('drop', handleDrop as EventListener);
    }

    return () => {
      if (element) {
        element.removeEventListener('dragover', handleDragOver as EventListener);
        element.removeEventListener('dragleave', handleDragLeave as EventListener);
        element.removeEventListener('drop', handleDrop as EventListener);
      }
    };
  }, [actions]);

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
    >
      {/* Placeholder for mpv.js player */}
      <div className="video-viewport">
        {!state.filePath ? (
          <div className="empty-player">
            <Icon icon="media" size={40} />
            <div className="empty-text">
              <h3>No video loaded</h3>
              <p>Drop a video file here or use the open button</p>
              {/* In a real implementation, we'd have a proper file picker */}
              <Button
                icon="folder-open"
                text="Open Video"
                intent="primary"
                className={Classes.BUTTON}
                onClick={() => {
                  // This would open a file picker in a real implementation
                  // For now, we'll just simulate loading a file
                  actions.loadFile('sample_video.mp4');
                }}
              />
            </div>
          </div>
        ) : (
          // This div will be replaced with the actual mpv.js component
          <div className="video-placeholder">
            <div className="video-info">
              {state.fileName}
              <br />
              {state.isPlaying ? 'Playing' : 'Paused'} at {state.currentTime.toFixed(2)} seconds
            </div>
          </div>
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
              icon={state.isFullscreen ? "minimize" : "maximize"}
              title={state.isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              minimal={true}
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