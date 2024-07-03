import React from 'react';
import { triggerId } from '@src/config/types';
import { AppProvider } from './app-providers';
import { ChatNodeList } from './chat-node-list';
import { ContextMenu } from './context-menu';
import { ControlPanel } from './control-panel';
import { Resizable } from './resizable';

const App: React.FC = () => {
  return (
    <AppProvider>
      <ControlPanel />
      <Resizable>
        <ContextMenu triggerId={triggerId.open}>
          <ChatNodeList role='user' />
        </ContextMenu>
      </Resizable>
    </AppProvider>
  );
};

export default App;
