import { useEffect, useState } from 'react';
import { OriginEnum, siteOrigin } from '@src/config/types';
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
      const classNames: Partial<Record<`${OriginEnum}`, string>> = {
        'https://gemini.google.com':
          role === 'user' ? 'query-content' : 'model-response-text',
        'https://chat.deepseek.com': role === 'user' ? 'fbb737a4' : 'f9bf7997',
      };
      const className = classNames[siteOrigin] || '';
      const foundElements = document.getElementsByClassName(className);
      setElements(Array.from(foundElements));
    };

    if (siteOrigin === 'https://chatgpt.com') {
      findElementsByAttribute();
    } else {
      findElementsByClassName();
    }

    // Optional: Add mutation observer to update elements when DOM changes
    const observerCallback =
      siteOrigin === 'https://chatgpt.com'
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
