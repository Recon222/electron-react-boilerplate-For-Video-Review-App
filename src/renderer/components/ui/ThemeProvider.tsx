import React, { ReactNode, useEffect } from 'react';
import { Classes, FocusStyleManager } from '../../utils/blueprintComponents';
import { blueprintTheme, cssVariables } from '../../styles/blueprintTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Custom ThemeProvider component that applies our North Carolina blue Blueprint theme
 * This wraps the application and provides the desktop app styling
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Disable focus outline for mouse users, keep for keyboard users
  useEffect(() => {
    FocusStyleManager.onlyShowFocusOnTabs();

    // Apply CSS variables to the document root
    const root = document.documentElement;
    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Apply blueprint theme overrides
    const style = document.createElement('style');

    // Generate CSS for Blueprint overrides
    const cssOverrides = `
      /* Base application styling */
      body, html {
        background-color: ${blueprintTheme.colors?.appBackgroundColor};
        color: ${blueprintTheme.colors?.textPrimary};
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
      }

      /* Override Blueprint button colors */
      .${Classes.BUTTON}.${Classes.INTENT_PRIMARY} {
        background-color: ${blueprintTheme.colors?.buttonPrimaryBackground};
      }

      .${Classes.BUTTON}.${Classes.INTENT_PRIMARY}:hover {
        background-color: ${blueprintTheme.colors?.buttonPrimaryHover};
      }

      .${Classes.BUTTON}.${Classes.INTENT_PRIMARY}:active {
        background-color: ${blueprintTheme.colors?.buttonPrimaryActive};
      }

      /* Card and panel styling */
      .${Classes.CARD} {
        background-color: ${blueprintTheme.colors?.dark2};
        border: 1px solid ${blueprintTheme.colors?.dark3};
      }

      /* Form elements */
      .${Classes.INPUT} {
        background-color: ${blueprintTheme.colors?.formElementBackground};
        color: ${blueprintTheme.colors?.textPrimary};
        border-color: ${blueprintTheme.colors?.formElementBorder};
      }

      /* Timeline and slider components */
      .${Classes.SLIDER} {
        height: 20px;
      }

      .${Classes.SLIDER}-track {
        background-color: ${blueprintTheme.colors?.dark3};
      }

      .${Classes.SLIDER}-progress {
        background-color: ${blueprintTheme.colors?.primary4};
      }

      .${Classes.SLIDER}-handle {
        background-color: ${blueprintTheme.colors?.primary5};
        width: 12px;
        height: 18px;
        border-radius: 3px;
      }

      /* Scrollbars for desktop feel */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: ${blueprintTheme.colors?.dark1};
      }

      ::-webkit-scrollbar-thumb {
        background: ${blueprintTheme.colors?.dark3};
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${blueprintTheme.colors?.dark4};
      }
    `;

    style.innerHTML = cssOverrides;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={Classes.DARK}>
      {children}
    </div>
  );
};

export default ThemeProvider;