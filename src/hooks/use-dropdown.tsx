// DropdownContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DropdownContextType {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

interface DropdownProviderProps {
	children: ReactNode;
}

export const DropdownProvider: React.FC<DropdownProviderProps> = ({ children }) => {
	const [open, setOpen] = useState(false);

	return (
		<DropdownContext.Provider value={{ open, setOpen }}>
			{children}
		</DropdownContext.Provider>
	);
};

export const useDropdown = () => {
	const context = useContext(DropdownContext);
	if (context === undefined) {
		throw new Error('useDropdown must be used within a DropdownProvider');
	}
	return context;
};