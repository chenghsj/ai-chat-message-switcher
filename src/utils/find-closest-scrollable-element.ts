// not being used

function isScrollable(element: HTMLElement): boolean {
  const hasScrollableContent = element.scrollHeight > element.clientHeight;
  const overflowYStyle = window.getComputedStyle(element).overflowY;
  const isOverflowHidden = overflowYStyle.indexOf('hidden') === -1;
  return hasScrollableContent && isOverflowHidden;
}

export function findClosestScrollableElement(
  element: HTMLElement
): HTMLElement | null {
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    if (isScrollable(currentElement)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  return null;
}
