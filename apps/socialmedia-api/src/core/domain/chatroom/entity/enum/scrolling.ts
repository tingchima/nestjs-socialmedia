export enum Scrolling {
  UP = "UP",
  DOWN = "DOWN",
}

export const scrollingArray = [Scrolling.UP, Scrolling.DOWN];

const scrollingLookup: { [key: string]: Scrolling } = {
  UP: Scrolling.UP,
  DOWN: Scrolling.DOWN,
};

export function scrollingFromString(value: string): Scrolling {
  return scrollingLookup[value];
}
