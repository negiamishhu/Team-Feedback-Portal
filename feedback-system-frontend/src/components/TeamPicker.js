import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CheckCircle, AlertCircle, UserPlus, Mail, Shield } from 'lucide-react';

const TeamPicker = () => {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/all-employees', { withCredentials: true });
      setEmployees(res.data.employees);
    } catch (err) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    setError('');
    setSuccess('');
    try {
      await axios.post('/assign-team', { employee_ids: selected }, { withCredentials: true });
      setSuccess('Team assigned successfully!');
      setSelected([]);
      fetchEmployees();
    } catch (err) {
      setError('Failed to assign team');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Build Your Team</h1>
                <p className="text-gray-300">Select employees to assign to your management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6">
            <div className="bg-red-500/20 backdrop-blur-lg rounded-xl border border-red-500/50 p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6">
            <div className="bg-green-500/20 backdrop-blur-lg rounded-xl border border-green-500/50 p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-200">{success}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
          {/* Selection Summary */}
          {selected.length > 0 && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {selected.length} employee{selected.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <button
                  onClick={() => setSelected([])}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}

          {/* Employee List */}
          <div className="space-y-3 mb-6">
            {employees.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg mb-2">No employees available</p>
                <p className="text-gray-400">There are no employees to assign at this time.</p>
              </div>
            ) : (
              employees.map((emp) => (
                <div
                  key={emp.id}
                  className={`relative overflow-hidden rounded-lg border transition-all duration-200 cursor-pointer ${
                    selected.includes(emp.id)
                      ? 'bg-blue-500/20 border-blue-500/50 transform scale-[1.02]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleSelect(emp.id)}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          selected.includes(emp.id)
                            ? 'bg-blue-600 border-blue-600'
                            : 'border-gray-400 hover:border-gray-300'
                        }`}>
                          {selected.includes(emp.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>

                      {/* Employee Info */}
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{emp.username}</h3>
                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                          <Mail className="w-3 h-3" />
                          <span>{emp.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2">
                      {emp.manager_id ? (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 text-yellow-200 border border-yellow-500/50 rounded-lg text-xs font-medium">
                          <Shield className="w-3 h-3" />
                          <span>Already Assigned</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-200 border border-green-500/50 rounded-lg text-xs font-medium">
                          <UserPlus className="w-3 h-3" />
                          <span>Available</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selection Overlay */}
                  {selected.includes(emp.id) && (
                    <div className="absolute inset-0 bg-blue-500/10 pointer-events-none">
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAssign}
              disabled={selected.length === 0}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                selected.length === 0
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-slate-600 to-gray-700 text-white hover:from-slate-700 hover:to-gray-800 transform hover:scale-105'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>
                Assign {selected.length > 0 ? `${selected.length} ` : ''}Employee{selected.length !== 1 ? 's' : ''} to My Team
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPicker;