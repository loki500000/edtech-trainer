/**
 * Type definitions for Figma to React Native generator
 */

export interface ParsedNode {
  type: string;
  name: string;
  children?: ParsedNode[];
  styles: StyleProperties;
  content?: string;
  props?: Record<string, any>;
}

export interface StyleProperties {
  layout?: LayoutStyles;
  appearance?: AppearanceStyles;
  typography?: TypographyStyles;
  effects?: EffectStyles;
}

export interface LayoutStyles {
  display?: 'flex';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginVertical?: number;
  marginHorizontal?: number;
  gap?: number;
  flex?: number;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: number | string;
  position?: 'relative' | 'absolute';
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  zIndex?: number;
}

export interface AppearanceStyles {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderTopWidth?: number;
  borderRightWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  opacity?: number;
  overflow?: 'visible' | 'hidden' | 'scroll';
}

export interface TypographyStyles {
  color?: string;
  fontSize?: number;
  fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold';
  fontFamily?: string;
  fontStyle?: 'normal' | 'italic';
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface EffectStyles {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number; // Android shadow
}

export interface GeneratorOptions {
  styleType: 'StyleSheet' | 'styled-components';
  componentName?: string;
  useTypeScript?: boolean;
  exportAssets?: boolean;
}

export interface GeneratedCode {
  component: string;
  styles?: string;
  imports: string[];
}

export type FigmaNodeType =
  | 'FRAME'
  | 'GROUP'
  | 'RECTANGLE'
  | 'TEXT'
  | 'ELLIPSE'
  | 'POLYGON'
  | 'STAR'
  | 'VECTOR'
  | 'IMAGE'
  | 'INSTANCE'
  | 'COMPONENT';
