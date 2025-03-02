import { useEffect } from 'react';

const darkThemeList = ['dark', 'dark-theme'];

interface ThemeObserverConfig {
  attributeName: string;
  getIsDarkMode: (target: HTMLElement) => boolean;
  targetSelector: () => HTMLElement | null;
}

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
    const isDarkMode = darkThemeList.some(
      (theme) =>
        document.body.classList.contains(theme) ||
        document.documentElement.dataset.mode?.includes(theme)
    );

    updateHtmlClass(isDarkMode);
  }, []);
};

const createThemeObserver = (
  config: ThemeObserverConfig,
  shouldApplyTheme: boolean
) => {
  if (!shouldApplyTheme) return;

  useEffect(() => {
    const { attributeName, getIsDarkMode, targetSelector } = config;
    const targetNode = targetSelector();

    if (!targetNode) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === attributeName
        ) {
          const isDarkMode = getIsDarkMode(mutation.target as HTMLElement);
          updateHtmlClass(isDarkMode);
        }
      });
    });

    observer.observe(targetNode, {
      attributes: true,
      attributeFilter: [attributeName],
    });

    return () => observer.disconnect();
  }, []);
};

export const useBodyThemeObserver = (shouldApplyTheme: boolean) => {
  createThemeObserver(
    {
      attributeName: 'class',
      getIsDarkMode: (target) =>
        darkThemeList.some((theme) => target.classList.contains(theme)),
      targetSelector: () => document.body,
    },
    shouldApplyTheme
  );
};

export const useHTMLThemeObserver = (shouldApplyTheme: boolean) => {
  createThemeObserver(
    {
      attributeName: 'data-mode',
      getIsDarkMode: (target) =>
        darkThemeList.some((theme) => target.dataset.mode?.includes(theme)),
      targetSelector: () => document.documentElement,
    },
    shouldApplyTheme
  );
};
