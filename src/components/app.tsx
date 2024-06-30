import React from 'react';
import { AppProvider } from './app-providers';
import { ChatNodeList } from './chat-node-list';
import { ContextMenu } from './context-menu';
import { ControlPanel } from './control-panel';

const App: React.FC = () => {
  return (
    <AppProvider>
      <ControlPanel />
      <ContextMenu width={400} height={400} triggerId='trigger'>
        <ChatNodeList role='user' />
      </ContextMenu>
    </AppProvider>
  );
};

export default App;
