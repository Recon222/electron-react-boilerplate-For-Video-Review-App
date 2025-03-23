import { Colors } from '@blueprintjs/core/lib/esm/common/colors';
import { IColors } from '@blueprintjs/core/lib/esm/common/colors';

// Define our North Carolina blue color palette
export const ncBlueColors = {
  // Primary Carolina Blue
  carolinaBlue: '#4B9CD3',
  carolinaBlueDark: '#3A7CA5',
  carolinaBlueLight: '#6FB5E7',

  // Accent colors
  navy: '#13294B',
  lightBlue: '#8DB9E5',
  ultraLightBlue: '#C6DBEF',

  // UI element colors
  buttonBlue: '#3E87C7',
  activeBlue: '#5DAAE5',
  hoverBlue: '#2E77B7',

  // Background colors
  darkBgColor: '#1C2B3A',
  bgColor: '#253748',
  lightBgColor: '#34495E',

  // Text colors
  textColor: '#FFFFFF',
  textMuted: '#E0E0E0',
  textDisabled: '#A0A0A0',

  // Functional colors
  success: '#43BF4D',
  warning: '#FFB366',
  danger: '#FF7373',

  // Neutral colors
  darkGray: '#252A31',
  gray: '#394B59',
  lightGray: '#8A9BA8',
};

/**
 * Custom Blueprint.js theme override with North Carolina blue palette
 * This creates a theme that resembles the blue desktop application style
 */
export const blueprintTheme = {
  // Override Blueprint's dark theme colors
  colors: {
    ...Colors.DARK_GRAY,

    // Primary color
    primary1: ncBlueColors.navy,
    primary2: ncBlueColors.bgColor,
    primary3: ncBlueColors.carolinaBlueDark,
    primary4: ncBlueColors.carolinaBlue,
    primary5: ncBlueColors.carolinaBlueLight,

    // App background colors
    appBackgroundColor: ncBlueColors.darkBgColor,
    dark1: ncBlueColors.darkBgColor,
    dark2: ncBlueColors.bgColor,
    dark3: ncBlueColors.lightBgColor,
    dark4: ncBlueColors.gray,
    dark5: ncBlueColors.lightGray,

    // Button colors
    buttonPrimaryBackground: ncBlueColors.buttonBlue,
    buttonPrimaryHover: ncBlueColors.hoverBlue,
    buttonPrimaryActive: ncBlueColors.activeBlue,

    // Interactive elements
    interactionState1Hover: ncBlueColors.hoverBlue,
    interactionState1Active: ncBlueColors.activeBlue,
    interactionState1Selected: ncBlueColors.carolinaBlue,

    // Text colors
    textHeading: ncBlueColors.textColor,
    textPrimary: ncBlueColors.textColor,
    textSecondary: ncBlueColors.textMuted,
    textDisabled: ncBlueColors.textDisabled,

    // Form element colors
    formElementBackground: ncBlueColors.darkBgColor,
    formElementBorder: ncBlueColors.lightGray,
    formElementActiveBackground: ncBlueColors.bgColor,

    // Other UI elements
    menuBackground: ncBlueColors.bgColor,
    tooltipBackground: ncBlueColors.navy,

    // Status colors
    successColor: ncBlueColors.success,
    warningColor: ncBlueColors.warning,
    dangerColor: ncBlueColors.danger,
  } as Partial<IColors>,
};

// Export CSS variables for custom styling
export const cssVariables = {
  '--nc-carolina-blue': ncBlueColors.carolinaBlue,
  '--nc-navy': ncBlueColors.navy,
  '--nc-bg-color': ncBlueColors.bgColor,
  '--nc-dark-bg-color': ncBlueColors.darkBgColor,
  '--nc-light-bg-color': ncBlueColors.lightBgColor,
  '--nc-text-color': ncBlueColors.textColor,
  '--nc-button-blue': ncBlueColors.buttonBlue,
};

export default blueprintTheme;