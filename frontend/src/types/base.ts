import { Keyword, KeywordNode } from './entities';

// export const serverUrl = 'http://localhost:8080';
// export const serverUrl = 'http://localhost:5173';
// export const serverUrl = 'https://tsmealwheel.herokuapp.com';
// export const serverUrl = (window as any).__ENV__?.BACKEND_URL || 'http://localhost:8080';
export const getServerUrl = (): string => {
  return (window as any).__ENV__?.BACKEND_URL || 'http://localhost:8080';
};

export const apiUrlFragment = '/api/v1/';

export type StringToStringLUT = {
  [key: string]: string;
}

export type StringToStringArrayLUT = {
  [key: string]: string[];
}

export type StringToBooleanLUT = {
  [key: string]: boolean;
}

export type StringToKeywordLUT = {
  [key: string]: Keyword;
}

export type StringToKeywordNodeLUT = {
  [key: string]: KeywordNode;
}

export type StringToNumberLUT = {
  [key: string]: number;
}

export type Dimensions = {
  width: number;
  height: number;
};

export const SurveyViewOrientations = {
  Horizontal: 'horizontal',
  Vertical: 'vertical',
} as const;

export type SurveyViewOrientation = typeof SurveyViewOrientations[keyof typeof SurveyViewOrientations];
