export const textEllipsis = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength - 3).trimEnd() + "...";
  }
  return str.padEnd(maxLength);
};
