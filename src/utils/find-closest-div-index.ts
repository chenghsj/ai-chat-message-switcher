export function findClosestDivIndex(divs: HTMLElement[]): number {
  // Get the current scroll position from the top of the document
  const scrollPosition = window.scrollY + window.innerHeight / 2; // Use the middle of the viewport for better accuracy

  // Initialize variables to store the closest index and the smallest distance
  let closestIndex: number = -1;
  let smallestDistance: number = Infinity;

  // Loop through each div
  divs.forEach((div, index) => {
    // Calculate the distance from the scroll position to the top of the div
    const divTop: number = div.getBoundingClientRect().top + window.scrollY;
    const distance: number = Math.abs(scrollPosition - divTop);

    // Update the closest index if the current distance is smaller
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestIndex = index;
    }
  });

  // Return the index of the closest div
  return closestIndex;
}
