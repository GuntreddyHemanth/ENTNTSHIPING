import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Anchor, Calendar, PenTool as Tool, Clipboard, Edit, ArrowLeft, Plus } from 'lucide-react';
import { Ship, Component, Job } from '../../types';
import { useShips } from '../../contexts/ShipsContext';
import { useComponents } from '../../contexts/ComponentsContext';
import { useJobs } from '../../contexts/JobsContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { getShipById } from '../../utils/localStorageUtils';

const ShipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshShips } = useShips();
  const { components, getComponentsByShipId, refreshComponents } = useComponents();
  const { jobs, getJobsByShipId, refreshJobs } = useJobs();
  const { user } = useAuth();
  
  const [ship, setShip] = useState<Ship | null>(null);
  const [shipComponents, setShipComponents] = useState<Component[]>([]);
  const [shipJobs, setShipJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  const canEditShip = hasPermission(user, 'canEditShip');
  const canCreateComponent = hasPermission(user, 'canCreateComponent');
  const canCreateJob = hasPermission(user, 'canCreateJob');

  useEffect(() => {
    const loadShipData = () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        const shipData = getShipById(id);
        if (shipData) {
          setShip(shipData);
          setShipComponents(getComponentsByShipId(id));
          setShipJobs(getJobsByShipId(id));
        } else {
          navigate('/ships');
        }
      } catch (err) {
        console.error('Error loading ship data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadShipData();
    
    // Refresh data from context providers
    refreshShips();
    refreshComponents();
    refreshJobs();
  }, [id, navigate, refreshShips, refreshComponents, refreshJobs, getComponentsByShipId, getJobsByShipId]);

  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Service':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Status badge styling for jobs
  const getJobStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Priority badge styling
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'High':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!ship) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Ship not found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/ships')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Anchor className="mr-2 text-blue-600" size={24} />
              {ship.name}
            </h2>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <span>IMO: {ship.imo}</span>
              <span className="mx-2">•</span>
              <span>Flag: {ship.flag}</span>
              <span className="mx-2">•</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusBadgeClass(ship.status)}`}>
                {ship.status}
              </span>
            </div>
          </div>
        </div>
        
        {canEditShip && (
          <Link
            to={`/ships/edit/${ship.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Edit size={16} className="mr-2" />
            Edit Ship
          </Link>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('general')}
            >
              <Clipboard size={16} className="mr-2" />
              General Information
            </button>
            <button
              className={`${
                activeTab === 'components'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('components')}
            >
              <Tool size={16} className="mr-2" />
              Components
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {shipComponents.length}
              </span>
            </button>
            <button
              className={`${
                activeTab === 'maintenance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center`}
              onClick={() => setActiveTab('maintenance')}
            >
              <Calendar size={16} className="mr-2" />
              Maintenance History
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {shipJobs.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Ship Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ship.name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">IMO Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ship.imo}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Flag</dt>
                    <dd className="mt-1 text-sm text-gray-900">{ship.flag}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(ship.status)}`}>
                        {ship.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Summary</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Total Components</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipComponents.length}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Total Maintenance Jobs</dt>
                    <dd className="mt-1 text-sm text-gray-900">{shipJobs.length}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Open Jobs</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {shipJobs.filter(job => job.status === 'Open').length}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Completed Jobs</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {shipJobs.filter(job => job.status === 'Completed').length}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Ship Components</h3>
                {canCreateComponent && (
                  <Link
                    to={`/components/new/${ship.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Component
                  </Link>
                )}
              </div>

              {shipComponents.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Tool size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No components found</h3>
                  <p className="text-gray-600 mb-4">This ship doesn't have any components registered yet.</p>
                  {canCreateComponent && (
                    <Link
                      to={`/components/new/${ship.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Component
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serial Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Install Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Maintenance
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shipComponents.map(component => (
                        <tr key={component.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link to={`/components/${component.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                              {component.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {component.serialNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {new Date(component.installDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {new Date(component.lastMaintenanceDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            <div className="flex justify-center space-x-2">
                              <Link
                                to={`/components/${component.id}`}
                                className="text-gray-600 hover:text-gray-900"
                                title="View"
                              >
                                <span className="sr-only">View</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </Link>
                              {canCreateJob && (
                                <Link
                                  to={`/jobs/new/${ship.id}/${component.id}`}
                                  className="text-green-600 hover:text-green-900"
                                  title="Create Job"
                                >
                                  <span className="sr-only">Create Job</span>
                                  <Calendar className="h-5 w-5" />
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Maintenance History</h3>
                {canCreateJob && shipComponents.length > 0 && (
                  <Link
                    to={`/jobs/new/${ship.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus size={16} className="mr-1" />
                    Create Job
                  </Link>
                )}
              </div>

              {shipJobs.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <Calendar size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No maintenance history</h3>
                  <p className="text-gray-600 mb-4">There are no maintenance jobs for this ship yet.</p>
                  {canCreateJob && shipComponents.length > 0 && (
                    <Link
                      to={`/jobs/new/${ship.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus size={16} className="mr-1" />
                      Create Job
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Component
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Scheduled Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shipJobs.map(job => {
                        const component = components.find(c => c.id === job.componentId);
                        return (
                          <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {component ? component.name : 'Unknown Component'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {job.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeClass(job.priority)}`}>
                                {job.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getJobStatusBadgeClass(job.status)}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                              {new Date(job.scheduledDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              <Link
                                to={`/jobs/${job.id}`}
                                className="text-blue-600 hover:text-blue-900 font-medium"
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipDetail;