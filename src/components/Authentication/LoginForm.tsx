import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield as ShieldLock, Mail, KeyRound } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    if (!password.trim()) {
      setFormError('Password is required');
      return;
    }

    try {
      const success = await login(email, password);
      if (!success && !error) {
        setFormError('Invalid email or password');
      }
    } catch (err) {
      setFormError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="bg-blue-800 text-white p-4 rounded-full mb-4">
          <ShieldLock size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">ENTNT Ship Maintenance</h1>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {error || formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <KeyRound size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-600">
          <p>Demo Accounts:</p>
          <div className="mt-2 space-y-1 text-xs">
            <p><strong>Admin:</strong> admin@entnt.in / admin123</p>
            <p><strong>Inspector:</strong> inspector@entnt.in / inspect123</p>
            <p><strong>Engineer:</strong> engineer@entnt.in / engine123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;