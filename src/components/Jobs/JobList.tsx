import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Job, Ship, Component, User } from '../../types';
import { useJobs } from '../../contexts/JobsContext';
import { useShips } from '../../contexts/ShipsContext';
import { useComponents } from '../../contexts/ComponentsContext';
import { useAuth } from '../../contexts/AuthContext';
import { getUsers } from '../../utils/localStorageUtils';
import { hasPermission } from '../../utils/roleUtils';
import { Calendar, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';

const JobList: React.FC = () => {
  const { jobs, loading, error, deleteJob } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [shipFilter, setShipFilter] = useState<string>('');
  const [engineers, setEngineers] = useState<User[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const canEditJob = hasPermission(user, 'canEditJob');
  const canDeleteJob = hasPermission(user, 'canDeleteJob');
  const canCreateJob = hasPermission(user, 'canCreateJob');

  useEffect(() => {
    // Load engineers for displaying assigned engineer names
    const allUsers = getUsers();
    const engineerUsers = allUsers.filter(user => user.role === 'Engineer');
    setEngineers(engineerUsers);
  }, []);

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
      } catch (err) {
        console.error('Failed to delete job:', err);
      }
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
    setShipFilter('');
    setSearchTerm('');
  };

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    // Apply filters
    if (statusFilter && job.status !== statusFilter) return false;
    if (priorityFilter && job.priority !== priorityFilter) return false;
    if (shipFilter && job.shipId !== shipFilter) return false;
    
    // Apply search
    if (!searchTerm) return true;
    
    // Get related data for search
    const component = components.find(c => c.id === job.componentId);
    const ship = ships.find(s => s.id === job.shipId);
    const engineer = engineers.find(e => e.id === job.assignedEngineerId);
    
    // Search in job fields and related entities
    return (
      component?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ship?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.scheduledDate.includes(searchTerm)
    );
  });

  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
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

  const getComponentName = (componentId: string): string => {
    const component = components.find(c => c.id === componentId);
    return component ? component.name : 'Unknown Component';
  };

  const getShipName = (shipId: string): string => {
    const ship = ships.find(s => s.id === shipId);
    return ship ? ship.name : 'Unknown Ship';
  };

  const getEngineerName = (engineerId: string): string => {
    const engineer = engineers.find(e => e.id === engineerId);
    return engineer ? engineer.email.split('@')[0] : 'Unassigned';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={24} />
          Maintenance Jobs
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter size={16} className="mr-2" />
            Filter
            {(statusFilter || priorityFilter || shipFilter) && (
              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                Active
              </span>
            )}
          </button>
          
          {canCreateJob && (
            <Link
              to="/jobs/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus size={16} className="mr-2" />
              Create Job
            </Link>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="w-full md:w-1/4">
              <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priorityFilter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            
            <div className="w-full md:w-1/4">
              <label htmlFor="shipFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Ship
              </label>
              <select
                id="shipFilter"
                value={shipFilter}
                onChange={(e) => setShipFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ships</option>
                {ships.map(ship => (
                  <option key={ship.id} value={ship.id}>{ship.name}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/4 flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {filteredJobs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {(searchTerm || statusFilter || priorityFilter || shipFilter)
              ? "No jobs match your search criteria. Try different filters."
              : "There are no maintenance jobs registered in the system yet."}
          </p>
          {canCreateJob && (
            <Link
              to="/jobs/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Create Your First Job
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Component
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ship
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Priority
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Engineer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Scheduled Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr 
                  key={job.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/components/${job.componentId}`} className="text-blue-600 hover:text-blue-800">
                      {getComponentName(job.componentId)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/ships/${job.shipId}`} className="text-blue-600 hover:text-blue-800">
                      {getShipName(job.shipId)}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {job.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityBadgeClass(
                        job.priority
                      )}`}
                    >
                      {job.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {getEngineerName(job.assignedEngineerId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(job.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/jobs/${job.id}`}
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
                      
                      {canEditJob && (
                        <Link
                          to={`/jobs/edit/${job.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <span className="sr-only">Edit</span>
                          <Edit className="h-5 w-5" />
                        </Link>
                      )}
                      
                      {canDeleteJob && (
                        <button
                          onClick={(e) => handleDelete(job.id, e)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <span className="sr-only">Delete</span>
                          <Trash2 className="h-5 w-5" />
                        </button>
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
  );
};

export default JobList;