import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Component } from '../../types';
import { useComponents } from '../../contexts/ComponentsContext';
import { useShips } from '../../contexts/ShipsContext';
import { PenTool as Tool, Save, ArrowLeft } from 'lucide-react';

interface ComponentFormProps {
  isEditing?: boolean;
}

const ComponentForm: React.FC<ComponentFormProps> = ({ isEditing = false }) => {
  const { id, shipId } = useParams<{ id: string; shipId: string }>();
  const navigate = useNavigate();
  const { components, addComponent, updateComponent } = useComponents();
  const { ships } = useShips();
  
  const [formData, setFormData] = useState<Omit<Component, 'id'>>({
    shipId: shipId || '',
    name: '',
    serialNumber: '',
    installDate: new Date().toISOString().split('T')[0],
    lastMaintenanceDate: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load component data if editing
  useEffect(() => {
    if (isEditing && id) {
      const componentToEdit = components.find(component => component.id === id);
      if (componentToEdit) {
        // Format dates for form inputs
        const formattedComponent = {
          ...componentToEdit,
          installDate: new Date(componentToEdit.installDate).toISOString().split('T')[0],
          lastMaintenanceDate: new Date(componentToEdit.lastMaintenanceDate).toISOString().split('T')[0]
        };
        setFormData({
          shipId: formattedComponent.shipId,
          name: formattedComponent.name,
          serialNumber: formattedComponent.serialNumber,
          installDate: formattedComponent.installDate,
          lastMaintenanceDate: formattedComponent.lastMaintenanceDate
        });
      } else {
        navigate('/components');
      }
    }
  }, [isEditing, id, components, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Component name is required';
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'Serial number is required';
    }
    
    if (!formData.installDate) {
      newErrors.installDate = 'Installation date is required';
    }
    
    if (!formData.lastMaintenanceDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date is required';
    }
    
    const installDate = new Date(formData.installDate);
    const lastMaintenanceDate = new Date(formData.lastMaintenanceDate);
    
    if (lastMaintenanceDate < installDate) {
      newErrors.lastMaintenanceDate = 'Last maintenance date cannot be before installation date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && id) {
        await updateComponent({ id, ...formData });
      } else {
        await addComponent(formData);
      }
      navigate(shipId ? `/ships/${shipId}` : '/components');
    } catch (error) {
      console.error('Error saving component:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save component. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(shipId ? `/ships/${shipId}` : '/components')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Tool className="mr-2 text-blue-600" size={24} />
          {isEditing ? 'Edit Component' : 'Add New Component'}
        </h2>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 max-w-2xl">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="shipId" className="block text-sm font-medium text-gray-700 mb-1">
              Ship
            </label>
            <select
              id="shipId"
              name="shipId"
              value={formData.shipId}
              onChange={handleChange}
              disabled={!!shipId} // Disable if shipId is provided in URL
              className={`w-full px-3 py-2 border ${
                errors.shipId ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                shipId ? 'bg-gray-100' : ''
              }`}
            >
              <option value="">Select a ship</option>
              {ships.map(ship => (
                <option key={ship.id} value={ship.id}>
                  {ship.name} (IMO: {ship.imo})
                </option>
              ))}
            </select>
            {errors.shipId && <p className="mt-1 text-sm text-red-600">{errors.shipId}</p>}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Component Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.serialNumber ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber}</p>}
          </div>

          <div>
            <label htmlFor="installDate" className="block text-sm font-medium text-gray-700 mb-1">
              Installation Date
            </label>
            <input
              type="date"
              id="installDate"
              name="installDate"
              value={formData.installDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border ${
                errors.installDate ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.installDate && <p className="mt-1 text-sm text-red-600">{errors.installDate}</p>}
          </div>

          <div>
            <label htmlFor="lastMaintenanceDate" className="block text-sm font-medium text-gray-700 mb-1">
              Last Maintenance Date
            </label>
            <input
              type="date"
              id="lastMaintenanceDate"
              name="lastMaintenanceDate"
              value={formData.lastMaintenanceDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border ${
                errors.lastMaintenanceDate ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.lastMaintenanceDate && <p className="mt-1 text-sm text-red-600">{errors.lastMaintenanceDate}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(shipId ? `/ships/${shipId}` : '/components')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 ${
                isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } border border-transparent rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Save size={16} className="inline mr-2" />
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Component' : 'Save Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComponentForm;