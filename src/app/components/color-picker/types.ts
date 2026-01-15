export interface IColor {
  hex: string;
  rgb: IColorRgb;
  hsv: IColorHsv;
}

interface IColorRgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface IColorHsv {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface IInteractiveProps {
  onCoordinateChange: (final: boolean, x: number, y: number) => void;
  //     children: React.ReactNode;
  disabled?: boolean;
}

export type TInteractionEvent =
  | React.MouseEvent<HTMLDivElement>
  | React.TouchEvent<HTMLDivElement>
  | MouseEvent
  | TouchEvent;
export type TMoveEvent =
  | React.MouseEvent<HTMLDivElement>
  | React.Touch
  | MouseEvent
  | Touch;

export interface ISaturationProps {
  height: number;
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}

export interface IHueProps {
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}

export interface IAlphaProps {
  color: IColor;
  disabled?: boolean;
  onChange: (color: IColor) => void;
  onChangeComplete?: (color: IColor) => void;
}
