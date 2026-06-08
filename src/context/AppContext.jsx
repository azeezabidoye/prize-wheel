import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [userName,    setUserName]    = useState('');
  const [spinResult,  setSpinResult]  = useState(null);
  const [isSpinning,  setIsSpinning]  = useState(false);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [gameVersion, setGameVersion] = useState(null); // 'multi' | 'single' | null

  const resetSession = useCallback(() => {
    setUserName('');
    setSpinResult(null);
    setIsSpinning(false);
    setModalOpen(false);
    setGameVersion(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userName,    setUserName,
        spinResult,  setSpinResult,
        isSpinning,  setIsSpinning,
        modalOpen,   setModalOpen,
        gameVersion, setGameVersion,
        resetSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
