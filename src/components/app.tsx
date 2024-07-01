import React from 'react';
import { AppProvider } from './app-providers';
import { ChatNodeList } from './chat-node-list';
import { ContextMenu } from './context-menu';
import { ControlPanel } from './control-panel';
import { ResizableCompnent } from './resizable';

const App: React.FC = () => {
  return (
    <AppProvider>
      <ControlPanel />
      <ResizableCompnent>
        <ContextMenu triggerId='trigger'>
          <ChatNodeList role='user' />
        </ContextMenu>
      </ResizableCompnent>
    </AppProvider>
  );
};

export default App;
