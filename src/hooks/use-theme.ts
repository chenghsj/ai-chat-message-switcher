import { useEffect } from 'react';

const darkThemeList = ['dark', 'dark-theme'];

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

export const useInitialTheme = (shouldApplyTheme: boolean) => {
  if (!shouldApplyTheme) return;

  useEffect(() => {
    const isDarkMode = darkThemeList.some((theme) =>
      document.body.classList.contains(theme)
    );

    updateHtmlClass(isDarkMode);
  }, []);
};

export const useBodyThemeObserver = (shouldApplyTheme: boolean) => {
  if (!shouldApplyTheme) return;

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDarkMode = darkThemeList.some((theme) =>
            (mutation.target as HTMLElement).classList.contains(theme)
          );
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
