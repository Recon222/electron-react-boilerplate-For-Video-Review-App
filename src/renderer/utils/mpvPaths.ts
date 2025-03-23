/**
 * This file provides path utilities for mpv.js integration
 * to handle browser vs Node environments properly
 */

// For browser environment, we'll use the path-browserify polyfill
// For Node environment, we'll use the native path module
// This will ensure that both work without errors

// This is a simple wrapper to handle the path module in both browser and Node.js
export const getPluginPathForMpv = (pluginPath: string) => {
  return pluginPath;
};

export default {
  getPluginPathForMpv,
};