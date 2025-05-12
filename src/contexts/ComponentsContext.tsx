import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Component } from '../types';
import { 
  getComponents, 
  getComponentsByShipId,
  addComponent, 
  updateComponent, 
  deleteComponent 
} from '../utils/localStorageUtils';

interface ComponentsContextType {
  components: Component[];
  loading: boolean;
  error: string | null;
  getComponentsByShipId: (shipId: string) => Component[];
  addComponent: (component: Omit<Component, 'id'>) => Promise<Component>;
  updateComponent: (component: Component) => Promise<Component>;
  deleteComponent: (id: string) => Promise<void>;
  refreshComponents: () => void;
}

const ComponentsContext = createContext<ComponentsContextType | undefined>(undefined);

export const ComponentsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load components
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const componentData = getComponents();
        setComponents(componentData);
      } catch (err) {
        setError('Failed to load components');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadComponents();
  }, []);

  // Get components by ship ID
  const getComponentsByShipIdHandler = (shipId: string): Component[] => {
    return getComponentsByShipId(shipId);
  };

  // Add a new component
  const addComponentHandler = async (componentData: Omit<Component, 'id'>): Promise<Component> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComponent = addComponent(componentData);
      setComponents(prevComponents => [...prevComponents, newComponent]);
      return newComponent;
    } catch (err) {
      setError('Failed to add component');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing component
  const updateComponentHandler = async (componentData: Component): Promise<Component> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedComponent = updateComponent(componentData);
      setComponents(prevComponents => 
        prevComponents.map(component => component.id === updatedComponent.id ? updatedComponent : component)
      );
      return updatedComponent;
    } catch (err) {
      setError('Failed to update component');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a component
  const deleteComponentHandler = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteComponent(id);
      setComponents(prevComponents => prevComponents.filter(component => component.id !== id));
    } catch (err) {
      setError('Failed to delete component');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh components data
  const refreshComponents = () => {
    try {
      const componentData = getComponents();
      setComponents(componentData);
    } catch (err) {
      setError('Failed to refresh components');
      console.error(err);
    }
  };

  return (
    <ComponentsContext.Provider value={{
      components,
      loading,
      error,
      getComponentsByShipId: getComponentsByShipIdHandler,
      addComponent: addComponentHandler,
      updateComponent: updateComponentHandler,
      deleteComponent: deleteComponentHandler,
      refreshComponents
    }}>
      {children}
    </ComponentsContext.Provider>
  );
};

export const useComponents = (): ComponentsContextType => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};