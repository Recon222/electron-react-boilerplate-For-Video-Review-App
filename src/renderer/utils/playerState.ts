/**
 * Utility functions for player state management
 * Handles common player state operations and transforms
 */

import { formatTime, secondsToSmpte } from './timeFormatter';

/**
 * Interface for video file metadata
 */
export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  format: string;
  codec: string;
  bitrate?: number;
  audioCodec?: string;
  audioChannels?: number;
  audioSampleRate?: number;
}

/**
 * Get video file information using mpv
 * This would be replaced with actual implementation once mpv.js is integrated
 */
export function getVideoMetadata(filePath: string): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    // This is a placeholder implementation.
    // In real code, we would use mpv.js or FFmpeg to get actual metadata.
    setTimeout(() => {
      resolve({
        duration: 120.5, // 2 minutes and 0.5 seconds
        width: 1920,
        height: 1080,
        fps: 29.97,
        format: 'MP4',
        codec: 'H.264',
        bitrate: 5000000, // 5 Mbps
        audioCodec: 'AAC',
        audioChannels: 2,
        audioSampleRate: 48000,
      });
    }, 500); // Simulate a delay for loading metadata
  });
}

/**
 * Format video information for display
 */
export function formatVideoInfo(metadata: VideoMetadata): string {
  const { width, height, fps, format, codec, duration } = metadata;
  const formattedDuration = formatTime(duration);

  return `${width}x${height} | ${format} (${codec}) | ${fps.toFixed(2)} fps | ${formattedDuration}`;
}

/**
 * Generate a thumbnail preview at a specific time
 * This is a placeholder that would be implemented with mpv.js or FFmpeg
 */
export function generateThumbnail(
  filePath: string,
  timeInSeconds: number,
): Promise<string> {
  return new Promise((resolve) => {
    // This is a placeholder. In real code, we would generate a real thumbnail.
    // For now, just return a placeholder data URL
    setTimeout(() => {
      resolve(
        `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`,
      );
    }, 100);
  });
}

/**
 * Calculate the aspect ratio based on width and height
 */
export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return '16:9'; // Default

  // Calculate GCD (Greatest Common Divisor)
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;

  // Check for common aspect ratios
  if (Math.abs(w / h - 16 / 9) < 0.01) return '16:9';
  if (Math.abs(w / h - 4 / 3) < 0.01) return '4:3';
  if (Math.abs(w / h - 21 / 9) < 0.01) return '21:9';

  // Return calculated ratio if not a common one
  return `${w}:${h}`;
}

/**
 * Format current playback time for overlay display
 */
export function formatPlaybackOverlay(
  currentTime: number,
  duration: number,
  fps: number,
): string {
  return `${formatTime(currentTime)} / ${formatTime(duration)} (${secondsToSmpte(currentTime, fps)})`;
}

/**
 * Generate a list of keyframes for a video
 * This is a placeholder that would be implemented with FFmpeg
 */
export function getKeyframes(filePath: string): Promise<number[]> {
  return new Promise((resolve) => {
    // This is a placeholder. In real code, we would extract actual keyframes.
    setTimeout(() => {
      // Generate some fake keyframe positions (in seconds)
      const fakeKeyframes = [
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
      ];
      resolve(fakeKeyframes);
    }, 1000);
  });
}

/**
 * Check if a file is a video based on extension
 */
export function isVideoFile(filename: string): boolean {
  const videoExtensions = [
    '.mp4',
    '.mkv',
    '.avi',
    '.mov',
    '.webm',
    '.wmv',
    '.flv',
    '.mpg',
    '.mpeg',
    '.m4v',
    '.3gp',
    '.ts',
  ];

  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return videoExtensions.includes(extension);
}

/**
 * Create a display-friendly filename from a path
 */
export function getDisplayFilename(filePath: string): string {
  if (!filePath) return '';

  // Extract filename from path (works for both Windows and Unix paths)
  const filename = filePath.split(/[\\/]/).pop() || '';

  // If filename is too long, truncate it
  if (filename.length > 40) {
    const extension = filename.substring(filename.lastIndexOf('.'));
    const basename = filename.substring(0, filename.lastIndexOf('.'));
    return `${basename.substring(0, 37)}...${extension}`;
  }

  return filename;
}

/**
 * Create a suggested output filename based on input and trim points
 */
export function suggestOutputFilename(
  inputFilename: string,
  inPoint: number,
  outPoint: number,
): string {
  if (!inputFilename) return 'output.mp4';

  const extension = inputFilename.substring(inputFilename.lastIndexOf('.'));
  const basename = inputFilename.substring(0, inputFilename.lastIndexOf('.'));

  // If trim points are set, include them in the filename
  if (inPoint > 0 || outPoint > 0) {
    const inStr = formatTime(inPoint).replace(/:/g, '-');
    const outStr = formatTime(outPoint).replace(/:/g, '-');
    return `${basename}_${inStr}_to_${outStr}${extension}`;
  }

  return `${basename}_edited${extension}`;
}

/**
 * Parse FFmpeg progress output for export progress updates
 */
export function parseFFmpegProgress(
  progressText: string,
  duration: number,
): number {
  if (!progressText || duration <= 0) return 0;

  // Try to extract time information
  const timeMatch = progressText.match(/time=(\d+):(\d+):(\d+\.\d+)/);
  if (!timeMatch) return 0;

  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const seconds = parseFloat(timeMatch[3]);

  const currentTime = hours * 3600 + minutes * 60 + seconds;
  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
}

export default {
  getVideoMetadata,
  formatVideoInfo,
  generateThumbnail,
  calculateAspectRatio,
  formatPlaybackOverlay,
  getKeyframes,
  isVideoFile,
  getDisplayFilename,
  suggestOutputFilename,
  parseFFmpegProgress,
};
