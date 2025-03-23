import React from 'react';
import {
  Button,
  Slider,
  RangeSlider,
  Classes,
} from '../../utils/blueprintComponents';
import { usePlayer } from '../../context/PlayerContext';
import { formatTime } from '../../utils/timeFormatter';
import './Timeline.css';

interface TimelineProps {
  showFrameInfo?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ showFrameInfo = true }) => {
  const { state, actions } = usePlayer();

  const { duration, currentTime, inPoint, outPoint, isPlaying, fps } = state;

  // Calculate percent of playback progress
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Calculate current frame number
  const currentFrame = Math.round(currentTime * fps);
  const totalFrames = Math.round(duration * fps);

  // Handle timeline drag
  const handleTimelineChange = (value: number) => {
    actions.seekToPercent(value);
  };

  // Handle in/out range change
  const handleTrimRangeChange = (range: [number, number]) => {
    const [inPercent, outPercent] = range;
    const newInPoint = (inPercent / 100) * duration;
    const newOutPoint = (outPercent / 100) * duration;

    actions.setInPoint(newInPoint);
    actions.setOutPoint(newOutPoint);
  };

  // Convert in/out points to percentages for the range slider
  const inPointPercent = duration > 0 ? (inPoint / duration) * 100 : 0;
  const outPointPercent = duration > 0 ? (outPoint / duration) * 100 : 100;

  return (
    <div className="timeline-container">
      <div className="timeline-slider-container">
        {/* Playback progress indicator */}
        <Slider
          min={0}
          max={100}
          stepSize={0.1}
          labelRenderer={false}
          onChange={handleTimelineChange}
          value={progressPercent}
          className="timeline-slider"
          disabled={!state.filePath}
        />

        {/* In/Out trim points */}
        {state.filePath && (
          <RangeSlider
            min={0}
            max={100}
            stepSize={0.1}
            labelRenderer={false}
            onChange={handleTrimRangeChange}
            value={[inPointPercent, outPointPercent]}
            className="trim-range-slider"
          />
        )}
      </div>

      <div className="timeline-info">
        <div className="timeline-time">
          <span className="current-time">{formatTime(currentTime)}</span>
          <span className="duration">{formatTime(duration)}</span>
        </div>

        {showFrameInfo && state.filePath && (
          <div className="frame-info">
            <span className="current-frame">Frame: {currentFrame}</span>
            <span className="total-frames">/ {totalFrames}</span>
          </div>
        )}

        <div className="trim-points">
          <Button
            small
            minimal
            icon="arrow-left"
            text={`In: ${formatTime(inPoint)}`}
            onClick={actions.jumpToInPoint}
            disabled={!state.filePath}
            className={Classes.BUTTON}
          />
          <Button
            small
            minimal
            icon="arrow-right"
            text={`Out: ${formatTime(outPoint)}`}
            onClick={actions.jumpToOutPoint}
            disabled={!state.filePath}
            className={Classes.BUTTON}
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
