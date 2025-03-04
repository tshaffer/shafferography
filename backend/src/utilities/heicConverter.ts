const { promisify } = require('util');
const fs = require('fs');
import convert from 'heic-convert';
import { copyExifTags } from '../utilities';
const libheif = require('libheif-js');

export const convertHEICFileToJPEGWithEXIF = async (inputFilePath: string, outputFilePath: string): Promise<void> => {
  try {
    console.log(`convertHEICFileToJPEGWithEXIF: ${inputFilePath} to ${outputFilePath}`);
    await convertHEICFileToJPEG(inputFilePath, outputFilePath);
    // copyExifTags(inputFilePath, outputFilePath, true);
  }
  catch (error) {
    console.error('Error in convertHEICFileToJPEGWithEXIF:', error);
    throw error;  // Use throw instead of return Promise.reject(error)
  }
}

async function convertHEICFileToJPEG(inputFilePath: string, outputFilePath: string): Promise<void> {
  const file = fs.readFileSync(inputFilePath);
  const decoder = new libheif.HeifDecoder();
  const data = await decoder.decode(file);
  console.log('Decoded HEIF data:', data);

  // const inputBuffer = await promisify(fs.readFile)(inputFilePath);
  // await decodeHEIF(inputBuffer);
  // const outputBuffer = await convert({
  //   buffer: inputBuffer, // the HEIC file buffer
  //   format: 'JPEG',      // output format
  //   quality: 1           // the jpeg compression quality, between 0 and 1
  // });
  // await promisify(fs.writeFile)(outputFilePath, outputBuffer);
}
