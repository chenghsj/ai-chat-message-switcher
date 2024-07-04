import { parsePosition } from '@src/utils/parse-position';

export const triggerId = {
  grabContextMenu: 'context-menu-grap-trigger',
  openContextMenu: 'context-menu-open-trigger',
} as const;

export interface Position {
  x: number;
  y: number;
}

// 36 is the width of the trigger element
export const initialControlPanelPosition = {
  x: `100% - ${36 + 20}px`,
  y: `50% - 60px`,
};
export const parsedInitialControlPanelPosition = {
  x: parsePosition(initialControlPanelPosition.x, 'x'),
  y: parsePosition(initialControlPanelPosition.y, 'y'),
};

export const initialContextMenuPosition = { x: 0, y: 0 };

export const initialSize = { width: 400, height: 400 };
// gap between the context menu and the trigger element, and the context menu and the edge of the screen
export const gap = 5;
