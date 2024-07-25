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

    function findElementsByClassName() {
      const className =
        role === 'user' ? 'query-content' : 'model-response-text ';
      const foundElements = document.getElementsByClassName(className);
      setElements(Array.from(foundElements));
    }

    if (siteOrigin === 'https://chatgpt.com') {
      findElementsByAttribute();
    } else {
      findElementsByClassName();
    }

    // Optional: Add mutation observer to update elements when DOM changes
    const observer = new MutationObserver(
      siteOrigin === 'https://chatgpt.com'
        ? findElementsByAttribute
        : findElementsByClassName
    );
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
