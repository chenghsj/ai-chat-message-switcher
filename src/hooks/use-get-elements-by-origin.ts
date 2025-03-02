import { useEffect, useState } from 'react';
import { siteOrigin } from '@src/config/types';
import { ChatNodeRoleType } from './use-chat-node';

export function useGetElementByOrigin(role: ChatNodeRoleType): Element[] {
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    const attributes: Partial<Record<typeof siteOrigin, string>> = {
      chatGPT: `[data-message-author-role="${role}"]`,
    };

    const classNames: Partial<Record<typeof siteOrigin, string>> = {
      gemini: role === 'user' ? 'query-content' : 'model-response-text',
      deepSeek: role === 'user' ? 'fbb737a4' : 'f9bf7997',
      grok: 'message-row',
      claude: role === 'user' ? 'font-user-message' : 'font-claude-message',
    };

    const getElementsByAttribute = () => {
      return Array.from(
        document.querySelectorAll<HTMLElement>(attributes[siteOrigin] || '')
      );
    };

    const getElementsByClassName = () => {
      const foundElements = Array.from(
        document.getElementsByClassName(classNames[siteOrigin] || '')
      );

      if (siteOrigin === 'grok') {
        return foundElements.filter((_, index) =>
          role === 'user' ? index % 2 === 0 : index % 2 === 1
        );
      }

      return foundElements;
    };

    const updateElements = () => {
      setElements(
        siteOrigin === 'chatGPT'
          ? getElementsByAttribute()
          : getElementsByClassName()
      );
    };

    updateElements();

    const observer = new MutationObserver(updateElements);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [role]);

  return elements;
}
