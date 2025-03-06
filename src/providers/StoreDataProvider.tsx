
import React, { useState, createContext, useContext } from "react";

// Store Data Context
interface StoreDataContextProps {
  storeData: any;
  setStoreData: React.Dispatch<React.SetStateAction<any>>;
}

const StoreDataContext = createContext<StoreDataContextProps | undefined>(
  undefined
);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [storeData, setStoreData] = useState(null);

  return (
    <StoreDataContext.Provider value={{ storeData, setStoreData }}>
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreDataContext = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error("useStoreData must be used within a StoreDataProvider");
  }
  return context;
};
