import React, { useEffect, useState } from 'react';
import { Job, Ship } from '../../types';
import { getJobs, getShips } from '../../utils/localStorageUtils';

const Charts: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [ships, setShips] = useState<Ship[]>([]);

  useEffect(() => {
    // Load data
    setJobs(getJobs());
    setShips(getShips());
  }, []);

  // Calculate job status distribution
  const jobStatusCounts = jobs.reduce((acc: Record<string, number>, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  // Calculate job priority distribution
  const jobPriorityCounts = jobs.reduce((acc: Record<string, number>, job) => {
    acc[job.priority] = (acc[job.priority] || 0) + 1;
    return acc;
  }, {});

  // Calculate jobs per ship
  const jobsPerShip = ships.map(ship => {
    const shipJobs = jobs.filter(job => job.shipId === ship.id);
    return {
      name: ship.name,
      jobCount: shipJobs.length
    };
  });

  // Status colors
  const statusColors: Record<string, string> = {
    Open: 'bg-blue-500',
    'In Progress': 'bg-yellow-500',
    Completed: 'bg-green-500',
    Cancelled: 'bg-gray-500'
  };

  // Priority colors
  const priorityColors: Record<string, string> = {
    Low: 'bg-green-500',
    Medium: 'bg-blue-500',
    High: 'bg-yellow-500',
    Critical: 'bg-red-500'
  };

  const getMaxJobCount = () => {
    if (jobsPerShip.length === 0) return 0;
    return Math.max(...jobsPerShip.map(ship => ship.jobCount));
  };
  
  const maxJobCount = getMaxJobCount();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Job Status Chart */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Job Status Distribution</h3>
        <div className="space-y-4">
          {Object.entries(jobStatusCounts).map(([status, count]) => (
            <div key={status} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{status}</span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${statusColors[status] || 'bg-gray-500'} h-2 rounded-full`} 
                  style={{ width: `${(count / jobs.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Job Priority Chart */}
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Job Priority Distribution</h3>
        <div className="space-y-4">
          {Object.entries(jobPriorityCounts).map(([priority, count]) => (
            <div key={priority} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{priority}</span>
                <span className="text-sm text-gray-600">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${priorityColors[priority] || 'bg-gray-500'} h-2 rounded-full`} 
                  style={{ width: `${(count / jobs.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs per Ship Chart */}
      <div className="bg-white p-5 rounded-lg shadow-sm lg:col-span-2">
        <h3 className="text-lg font-medium mb-4">Jobs per Ship</h3>
        <div className="space-y-4">
          {jobsPerShip.map((ship) => (
            <div key={ship.name} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium truncate">{ship.name}</span>
                <span className="text-sm text-gray-600">{ship.jobCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: maxJobCount > 0 ? `${(ship.jobCount / maxJobCount) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;