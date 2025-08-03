import React, { useState, useEffect } from 'react';
import { Button } from '@eot/ui';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  UserPlus,
  Mail,
  Calendar
} from 'lucide-react';
import { mockUsers } from '../lib/api/mockData';
import { formatDate, getInitials, getStatusColor } from '../lib/utils';
import { UserRole } from '../lib/types';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  useEffect(() => {
    // Load users from mock data
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleDisplayName = (role) => {
    const roleNames = {
      [UserRole.DIRECTOR]: 'Director',
      [UserRole.PROJECT_MANAGER]: 'Project Manager',
      [UserRole.SCHEDULER]: 'Scheduler',
      [UserRole.ADMIN]: 'Administrator'
    };
    return roleNames[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      [UserRole.DIRECTOR]: 'bg-purple-100 text-purple-800',
      [UserRole.PROJECT_MANAGER]: 'bg-blue-100 text-blue-800',
      [UserRole.SCHEDULER]: 'bg-green-100 text-green-800',
      [UserRole.ADMIN]: 'bg-red-100 text-red-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    setShowActionsMenu(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">
              Manage user accounts and permissions
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value={UserRole.DIRECTOR}>Director</option>
                <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                <option value={UserRole.SCHEDULER}>Scheduler</option>
                <option value={UserRole.ADMIN}>Administrator</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({filteredUsers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {getInitials(user.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowActionsMenu(showActionsMenu === user.id ? null : user.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {showActionsMenu === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowActionsMenu(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </button>
                          <button
                            onClick={() => {
                              // Send invitation email logic
                              setShowActionsMenu(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Invitation
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedRole !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first user.'
              }
            </p>
            {!searchTerm && selectedRole === 'all' && (
              <div className="mt-6">
                <Button onClick={() => setShowAddModal(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal - Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
            <p className="text-sm text-gray-500 mb-4">
              This feature would open a form to add a new user to the system.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAddModal(false)}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;

