const { promisify } = require('util');
const fs = require('fs');
import convert from 'heic-convert';
import { copyExifTags, detectContainerType } from '../utilities';

export const convertHEICFileToJPEGWithEXIF = async (inputFilePath: string, outputFilePath: string): Promise<void> => {
  try {
    const containerType = await detectContainerType(inputFilePath);
    if (containerType === 'JPEG') {
      console.warn(`heicConvert.ts: Input is JPEG by signature, skipping conversion: ${inputFilePath}`);
      return;
    }
    if (containerType !== 'HEIF') {
      throw new Error(`Not a HEIF/HEIC container by signature: ${inputFilePath}`);
    }
    console.log(`heicConvert.ts: convertHEICFileToJPEGWithEXIF: ${inputFilePath} to ${outputFilePath}`);
    await convertHEICFileToJPEG(inputFilePath, outputFilePath);
    console.log('heicConvert.ts: convertHEICFileToJPEGWithEXIF: conversion done, copying EXIF tags');
    await copyExifTags(inputFilePath, outputFilePath, true);
    console.log('heicConvert.ts: convertHEICFileToJPEGWithEXIF: EXIF tags copied successfully');
  }
  catch (error) {
    console.error('heicConvert.ts: Error in convertHEICFileToJPEGWithEXIF:', error);
    throw error;  // Use throw instead of return Promise.reject(error)
  }
}

async function convertHEICFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {
  const inputBuffer = await promisify(fs.readFile)(inputFilePath);
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'JPEG',      // output format
    quality: 1           // the jpeg compression quality, between 0 and 1
  });
  console.log('heicConvert.ts: convertHEICFileToJPEG: conversion successful');
  await promisify(fs.writeFile)(outputFilePath, outputBuffer);
  console.log('heicConvert.ts: convertHEICFileToJPEG: file written to', outputFilePath);
}
