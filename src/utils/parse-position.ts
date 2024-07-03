export const parsePosition = (
  pos: string | number,
  axis: 'x' | 'y'
): number => {
  if (typeof pos === 'number') return pos;

  const percentageMatch = pos.match(/([0-9]+)%/);
  const offsetMatch = pos.match(/([-+]?[0-9]+)px$/);
  const operatorMatch = pos.match(/([-+])/);

  if (percentageMatch) {
    const percentage = parseFloat(percentageMatch[1]);
    const offset = offsetMatch ? parseFloat(offsetMatch[1]) : 0;
    const operator = operatorMatch ? operatorMatch[0] : '+';
    const parentSize = axis === 'x' ? window.innerWidth : window.innerHeight;

    return operator === '+'
      ? (parentSize * percentage) / 100 + offset
      : (parentSize * percentage) / 100 - offset;
  }

  return parseFloat(pos);
};
