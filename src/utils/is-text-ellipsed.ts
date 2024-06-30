export function isTextEllipsed(element: HTMLElement): boolean {
  // Create a temporary span to compare dimensions
  const tempSpan: HTMLSpanElement = document.createElement('span');
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.whiteSpace = 'nowrap';
  tempSpan.textContent = element.textContent;
  document.body.appendChild(tempSpan);
  // Compare the width of the element to the width of the temporary span
  const isEllipsed: boolean = tempSpan.offsetWidth > element.offsetWidth;

  // Clean up
  document.body.removeChild(tempSpan);

  return isEllipsed;
}
