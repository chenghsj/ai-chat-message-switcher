import { useEffect } from 'react';

const updateHtmlClass = (isDarkMode: boolean) => {
  const htmlElement = document.documentElement;

  if (isDarkMode) {
    htmlElement.classList.add('dark');
    htmlElement.classList.remove('light');
  } else {
    htmlElement.classList.add('light');
    htmlElement.classList.remove('dark');
  }
};

export const useInitialTheme = () => {
  useEffect(() => {
    const isDarkMode = document.body.classList.contains('dark-theme');
    updateHtmlClass(isDarkMode);
  }, []);
};

export const useBodyThemeObserver = () => {
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDarkMode = (mutation.target as HTMLElement).classList.contains('dark-theme');
          updateHtmlClass(isDarkMode);
        }
      });
    });

    const config = { attributes: true, attributeFilter: ['class'] };
    const targetNode = document.body;

    if (targetNode) {
      observer.observe(targetNode, config);
    }

    return () => {
      if (targetNode) {
        observer.disconnect();
      }
    };
  }, []);
};
