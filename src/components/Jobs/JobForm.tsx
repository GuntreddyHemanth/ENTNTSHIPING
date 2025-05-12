import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Job } from '../../types';
import { useJobs } from '../../contexts/JobsContext';
import { useShips } from '../../contexts/ShipsContext';
import { useComponents } from '../../contexts/ComponentsContext';
import { getUsers } from '../../utils/localStorageUtils';
import { Calendar, Save, ArrowLeft } from 'lucide-react';

interface JobFormProps {
  isEditing?: boolean;
}

const JobForm: React.FC<JobFormProps> = ({ isEditing = false }) => {
  const { id, shipId, componentId } = useParams<{ id: string; shipId: string; componentId: string }>();
  const navigate = useNavigate();
  const { jobs, addJob, updateJob } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  
  const [formData, setFormData] = useState<Omit<Job, 'id'>>({
    componentId: componentId || '',
    shipId: shipId || '',
    type: 'Inspection',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [engineers, setEngineers] = useState<{ id: string; email: string }[]>([]);
  const [shipComponents, setShipComponents] = useState<typeof components>([]);

  // Load engineers
  useEffect(() => {
    const allUsers = getUsers();
    const engineerUsers = allUsers
      .filter(user => user.role === 'Engineer')
      .map(user => ({ id: user.id, email: user.email }));
    setEngineers(engineerUsers);
    
    // Set default engineer if there's only one
    if (engineerUsers.length === 1 && !formData.assignedEngineerId) {
      setFormData(prev => ({ ...prev, assignedEngineerId: engineerUsers[0].id }));
    }
  }, [formData.assignedEngineerId]);

  // Filter components based on selected ship
  useEffect(() => {
    if (formData.shipId) {
      const filteredComponents = components.filter(
        component => component.shipId === formData.shipId
      );
      setShipComponents(filteredComponents);
      
      // If the current component doesn't belong to the selected ship, clear it
      if (
        formData.componentId && 
        !filteredComponents.some(component => component.id === formData.componentId)
      ) {
        setFormData(prev => ({ ...prev, componentId: '' }));
      }
    } else {
      setShipComponents([]);
    }
  }, [formData.shipId, components, formData.componentId]);

  // Load job data if editing
  useEffect(() => {
    if (isEditing && id) {
      const jobToEdit = jobs.find(job => job.id === id);
      if (jobToEdit) {
        // Format dates for form inputs
        const formattedJob = {
          ...jobToEdit,
          scheduledDate: new Date(jobToEdit.scheduledDate).toISOString().split('T')[0],
          completedDate: jobToEdit.completedDate 
            ? new Date(jobToEdit.completedDate).toISOString().split('T')[0]
            : undefined
        };
        setFormData({
          componentId: formattedJob.componentId,
          shipId: formattedJob.shipId,
          type: formattedJob.type,
          priority: formattedJob.priority,
          status: formattedJob.status,
          assignedEngineerId: formattedJob.assignedEngineerId,
          scheduledDate: formattedJob.scheduledDate,
          completedDate: formattedJob.completedDate,
          notes: formattedJob.notes || ''
        });
      } else {
        navigate('/jobs');
      }
    }
  }, [isEditing, id, jobs, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.shipId) {
      newErrors.shipId = 'Ship is required';
    }
    
    if (!formData.componentId) {
      newErrors.componentId = 'Component is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Job type is required';
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.assignedEngineerId) {
      newErrors.assignedEngineerId = 'Assigned engineer is required';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    
    // If status is "Completed" make sure there's a completed date
    if (formData.status === 'Completed' && !formData.completedDate) {
      newErrors.completedDate = 'Completed date is required for completed jobs';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If status changes to Completed, set completed date to today if not already set
    if (name === 'status' && value === 'Completed' && !formData.completedDate) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        completedDate: new Date().toISOString().split('T')[0]
      }));
    }
    
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
        await updateJob({ id, ...formData });
      } else {
        await addJob(formData);
      }
      navigate('/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save job. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={24} />
          {isEditing ? 'Edit Maintenance Job' : 'Create Maintenance Job'}
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
              disabled={!!shipId || isEditing} // Disable if shipId is provided in URL or editing
              className={`w-full px-3 py-2 border ${
                errors.shipId ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                (shipId || isEditing) ? 'bg-gray-100' : ''
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
            <label htmlFor="componentId" className="block text-sm font-medium text-gray-700 mb-1">
              Component
            </label>
            <select
              id="componentId"
              name="componentId"
              value={formData.componentId}
              onChange={handleChange}
              disabled={!!componentId || isEditing} // Disable if componentId is provided in URL or editing
              className={`w-full px-3 py-2 border ${
                errors.componentId ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                (componentId || isEditing) ? 'bg-gray-100' : ''
              }`}
            >
              <option value="">Select a component</option>
              {shipComponents.map(component => (
                <option key={component.id} value={component.id}>
                  {component.name} (S/N: {component.serialNumber})
                </option>
              ))}
            </select>
            {errors.componentId && <p className="mt-1 text-sm text-red-600">{errors.componentId}</p>}
            {formData.shipId && shipComponents.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600">No components available for this ship. Please add components first.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="Inspection">Inspection</option>
                <option value="Repair">Repair</option>
                <option value="Replacement">Replacement</option>
                <option value="Overhaul">Overhaul</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.priority ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.status ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div>
              <label htmlFor="assignedEngineerId" className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Engineer
              </label>
              <select
                id="assignedEngineerId"
                name="assignedEngineerId"
                value={formData.assignedEngineerId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.assignedEngineerId ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Select an engineer</option>
                {engineers.map(engineer => (
                  <option key={engineer.id} value={engineer.id}>
                    {engineer.email}
                  </option>
                ))}
              </select>
              {errors.assignedEngineerId && <p className="mt-1 text-sm text-red-600">{errors.assignedEngineerId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date
              </label>
              <input
                type="date"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.scheduledDate ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              />
              {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
            </div>

            {(formData.status === 'Completed' || formData.completedDate) && (
              <div>
                <label htmlFor="completedDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Completed Date
                </label>
                <input
                  type="date"
                  id="completedDate"
                  name="completedDate"
                  value={formData.completedDate || ''}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border ${
                    errors.completedDate ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.completedDate && <p className="mt-1 text-sm text-red-600">{errors.completedDate}</p>}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional details or instructions..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;