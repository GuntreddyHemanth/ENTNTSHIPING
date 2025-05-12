import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ship } from '../../types';
import { useShips } from '../../contexts/ShipsContext';
import { Anchor, Save, ArrowLeft } from 'lucide-react';

interface ShipFormProps {
  isEditing?: boolean;
}

const ShipForm: React.FC<ShipFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ships, addShip, updateShip } = useShips();
  
  const [formData, setFormData] = useState<Omit<Ship, 'id'>>({
    name: '',
    imo: '',
    flag: '',
    status: 'Active'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load ship data if editing
  useEffect(() => {
    if (isEditing && id) {
      const shipToEdit = ships.find(ship => ship.id === id);
      if (shipToEdit) {
        setFormData({
          name: shipToEdit.name,
          imo: shipToEdit.imo,
          flag: shipToEdit.flag,
          status: shipToEdit.status
        });
      } else {
        navigate('/ships');
      }
    }
  }, [isEditing, id, ships, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ship name is required';
    }
    
    if (!formData.imo.trim()) {
      newErrors.imo = 'IMO number is required';
    } else if (!/^\d{7}$/.test(formData.imo)) {
      newErrors.imo = 'IMO number must be 7 digits';
    }
    
    if (!formData.flag.trim()) {
      newErrors.flag = 'Flag is required';
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
        await updateShip({ id, ...formData });
      } else {
        await addShip(formData);
      }
      navigate('/ships');
    } catch (error) {
      console.error('Error saving ship:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save ship. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/ships')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Anchor className="mr-2 text-blue-600" size={24} />
          {isEditing ? 'Edit Ship' : 'Add New Ship'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Ship Name
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
            <label htmlFor="imo" className="block text-sm font-medium text-gray-700 mb-1">
              IMO Number
            </label>
            <input
              type="text"
              id="imo"
              name="imo"
              value={formData.imo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.imo ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.imo && <p className="mt-1 text-sm text-red-600">{errors.imo}</p>}
            <p className="mt-1 text-xs text-gray-500">IMO number must be 7 digits.</p>
          </div>

          <div>
            <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-1">
              Flag (Country)
            </label>
            <input
              type="text"
              id="flag"
              name="flag"
              value={formData.flag}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.flag ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.flag && <p className="mt-1 text-sm text-red-600">{errors.flag}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/ships')}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Ship' : 'Save Ship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipForm;