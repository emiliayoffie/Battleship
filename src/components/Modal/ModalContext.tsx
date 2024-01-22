import React, { useState, createContext, Dispatch, SetStateAction } from 'react';
/*The ModalProvider component wraps its children with ModalContext.Provider
It manages the state of whether the modal is open or not and provides that state and the state updater function to its children.*/
interface ModalContextType {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  setIsModalOpen: () => {}
});

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FunctionComponent<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); /*State to track if modal is open*/

  /**The context value includes both the state and the updater function */
  const contextValue = { isModalOpen, setIsModalOpen };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
