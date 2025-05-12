import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ship } from '../../types';
import { useShips } from '../../contexts/ShipsContext';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/roleUtils';
import { Anchor, Edit, Trash2, Plus, Search } from 'lucide-react';

const ShipList: React.FC = () => {
  const { ships, loading, error, deleteShip } = useShips();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const canEditShip = hasPermission(user, 'canEditShip');
  const canDeleteShip = hasPermission(user, 'canDeleteShip');
  const canCreateShip = hasPermission(user, 'canCreateShip');

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this ship? This will also delete all associated components and jobs.')) {
      try {
        await deleteShip(id);
      } catch (err) {
        console.error('Failed to delete ship:', err);
      }
    }
  };

  // Filter ships based on search term
  const filteredShips = ships.filter(ship => 
    ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.imo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ship.flag.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Anchor className="mr-2 text-blue-600" size={24} />
          Ships Management
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          
          {canCreateShip && (
            <Link
              to="/ships/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus size={16} className="mr-2" />
              Add Ship
            </Link>
          )}
        </div>
      </div>

      {filteredShips.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Anchor size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No ships found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "No ships match your search criteria. Try a different search term."
              : "There are no ships registered in the system yet."}
          </p>
          {canCreateShip && (
            <Link
              to="/ships/new"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Ship
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
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  IMO Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Flag
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {filteredShips.map((ship) => (
                <tr 
                  key={ship.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/ships/${ship.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {ship.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {ship.imo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {ship.flag}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeClass(
                        ship.status
                      )}`}
                    >
                      {ship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/ships/${ship.id}`}
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
                      
                      {canEditShip && (
                        <Link
                          to={`/ships/edit/${ship.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <span className="sr-only">Edit</span>
                          <Edit className="h-5 w-5" />
                        </Link>
                      )}
                      
                      {canDeleteShip && (
                        <button
                          onClick={(e) => handleDelete(ship.id, e)}
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

export default ShipList;