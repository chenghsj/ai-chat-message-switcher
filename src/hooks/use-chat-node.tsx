import React, { createContext, useContext, useEffect, useState } from 'react';
import { useElementsWithAttribute } from './use-element-with-attribute';

interface ChatNodeContextProps {
  nodes: HTMLElement[];
  clickNodeIndex: number | null;
  setClickNodeIndex: React.Dispatch<React.SetStateAction<number | null>>;
  role: ChatNodeRoleType;
  setRole: React.Dispatch<React.SetStateAction<ChatNodeRoleType>>;
}

export const chatNodeRole = {
  user: 'user',
  assistant: 'assistant',
} as const;

export type ChatNodeRoleType = (typeof chatNodeRole)[keyof typeof chatNodeRole];

const ChatNodeContext = createContext<ChatNodeContextProps | undefined>(
  undefined
);

export const ChatNodeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [clickNodeIndex, setClickNodeIndex] = useState<number | null>(null);
  const [role, setRole] = useState<ChatNodeRoleType>('user');

  const nodes = useElementsWithAttribute(
    'data-message-author-role',
    role
  ) as HTMLElement[];

  return (
    <ChatNodeContext.Provider
      value={{
        clickNodeIndex,
        setClickNodeIndex,
        nodes,
        role,
        setRole,
      }}
    >
      {children}
    </ChatNodeContext.Provider>
  );
};

export const useChatNode = () => {
  const context = useContext(ChatNodeContext);
  if (!context) {
    throw new Error('useChatNode must be used within a ChatNodeProvider');
  }
  return context;
};
