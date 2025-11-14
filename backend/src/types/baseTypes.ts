import { Response } from 'express';

export type StringToStringLUT = {
  [key: string]: string;
}

export type StringToNumberLUT = {
  [key: string]: number;
}

export type TypedResponse<T> = Response & {
  json: (body: T) => Response;
};

