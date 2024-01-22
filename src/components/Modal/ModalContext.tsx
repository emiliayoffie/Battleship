import React, { useState, createContext, Dispatch, SetStateAction } from 'react';

interface ModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

// Create a context with a default value
export const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  setIsModalOpen: () => {}
});

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FunctionComponent<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </ModalContext.Provider>
  );
};
