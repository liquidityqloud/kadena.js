import { act, fireEvent } from '@testing-library/react';
import type { pointerKey } from '@testing-library/user-event';
import { vi } from 'vitest';

// Triggers a "press" event on an element.
// TODO: move to somewhere more common
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function triggerPress(element: Element, opts = {}) {
  fireEvent.mouseDown(element, { detail: 1, ...opts });
  fireEvent.mouseUp(element, { detail: 1, ...opts });
  fireEvent.click(element, { detail: 1, ...opts });
}

// Triggers a "touch" event on an element.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function triggerTouch(element: Element, opts = {}) {
  fireEvent.pointerDown(element, { pointerType: 'touch', ...opts });
  fireEvent.pointerUp(element, { pointerType: 'touch', ...opts });
}

// Triggers a "longPress" event on an element.
// eslint-disable-next-line @kadena-dev/typedef-var
export const DEFAULT_LONG_PRESS_TIME = 500;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function triggerLongPress(element: Element, opts = {}) {
  fireEvent.pointerDown(element, { pointerType: 'touch', ...opts });
  act(() => {
    vi.advanceTimersByTime(DEFAULT_LONG_PRESS_TIME);
  });
  fireEvent.pointerUp(element, { pointerType: 'touch', ...opts });
}

export const pointerMap: pointerKey[] = [
  {
    name: 'MouseLeft',
    pointerType: 'mouse',
    button: 'primary',
    height: 1,
    width: 1,
    pressure: 0.5,
  },
  { name: 'MouseRight', pointerType: 'mouse', button: 'secondary' },
  { name: 'MouseMiddle', pointerType: 'mouse', button: 'auxiliary' },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
  { name: 'TouchB', pointerType: 'touch' },
  { name: 'TouchC', pointerType: 'touch' },
] as unknown as pointerKey[];
