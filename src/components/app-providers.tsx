import { ReactNode } from 'react';
import { ChatNodeProvider } from '@src/hooks/use-chat-node';
import { ContextMenuProvider } from '@src/hooks/use-context-menu';
import { DraggableProvider } from '@src/hooks/use-draggable';
import { SearchProvider } from '@src/hooks/use-search';
import { TriggerTypeProvider } from '@src/hooks/use-trigger-type';

interface ProviderComponentProps {
  children: ReactNode;
}

const providers: React.FC<ProviderComponentProps>[] = [
  TriggerTypeProvider,
  ChatNodeProvider,
  DraggableProvider,
  ContextMenuProvider,
  SearchProvider,
];

export const AppProvider: React.FC<ProviderComponentProps> = providers.reduce(
  (AccumulatedComponents, CurrentProvider) => {
    return ({ children }) => (
      <CurrentProvider>
        <AccumulatedComponents>{children}</AccumulatedComponents>
      </CurrentProvider>
    );
  },
  ({ children }) => <>{children}</>
);
