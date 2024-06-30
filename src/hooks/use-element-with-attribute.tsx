import { useEffect, useState } from 'react';

export function useElementsWithAttribute(
  attribute: string,
  value: string
): HTMLElement[] {
  const [elements, setElements] = useState<HTMLElement[]>([]);

  useEffect(() => {
    function findElements() {
      const selector = `[${attribute}="${value}"]`;
      const foundElements = document.querySelectorAll<HTMLElement>(selector);
      setElements(Array.from(foundElements));
    }

    // Find elements on initial render
    findElements();

    // Optional: Add mutation observer to update elements when DOM changes
    const observer = new MutationObserver(findElements);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [attribute, value]);

  return elements;
}
