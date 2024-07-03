import { parsePosition } from '@src/utils/parse-position';

export const triggerId = {
  grab: 'context-menu-grap-trigger',
  open: 'context-menu-open-trigger',
} as const;

export interface Position {
  x: number;
  y: number;
}

// 36 is the width of the trigger element
export const initialPosition = { x: `100% - ${36 + 20}px`, y: `50% - 60px` };
export const parsedInitialPosition = {
  x: parsePosition(initialPosition.x, 'x'),
  y: parsePosition(initialPosition.y, 'y'),
};

export const initialSize = { width: 400, height: 400 };
// gap between the context menu and the trigger element, and the context menu and the edge of the screen
export const gap = 5;
