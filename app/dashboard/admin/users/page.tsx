'use client'

import React, { useState, useEffect } from 'react'
import { getAllUsers, blockUser, updateUserRole, createAdminUser } from '@/app/actions/users'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '' })
  const [addingAdmin, setAddingAdmin] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(data)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleBlock = async (userId: string, currentlyBlocked: boolean) => {
    if (!confirm(`Are you sure you want to ${currentlyBlocked ? 'unblock' : 'block'} this user?`)) return
    try {
      await blockUser(userId, !currentlyBlocked)
      toast.success(`User ${currentlyBlocked ? 'unblocked' : 'blocked'} successfully`)
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole)
      toast.success(`User role updated to ${newRole}`)
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const isSuperAdmin = session?.user?.role === 'super_admin'
  const isAdmin = session?.user?.role === 'admin'
  const canEditRoles = isSuperAdmin || isAdmin

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdmin.name || !newAdmin.email) {
      toast.error('Please provide name and email')
      return
    }
    setAddingAdmin(true)
    try {
      await createAdminUser(newAdmin.email, newAdmin.name)
      toast.success('Admin user created successfully!')
      setShowAddAdmin(false)
      setNewAdmin({ name: '', email: '' })
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setAddingAdmin(false)
    }
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600 text-sm mt-1">Manage user access, block accounts, and assign roles.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddAdmin(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors"
          >
            + Add Admin
          </button>
        )}
      </div>

      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Administrator</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={newAdmin.name} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Admin Name"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={newAdmin.email} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="admin@example.com"
                  required 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={addingAdmin}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addingAdmin ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : users.length > 0 ? (
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canEditRoles && session?.user?.id !== user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md"
                        >
                          <option value="user">User</option>
                          <option value="scholar">Scholar</option>
                          {isSuperAdmin && (
                            <>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                          {user.role.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_blocked ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {session?.user?.id !== user.id && (
                        <button
                          onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                          className={`px-3 py-1 rounded text-white ${user.is_blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                          {user.is_blocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>
    </div>
  )
}
