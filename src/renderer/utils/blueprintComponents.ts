// src/renderer/utils/blueprintComponents.ts
export {
  Button,
  ButtonGroup,
  Card,
  Callout,
  Checkbox,
  Classes,
  Dialog,
  Divider,
  FormGroup,
  FocusStyleManager,
  HTMLSelect,
  Icon,
  Label,
  Menu,
  MenuItem,
  NumericInput,
  Overlay,
  Popover,
  Position,
  ProgressBar,
  RangeSlider,
  Slider,
} from '@blueprintjs/core';

export { Colors } from '@blueprintjs/core';

// IColors interface for blueprintTheme.ts
export interface IColors {
  primary1?: string;
  primary2?: string;
  primary3?: string;
  primary4?: string;
  primary5?: string;
  appBackgroundColor?: string;
  dark1?: string;
  dark2?: string;
  dark3?: string;
  dark4?: string;
  dark5?: string;
  buttonPrimaryBackground?: string;
  buttonPrimaryHover?: string;
  buttonPrimaryActive?: string;
  interactionState1Hover?: string;
  interactionState1Active?: string;
  interactionState1Selected?: string;
  textHeading?: string;
  textPrimary?: string;
  textSecondary?: string;
  textDisabled?: string;
  formElementBackground?: string;
  formElementBorder?: string;
  formElementActiveBackground?: string;
  menuBackground?: string;
  tooltipBackground?: string;
  successColor?: string;
  warningColor?: string;
  dangerColor?: string;
}
