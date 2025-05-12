import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Authentication/LoginForm';
import { Anchor } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-10 left-0 right-0 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-800 text-white p-3 rounded-full">
            <Anchor size={24} />
          </div>
          <span className="text-2xl font-bold text-gray-800">ENTNT Ship Maintenance</span>
        </div>
      </div>
      
      <div className="w-full max-w-md mt-8">
        <LoginForm />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>ENTNT Ship Maintenance System</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} ENTNT Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;