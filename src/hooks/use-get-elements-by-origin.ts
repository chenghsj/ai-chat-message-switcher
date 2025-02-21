import { useEffect, useState } from 'react';
import { siteOrigin } from '@src/config/types';
import { ChatNodeRoleType } from './use-chat-node';

export function useGetElementByOrigin(role: ChatNodeRoleType): Element[] {
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    function findElementsByAttribute() {
      const selector = `[data-message-author-role="${role}"]`;
      const foundElements = document.querySelectorAll<HTMLElement>(selector);
      setElements(Array.from(foundElements));
    }

    const findElementsByClassName = () => {
      const getGrokRoleElements = (
        role: ChatNodeRoleType,
        elements: Element[]
      ) => {
        // grok user message is on even indexes, assistant message is on odd indexes
        return role === 'user'
          ? elements.filter((_, index) => index % 2 === 0)
          : elements.filter((_, index) => index % 2 === 1);
      };

      const classNames: Partial<Record<typeof siteOrigin, string>> = {
        gemini: role === 'user' ? 'query-content' : 'model-response-text',
        deepSeek: role === 'user' ? 'fbb737a4' : 'f9bf7997',
        grok: 'message-row',
      };
      const className = classNames[siteOrigin] || '';
      const foundElements = document.getElementsByClassName(className);
      const foundElementsArray = Array.from(foundElements);

      if (siteOrigin === 'grok') {
        setElements(getGrokRoleElements(role, foundElementsArray));
      } else {
        setElements(foundElementsArray);
      }
    };

    if (siteOrigin === 'chatGPT') {
      findElementsByAttribute();
    } else {
      findElementsByClassName();
    }

    // Optional: Add mutation observer to update elements when DOM changes
    const observerCallback =
      siteOrigin === 'chatGPT'
        ? findElementsByAttribute
        : findElementsByClassName;
    const observer = new MutationObserver(observerCallback);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, [role]);

  return elements;
}
