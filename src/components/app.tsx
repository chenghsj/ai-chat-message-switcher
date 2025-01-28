import React from 'react';
import { siteOrigin } from '@src/config/types';
import { useBodyThemeObserver, useInitialTheme } from '@src/hooks/use-theme';
import { AppProvider } from './app-providers';
import { ChatNodeList } from './chat-node-list';
import { ContextMenu } from './context-menu';
import { ControlPanel } from './control-panel';
import { Resizable } from './resizable';

const App: React.FC = () => {
  const shouldApplyTheme =
    siteOrigin === 'https://gemini.google.com' ||
    siteOrigin === 'https://chat.deepseek.com';

  useInitialTheme(shouldApplyTheme);
  useBodyThemeObserver(shouldApplyTheme);

  return (
    <AppProvider>
      <ControlPanel />
      <Resizable>
        <ContextMenu>
          <ChatNodeList />
        </ContextMenu>
      </Resizable>
    </AppProvider>
  );
};

export default App;
