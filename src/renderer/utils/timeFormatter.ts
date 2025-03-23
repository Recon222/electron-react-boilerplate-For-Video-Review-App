/**
 * Utility functions for formatting and converting time displays for video player
 * Supports various formats including SMPTE timecode, seconds, and frame numbers
 */

/**
 * Format seconds to HH:MM:SS
 */
export function formatTime(seconds: number): string {
  if (Number.isNaN(seconds) || seconds < 0) {
    return '00:00:00';
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return [h, m, s].map((v) => v.toString().padStart(2, '0')).join(':');
}

/**
 * Format seconds to HH:MM:SS.ms
 */
export function formatTimeWithMs(seconds: number): string {
  if (Number.isNaN(seconds) || seconds < 0) {
    return '00:00:00.000';
  }

  const ms = Math.floor((seconds % 1) * 1000);
  return `${formatTime(seconds)}.${ms.toString().padStart(3, '0')}`;
}

/**
 * Convert seconds to SMPTE timecode format (HH:MM:SS:FF)
 * @param seconds - Time in seconds
 * @param fps - Frames per second of the video (default: 29.97)
 */
export function secondsToSmpte(seconds: number, fps: number = 29.97): string {
  if (Number.isNaN(seconds) || seconds < 0) {
    return '00:00:00:00';
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * fps);

  return [h, m, s, f].map((v) => v.toString().padStart(2, '0')).join(':');
}

/**
 * Convert SMPTE timecode to seconds
 * @param smpte - SMPTE timecode string (HH:MM:SS:FF)
 * @param fps - Frames per second of the video (default: 29.97)
 */
export function smpteToSeconds(smpte: string, fps: number = 29.97): number {
  if (!smpte || typeof smpte !== 'string') {
    return 0;
  }

  const parts = smpte.split(':');
  if (parts.length !== 4) {
    return 0;
  }

  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const s = parseInt(parts[2], 10);
  const f = parseInt(parts[3], 10);

  return h * 3600 + m * 60 + s + f / fps;
}

/**
 * Convert frame number to seconds
 * @param frame - Frame number
 * @param fps - Frames per second (default: 29.97)
 */
export function frameToSeconds(frame: number, fps: number = 29.97): number {
  if (Number.isNaN(frame) || frame < 0) {
    return 0;
  }
  return frame / fps;
}

/**
 * Convert seconds to frame number
 * @param seconds - Time in seconds
 * @param fps - Frames per second (default: 29.97)
 */
export function secondsToFrame(seconds: number, fps: number = 29.97): number {
  if (Number.isNaN(seconds) || seconds < 0) {
    return 0;
  }
  return Math.floor(seconds * fps);
}

/**
 * Format current/total time display for player
 * @param current - Current time in seconds
 * @param total - Total duration in seconds
 */
export function formatTimeDisplay(current: number, total: number): string {
  return `${formatTime(current)} / ${formatTime(total)}`;
}

/**
 * Parse timecode input which could be in different formats
 * @param input - Timecode input string (accepts HH:MM:SS, HH:MM:SS.ms, HH:MM:SS:FF)
 * @param fps - Frames per second (default: 29.97)
 */
export function parseTimecode(input: string, fps: number = 29.97): number {
  if (!input || typeof input !== 'string') {
    return 0;
  }

  // Check if it's SMPTE format (HH:MM:SS:FF)
  if (input.match(/^\d{2}:\d{2}:\d{2}:\d{2}$/)) {
    return smpteToSeconds(input, fps);
  }

  // Check if it's HH:MM:SS.ms format
  if (input.match(/^\d{2}:\d{2}:\d{2}\.\d{1,3}$/)) {
    const parts = input.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const sms = parts[2].split('.');
    const s = parseInt(sms[0], 10);
    const ms = parseInt(sms[1], 10);
    return h * 3600 + m * 60 + s + ms / 1000;
  }

  // Check if it's HH:MM:SS format
  if (input.match(/^\d{2}:\d{2}:\d{2}$/)) {
    const parts = input.split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const s = parseInt(parts[2], 10);
    return h * 3600 + m * 60 + s;
  }

  // Try to parse as seconds number
  const seconds = parseFloat(input);
  return Number.isNaN(seconds) ? 0 : seconds;
}

/**
 * Format frame count to display time in multiple formats
 * @param frameCount - Current frame number
 * @param totalFrames - Total frames in video
 * @param fps - Frames per second
 */
export function formatFrameDisplay(
  frameCount: number,
  totalFrames: number,
  fps: number = 29.97,
): string {
  const currentTime = frameToSeconds(frameCount, fps);
  const totalTime = frameToSeconds(totalFrames, fps);
  const smpte = secondsToSmpte(currentTime, fps);

  return `Frame: ${frameCount}/${totalFrames} - ${smpte} - ${formatTime(currentTime)}`;
}

/**
 * Calculate percent completion based on current time and duration
 */
export function calculateProgress(
  currentTime: number,
  duration: number,
): number {
  if (Number.isNaN(currentTime) || Number.isNaN(duration) || duration <= 0) {
    return 0;
  }
  return (currentTime / duration) * 100;
}

/**
 * Convert percent progress to time in seconds
 */
export function progressToTime(
  progressPercent: number,
  duration: number,
): number {
  if (Number.isNaN(progressPercent) || Number.isNaN(duration)) {
    return 0;
  }
  return (progressPercent / 100) * duration;
}

export default {
  formatTime,
  formatTimeWithMs,
  secondsToSmpte,
  smpteToSeconds,
  frameToSeconds,
  secondsToFrame,
  formatTimeDisplay,
  parseTimecode,
  formatFrameDisplay,
  calculateProgress,
  progressToTime,
};
