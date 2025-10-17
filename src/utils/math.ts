export function random(from: number, to: number): number {
  if (from > to) {
    throw new RangeError(`random(): “from” (${from}) must be less than or equal to “to” (${to}).`);
  }
  return Math.floor(Math.random() * (to - from + 1)) + from;
}
