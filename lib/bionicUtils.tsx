import React from 'react';

export const applyBionic = (word: string) => {
  if (word.length <= 2) {
    return <><b style={{ fontWeight: 700 }}>{word[0]}</b>{word.slice(1)}</>;
  } else if (word.length <= 4) {
    return <><b style={{ fontWeight: 700 }}>{word.slice(0, 2)}</b>{word.slice(2)}</>;
  } else {
    const boldLength = Math.ceil(word.length * 0.4);
    return <><b style={{ fontWeight: 700 }}>{word.slice(0, boldLength)}</b>{word.slice(boldLength)}</>;
  }
};