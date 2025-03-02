import React from 'react';
import { siteOrigin } from '@src/config/types';
import {
  useBodyThemeObserver,
  useHTMLThemeObserver,
  useInitialTheme,
} from '@src/hooks/use-theme';
import { AppProvider } from './app-providers';
import { ChatNodeList } from './chat-node-list';
import { ContextMenu } from './context-menu';
import { ControlPanel } from './control-panel';
import { Resizable } from './resizable';

// Sites that apply theme classes to the body element
const BODY_THEMED_SITES: (typeof siteOrigin)[] = ['gemini', 'deepSeek'];
// Sites that apply theme attributes to the HTML element
const HTML_THEMED_SITES: (typeof siteOrigin)[] = ['claude'];

const App: React.FC = () => {
  const shouldApplyBodyTheme = BODY_THEMED_SITES.includes(siteOrigin);
  const shouldApplyHTMLTheme = HTML_THEMED_SITES.includes(siteOrigin);

  useInitialTheme(shouldApplyBodyTheme || shouldApplyHTMLTheme);
  useBodyThemeObserver(shouldApplyBodyTheme);
  useHTMLThemeObserver(shouldApplyHTMLTheme);

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
