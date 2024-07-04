import React from 'react';
import {
  initialContextMenuPosition,
  initialControlPanelPosition,
  initialSize,
} from '@src/config/types';
import { ChatNodeProvider } from '@src/hooks/use-chat-node';
import { ContextMenuProvider } from '@src/hooks/use-context-menu-context';
import { DraggableProvider } from '@src/hooks/use-draggable-context';
import { SearchProvider } from '@src/hooks/use-search-context';
import { SizeProvider } from '@src/hooks/use-size-context';
import { TriggerTypeProvider } from '@src/hooks/use-trigger-type-context';

// https://gist.github.com/phatnguyenuit/68122170e317d13e7148c7563be021b6
interface Provider<TProps> {
  Component: React.ComponentType<React.PropsWithChildren<TProps>>;
  props?: Omit<TProps, 'children'>;
}
function composeProviders<TProviders extends Array<Provider<any>>>(
  providers: TProviders
): React.ComponentType<React.PropsWithChildren> {
  const ProviderComponent: React.FunctionComponent<React.PropsWithChildren> = ({
    children,
  }) => {
    const initialJSX = <>{children}</>;

    return providers.reduceRight<JSX.Element>(
      (prevJSX, { Component: CurrentProvider, props = {} }) => {
        return <CurrentProvider {...props}>{prevJSX}</CurrentProvider>;
      },
      initialJSX
    );
  };

  return ProviderComponent;
}

function createProvider<TProps>(
  Component: React.ComponentType<React.PropsWithChildren<TProps>>,
  props?: Omit<TProps, 'children'>
): Provider<TProps> {
  return { Component, props };
}

const providers = [
  createProvider(TriggerTypeProvider),
  createProvider(ChatNodeProvider),
  createProvider(DraggableProvider, {
    initialPosition: initialControlPanelPosition,
  }),
  createProvider(SizeProvider, { initialSize }),
  createProvider(ContextMenuProvider, {
    initialPosition: initialContextMenuPosition,
  }),
  createProvider(SearchProvider),
];

export const AppProvider = composeProviders(providers);
