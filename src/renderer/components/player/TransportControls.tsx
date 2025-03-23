import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Slider,
  Popover,
  Position,
  Menu,
  MenuItem,
  Divider,
  Classes,
  Icon
} from '@blueprintjs/core';
import { usePlayer } from '../../context/PlayerContext';
import './TransportControls.css';

interface TransportControlsProps {
  compact?: boolean;
  showExportButton?: boolean;
}

const TransportControls: React.FC<TransportControlsProps> = ({
  compact = false,
  showExportButton = true
}) => {
  const { state, actions } = usePlayer();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const {
    isPlaying,
    volume,
    muted,
    playbackRate,
    filePath,
    isExporting
  } = state;

  // Handle playback rate change
  const handlePlaybackRateChange = (rate: number) => {
    actions.setPlaybackRate(rate);
  };

  // Handle volume change
  const handleVolumeChange = (value: number) => {
    actions.setVolume(value);
  };

  // Get the appropriate volume icon based on volume level and mute state
  const getVolumeIcon = () => {
    if (muted || volume === 0) return 'volume-off';
    if (volume < 0.3) return 'volume-down';
    if (volume < 0.7) return 'volume';
    return 'volume-up';
  };

  // Playback rate menu
  const playbackRateMenu = (
    <Menu>
      <MenuItem text="0.25x" onClick={() => handlePlaybackRateChange(0.25)} />
      <MenuItem text="0.5x" onClick={() => handlePlaybackRateChange(0.5)} />
      <MenuItem text="0.75x" onClick={() => handlePlaybackRateChange(0.75)} />
      <MenuItem text="Normal (1x)" onClick={() => handlePlaybackRateChange(1)} />
      <MenuItem text="1.25x" onClick={() => handlePlaybackRateChange(1.25)} />
      <MenuItem text="1.5x" onClick={() => handlePlaybackRateChange(1.5)} />
      <MenuItem text="2x" onClick={() => handlePlaybackRateChange(2)} />
    </Menu>
  );

  return (
    <div className={`transport-controls ${compact ? 'compact' : ''}`}>
      <div className="transport-main-controls">
        {/* Left side - Step controls */}
        <ButtonGroup minimal={true} className="step-controls">
          <Button
            icon="step-backward"
            title="Jump to start"
            onClick={() => actions.seek(0)}
            disabled={!filePath}
            className={Classes.BUTTON}
          />
          <Button
            icon="chevron-backward"
            title="Previous frame"
            onClick={actions.stepBackward}
            disabled={!filePath}
            className={Classes.BUTTON}
          />

          {/* Play/Pause button */}
          <Button
            icon={isPlaying ? 'pause' : 'play'}
            title={isPlaying ? 'Pause' : 'Play'}
            onClick={actions.togglePlayPause}
            disabled={!filePath}
            className={`${Classes.BUTTON} play-pause-button`}
          />

          <Button
            icon="chevron-forward"
            title="Next frame"
            onClick={actions.stepForward}
            disabled={!filePath}
            className={Classes.BUTTON}
          />
          <Button
            icon="step-forward"
            title="Jump to end"
            onClick={() => actions.seek(state.duration)}
            disabled={!filePath}
            className={Classes.BUTTON}
          />
        </ButtonGroup>

        {/* Right side - Volume and settings */}
        <div className="transport-right-controls">
          {/* Volume control */}
          <div className="volume-control">
            <Popover
              position={Position.TOP}
              isOpen={showVolumeSlider}
              onInteraction={setShowVolumeSlider}
              content={
                <div className="volume-slider-container">
                  <Slider
                    min={0}
                    max={1}
                    stepSize={0.01}
                    labelRenderer={false}
                    onChange={handleVolumeChange}
                    value={muted ? 0 : volume}
                    vertical={true}
                    className="volume-slider"
                  />
                </div>
              }
            >
              <Button
                icon={getVolumeIcon()}
                title="Volume"
                onClick={actions.toggleMute}
                className={Classes.BUTTON}
              />
            </Popover>
          </div>

          {/* Playback rate control */}
          <Popover
            position={Position.TOP}
            content={playbackRateMenu}
          >
            <Button
              icon="speed"
              text={!compact ? `${playbackRate}x` : undefined}
              title="Playback speed"
              disabled={!filePath}
              className={Classes.BUTTON}
            />
          </Popover>

          {/* Export button */}
          {showExportButton && (
            <Button
              icon="export"
              text={!compact ? "Export" : undefined}
              title="Export video clip"
              intent="primary"
              disabled={!filePath || isExporting}
              loading={isExporting}
              onClick={() => {
                if (filePath) {
                  // This would typically open an export dialog
                  // For now, we'll just trigger export with default settings
                  actions.startExport(state.exportFormat, state.exportQuality);
                }
              }}
              className={`${Classes.BUTTON} export-button`}
            />
          )}
        </div>
      </div>

      {/* If in compact mode, hide less important controls */}
      {!compact && (
        <div className="transport-secondary-controls">
          <ButtonGroup minimal={true}>
            <Button
              icon="list"
              text="Jump to In/Out Points"
              title="Show trim points"
              disabled={!filePath}
              className={Classes.BUTTON}
              onClick={() => {
                // This would typically show a menu of jump points
                // For now, just jump to in point
                actions.jumpToInPoint();
              }}
            />
          </ButtonGroup>

          <div className="playback-info">
            {filePath && (
              <span className="current-file">
                <Icon icon="video" />
                {state.fileName}
              </span>
            )}

            {playbackRate !== 1 && (
              <span className="playback-rate-indicator">
                {playbackRate}x
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportControls;