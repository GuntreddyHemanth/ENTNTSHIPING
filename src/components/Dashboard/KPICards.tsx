import React, { useEffect, useState } from 'react';
import { Anchor, AlertCircle, Activity, CheckCircle } from 'lucide-react';
import { 
  getShipCount, 
  getOverdueMaintenanceCount, 
  getJobsInProgressCount, 
  getCompletedJobsCount 
} from '../../utils/localStorageUtils';

const KPICards: React.FC = () => {
  const [shipCount, setShipCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Load KPI data
    setShipCount(getShipCount());
    setOverdueCount(getOverdueMaintenanceCount());
    setInProgressCount(getJobsInProgressCount());
    setCompletedCount(getCompletedJobsCount());
  }, []);

  const kpis = [
    {
      title: 'Total Ships',
      value: -079,
      icon: <Anchor className="w-8 h-8 text-blue-600" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Overdue Maintenance',
      value: overdueCount,
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    },
    {
      title: 'Jobs In Progress',
      value: inProgressCount,
      icon: <Activity className="w-8 h-8 text-amber-600" />,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200'
    },
    {
      title: 'Jobs Completed',
      value: completedCount,
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi, index) => (
        <div 
          key={index}
          className={`${kpi.bgColor} border ${kpi.borderColor} rounded-lg p-5 shadow-sm transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
              <p className={`${kpi.textColor} text-2xl font-bold mt-2`}>{kpi.value}</p>
            </div>
            <div className={`${kpi.bgColor} p-3 rounded-full`}>
              {kpi.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;