import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { Job } from '../types';
import { 
  getJobs, 
  getJobsByShipId,
  getJobsByComponentId,
  getJobsForDate,
  addJob, 
  updateJob, 
  deleteJob 
} from '../utils/localStorageUtils';

interface JobsContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  getJobsByShipId: (shipId: string) => Job[];
  getJobsByComponentId: (componentId: string) => Job[];
  getJobsForDate: (date: string) => Job[];
  addJob: (job: Omit<Job, 'id'>) => Promise<Job>;
  updateJob: (job: Job) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  refreshJobs: () => void;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobData = getJobs();
        setJobs(jobData);
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Get jobs by ship ID
  const getJobsByShipIdHandler = (shipId: string): Job[] => {
    return getJobsByShipId(shipId);
  };

  // Get jobs by component ID
  const getJobsByComponentIdHandler = (componentId: string): Job[] => {
    return getJobsByComponentId(componentId);
  };

  // Get jobs for a specific date
  const getJobsForDateHandler = (date: string): Job[] => {
    return getJobsForDate(date);
  };

  // Add a new job
  const addJobHandler = async (jobData: Omit<Job, 'id'>): Promise<Job> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob = addJob(jobData);
      setJobs(prevJobs => [...prevJobs, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing job
  const updateJobHandler = async (jobData: Job): Promise<Job> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedJob = updateJob(jobData);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      return updatedJob;
    } catch (err) {
      setError('Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a job
  const deleteJobHandler = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh jobs data
  const refreshJobs = () => {
    try {
      const jobData = getJobs();
      setJobs(jobData);
    } catch (err) {
      setError('Failed to refresh jobs');
      console.error(err);
    }
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      error,
      getJobsByShipId: getJobsByShipIdHandler,
      getJobsByComponentId: getJobsByComponentIdHandler,
      getJobsForDate: getJobsForDateHandler,
      addJob: addJobHandler,
      updateJob: updateJobHandler,
      deleteJob: deleteJobHandler,
      refreshJobs
    }}>
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};