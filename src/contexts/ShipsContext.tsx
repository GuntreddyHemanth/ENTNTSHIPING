import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Ship } from '../types';
import { getShips, addShip, updateShip, deleteShip, initializeData } from '../utils/localStorageUtils';

interface ShipsContextType {
  ships: Ship[];
  loading: boolean;
  error: string | null;
  addShip: (ship: Omit<Ship, 'id'>) => Promise<Ship>;
  updateShip: (ship: Ship) => Promise<Ship>;
  deleteShip: (id: string) => Promise<void>;
  refreshShips: () => void;
}

const ShipsContext = createContext<ShipsContextType | undefined>(undefined);

export const ShipsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data and load ships
  useEffect(() => {
    const loadShips = async () => {
      try {
        initializeData(); // Initialize localStorage if empty
        const shipData = getShips();
        setShips(shipData);
      } catch (err) {
        setError('Failed to load ships');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadShips();
  }, []);

  // Add a new ship
  const addShipHandler = async (shipData: Omit<Ship, 'id'>): Promise<Ship> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newShip = addShip(shipData);
      setShips(prevShips => [...prevShips, newShip]);
      return newShip;
    } catch (err) {
      setError('Failed to add ship');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing ship
  const updateShipHandler = async (shipData: Ship): Promise<Ship> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedShip = updateShip(shipData);
      setShips(prevShips => 
        prevShips.map(ship => ship.id === updatedShip.id ? updatedShip : ship)
      );
      return updatedShip;
    } catch (err) {
      setError('Failed to update ship');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a ship
  const deleteShipHandler = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteShip(id);
      setShips(prevShips => prevShips.filter(ship => ship.id !== id));
    } catch (err) {
      setError('Failed to delete ship');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh ships data
  const refreshShips = () => {
    try {
      const shipData = getShips();
      setShips(shipData);
    } catch (err) {
      setError('Failed to refresh ships');
      console.error(err);
    }
  };

  return (
    <ShipsContext.Provider value={{
      ships,
      loading,
      error,
      addShip: addShipHandler,
      updateShip: updateShipHandler,
      deleteShip: deleteShipHandler,
      refreshShips
    }}>
      {children}
    </ShipsContext.Provider>
  );
};

export const useShips = (): ShipsContextType => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};