import React, { useState } from 'react';
import { Card, FormGroup, HTMLSelect, Slider, Button, ProgressBar, Callout, Classes, Label, Checkbox, NumericInput } from '../../utils/blueprintComponents';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime, formatTimeWithMs } from '../../utils/timeFormatter';
import './ExportPanel.css';

interface ExportPanelProps {
  onClose?: () => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onClose }) => {
  const { state, actions } = usePlayer();

  // Local state for export settings
  const [format, setFormat] = useState(state.exportFormat);
  const [quality, setQuality] = useState(state.exportQuality);
  const [useInOutPoints, setUseInOutPoints] = useState(true);
  const [includeSmpte, setIncludeSmpte] = useState(false);
  const [outputFileName, setOutputFileName] = useState(() => {
    // Generate default filename from original file
    if (state.fileName) {
      const baseName = state.fileName.replace(/\.[^/.]+$/, ''); // Remove extension
      return `${baseName}_edited`;
    }
    return 'exported_video';
  });

  // Calculate size estimate based on quality and duration
  const calculateSizeEstimate = (): string => {
    if (!state.duration) return 'Unknown';

    // Duration in seconds to process
    const processDuration = useInOutPoints
      ? state.outPoint - state.inPoint
      : state.duration;

    // Base bitrate estimates by format (in kbps)
    const baseBitrates: Record<string, number> = {
      'mp4': 3000,
      'webm': 2000,
      'mov': 4000,
      'mkv': 3500,
      'avi': 5000
    };

    // Quality factor (0.2 to 1.5 based on quality 1-100)
    const qualityFactor = 0.2 + (quality / 100) * 1.3;

    // Calculate bitrate
    const bitrate = baseBitrates[format] || 3000;
    const adjustedBitrate = bitrate * qualityFactor;

    // Estimate size in MB (bitrate in kbps * duration in seconds / 8000)
    const estimatedSizeMb = (adjustedBitrate * processDuration) / 8000;

    return estimatedSizeMb < 1000
      ? `${estimatedSizeMb.toFixed(1)} MB`
      : `${(estimatedSizeMb / 1000).toFixed(2)} GB`;
  };

  // Handle export button click
  const handleExport = () => {
    actions.startExport(format, quality);
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (state.isExporting) {
      actions.cancelExport();
    }
    if (onClose) {
      onClose();
    }
  };

  // Calculate visual indicator for quality level
  const getQualityLabel = (value: number): string => {
    if (value < 20) return 'Low';
    if (value < 40) return 'Medium';
    if (value < 60) return 'High';
    if (value < 80) return 'Very High';
    return 'Maximum';
  };

  // Format list with common formats for video export
  const formats = [
    { label: 'MP4 (H.264)', value: 'mp4' },
    { label: 'WebM (VP9)', value: 'webm' },
    { label: 'MOV (QuickTime)', value: 'mov' },
    { label: 'MKV (Matroska)', value: 'mkv' },
    { label: 'AVI', value: 'avi' }
  ];

  return (
    <Card className="export-panel">
      <h2>Export Video</h2>

      {/* File information */}
      <Callout className="file-info">
        <div className="file-detail">
          <span className="label">Source:</span>
          <span className="value">{state.fileName || 'No file loaded'}</span>
        </div>
        {useInOutPoints && (
          <>
            <div className="file-detail">
              <span className="label">Trim range:</span>
              <span className="value">
                {formatTime(state.inPoint)} - {formatTime(state.outPoint)}
              </span>
            </div>
            <div className="file-detail">
              <span className="label">Duration:</span>
              <span className="value">
                {formatTime(state.outPoint - state.inPoint)}
              </span>
            </div>
          </>
        )}
      </Callout>

      <div className="export-form">
        {/* Format selection */}
        <FormGroup
          label="Format"
          labelFor="format-select"
          className="form-group"
        >
          <HTMLSelect
            id="format-select"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={state.isExporting}
            options={formats}
            fill={true}
          />
        </FormGroup>

        {/* Quality slider */}
        <FormGroup
          label={`Quality: ${getQualityLabel(quality)}`}
          labelFor="quality-slider"
          className="form-group"
        >
          <Slider
            id="quality-slider"
            min={1}
            max={100}
            stepSize={1}
            labelStepSize={25}
            onChange={setQuality}
            value={quality}
            disabled={state.isExporting}
            className="quality-slider"
          />
          <div className="quality-info">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </FormGroup>

        {/* Output filename */}
        <FormGroup
          label="Output filename"
          labelFor="filename-input"
          className="form-group"
        >
          <div className="filename-input-group">
            <input
              id="filename-input"
              type="text"
              className={Classes.INPUT}
              value={outputFileName}
              onChange={(e) => setOutputFileName(e.target.value)}
              disabled={state.isExporting}
            />
            <span className="file-extension">.{format}</span>
          </div>
        </FormGroup>

        {/* Trim options */}
        <FormGroup className="form-group checkbox-group">
          <Checkbox
            label="Use in/out points"
            checked={useInOutPoints}
            onChange={(e) => setUseInOutPoints(e.currentTarget.checked)}
            disabled={state.isExporting}
          />
          <Checkbox
            label="Embed SMPTE timecode"
            checked={includeSmpte}
            onChange={(e) => setIncludeSmpte(e.currentTarget.checked)}
            disabled={state.isExporting}
          />
        </FormGroup>

        {/* File size estimate */}
        <div className="size-estimate">
          <span className="label">Estimated size:</span>
          <span className="value">{calculateSizeEstimate()}</span>
        </div>
      </div>

      {/* Progress bar for export */}
      {state.isExporting && (
        <div className="export-progress">
          <ProgressBar
            value={state.exportProgress / 100}
            intent="primary"
            stripes={true}
            className="progress-bar"
          />
          <div className="progress-text">
            Exporting: {Math.round(state.exportProgress)}%
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="export-actions">
        <Button
          text="Cancel"
          onClick={handleCancel}
          className={Classes.BUTTON}
        />
        <Button
          text={state.isExporting ? "Exporting..." : "Export"}
          intent="primary"
          onClick={handleExport}
          disabled={state.isExporting || !state.filePath}
          loading={state.isExporting}
          className={Classes.BUTTON}
        />
      </div>
    </Card>
  );
};

export default ExportPanel;