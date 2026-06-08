import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [userName, setUserName]     = useState('');
  const [spinResult, setSpinResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [modalOpen, setModalOpen]   = useState(false);

  return (
    <AppContext.Provider
      value={{
        userName,    setUserName,
        spinResult,  setSpinResult,
        isSpinning,  setIsSpinning,
        modalOpen,   setModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
