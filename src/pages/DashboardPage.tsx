import React from 'react';
import KPICards from '../components/Dashboard/KPICards';
import Charts from '../components/Dashboard/Charts';
import { Gauge } from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Gauge className="mr-2 text-blue-600" size={24} />
          Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Overview of ship maintenance operations and key metrics
        </p>
      </div>

      <div className="mb-8">
        <KPICards />
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Analytics Overview</h3>
        <Charts />
      </div>
    </div>
  );
};

export default DashboardPage;