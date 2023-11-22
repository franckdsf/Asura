import { useState } from "react";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + charCode;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function generateRandomNumber(seed: string): number {
  let numSeed = hashString(seed);
  let x = Math.sin(numSeed++) * 10010;
  return x - Math.floor(x);
}

function randomChunk<T>(array: T[], seed: string): (T[])[] {
  let productChunks: (T[])[] = [];
  while (array.length) {
    let size = Math.min(Math.floor(generateRandomNumber(seed) * array.length) + 1, 2);
    let chunk = array.splice(0, size);
    productChunks.push(chunk);
  }
  return productChunks;
}

/**
 * @param seed a string to generate random number from
 * @returns a float between 0 and 1
 */
export const useRandomSeed = (seed?: string) => {
  const [randomNumber, setRandomNumber] = useState(seed ? generateRandomNumber(seed) : 0);

  const updateNumber = (s: string) => setRandomNumber(generateRandomNumber(s));

  return {
    number: [randomNumber, updateNumber],
    generateRandomNumber,
    randomChunk
  } as const;
}