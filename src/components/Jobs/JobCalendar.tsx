import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types';
import { useJobs } from '../../contexts/JobsContext';
import { useComponents } from '../../contexts/ComponentsContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const JobCalendar: React.FC = () => {
  const { jobs } = useJobs();
  const { components } = useComponents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateJobs, setSelectedDateJobs] = useState<Job[]>([]);

  // Generate calendar days for the current month or week
  useEffect(() => {
    if (currentView === 'month') {
      // Generate days for month view
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // First day of the month
      const firstDay = new Date(year, month, 1);
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0);
      
      // Start from the first day of the week that contains the first day of the month
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - firstDay.getDay());
      
      // End on the last day of the week that contains the last day of the month
      const endDate = new Date(lastDay);
      if (endDate.getDay() < 6) {
        endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
      }
      
      // Generate all days in the range
      const days: Date[] = [];
      let currentDay = new Date(startDate);
      
      while (currentDay <= endDate) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      setCalendarDays(days);
    } else {
      // Generate days for week view
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      const days: Date[] = [];
      let currentDay = new Date(startOfWeek);
      
      for (let i = 0; i < 7; i++) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
      
      setCalendarDays(days);
    }
  }, [currentDate, currentView]);

  // Update selected date jobs
  useEffect(() => {
    if (selectedDate) {
      const dateJobs = jobs.filter(job => job.scheduledDate === selectedDate);
      setSelectedDateJobs(dateJobs);
    } else {
      setSelectedDateJobs([]);
    }
  }, [selectedDate, jobs]);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  };

  const getJobsForDate = (date: Date): Job[] => {
    const formattedDate = date.toISOString().split('T')[0];
    return jobs.filter(job => job.scheduledDate === formattedDate);
  };

  const getComponentName = (componentId: string): string => {
    const component = components.find(c => c.id === componentId);
    return component ? component.name : 'Unknown Component';
  };

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

  const formatMonthYear = (): string => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatWeekRange = (): string => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // If start and end are in the same month and year
    if (
      startOfWeek.getMonth() === endOfWeek.getMonth() &&
      startOfWeek.getFullYear() === endOfWeek.getFullYear()
    ) {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'long' })} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    }
    
    // If they're in different months but same year
    if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${endOfWeek.getDate()}, ${startOfWeek.getFullYear()}`;
    }
    
    // If they're in different years
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${startOfWeek.getDate()}, ${startOfWeek.getFullYear()} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short' })} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="mr-2 text-blue-600" size={24} />
          Maintenance Calendar
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={navigateToday}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Today
          </button>
          <div className="flex rounded-md border border-gray-300 overflow-hidden">
            <button
              onClick={() => setCurrentView('month')}
              className={`px-3 py-1.5 text-sm font-medium ${
                currentView === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:z-10`}
            >
              Month
            </button>
            <button
              onClick={() => setCurrentView('week')}
              className={`px-3 py-1.5 text-sm font-medium ${
                currentView === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:z-10`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <button
            onClick={navigatePrevious}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-medium text-gray-800">
            {currentView === 'month' ? formatMonthYear() : formatWeekRange()}
          </h3>
          <button
            onClick={navigateNext}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px border-b border-gray-200">
          {daysOfWeek.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px">
          {calendarDays.map((day, index) => {
            const dateJobs = getJobsForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = day.toISOString().split('T')[0] === selectedDate;
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`min-h-[100px] p-2 cursor-pointer transition-colors duration-200 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${isToday ? 'border-2 border-blue-500' : ''} ${
                  isSelected ? 'bg-blue-50' : ''
                } hover:bg-gray-50`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {dateJobs.length > 0 && (
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 rounded-full px-1.5 py-0.5">
                      {dateJobs.length}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dateJobs.slice(0, 2).map(job => (
                    <div
                      key={job.id}
                      className={`text-xs truncate rounded px-1 py-0.5 ${getPriorityBadgeClass(job.priority)}`}
                    >
                      {getComponentName(job.componentId)}
                    </div>
                  ))}
                  {dateJobs.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dateJobs.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">
              Jobs for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          </div>

          {selectedDateJobs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No jobs scheduled for this date.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {selectedDateJobs.map(job => (
                <li key={job.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <Link to={`/jobs/${job.id}`} className="block">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-base font-medium text-blue-600">
                        {getComponentName(job.componentId)} - {job.type}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeClass(job.status)}`}>
                          {job.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadgeClass(job.priority)}`}>
                          {job.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {job.notes?.substring(0, 100) || 'No additional notes.'}
                      {job.notes && job.notes.length > 100 ? '...' : ''}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCalendar;