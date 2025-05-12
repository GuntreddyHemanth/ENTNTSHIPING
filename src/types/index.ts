export interface User {
  id: string;
  role: 'Admin' | 'Inspector' | 'Engineer';
  email: string;
  password: string;
}

export interface Ship {
  id: string;
  name: string;
  imo: string;
  flag: string;
  status: 'Active' | 'Under Maintenance' | 'Out of Service';
}

export interface Component {
  id: string;
  shipId: string;
  name: string;
  serialNumber: string;
  installDate: string;
  lastMaintenanceDate: string;
}

export interface Job {
  id: string;
  componentId: string;
  shipId: string;
  type: 'Inspection' | 'Repair' | 'Replacement' | 'Overhaul';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedEngineerId: string;
  scheduledDate: string;
  completedDate?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'JobCreated' | 'JobUpdated' | 'JobCompleted';
  message: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
}

export type AppState = {
  users: User[];
  ships: Ship[];
  components: Component[];
  jobs: Job[];
  notifications: Notification[];
}