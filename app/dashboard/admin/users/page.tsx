'use client'

import React, { useState, useEffect } from 'react'
import { getAllUsers, blockUser, updateUserRole, createAdminUser, deleteUser } from '@/app/actions/users'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' })
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
    
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        // Fetch quietly without showing loading state
        getAllUsers().then(data => {
          setUsers(prev => JSON.stringify(prev) !== JSON.stringify(data) ? data : prev);
        }).catch(e => console.error("Live update error:", e));
      }
    }, 10000);

    return () => clearInterval(intervalId);
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

  const handleDeleteUser = async (userId: string, targetRole: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    try {
      await deleteUser(userId, targetRole)
      toast.success('User deleted successfully')
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
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error('Please provide name, email, and password')
      return
    }
    setAddingAdmin(true)
    try {
      await createAdminUser(newAdmin.email, newAdmin.name, newAdmin.password)
      toast.success('Admin user created successfully!')
      setShowAddAdmin(false)
      setNewAdmin({ name: '', email: '', password: '' })
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
          <p className="text-[var(--color-gsp-text-secondary)] text-sm mt-1">Manage user access, block accounts, and assign roles.</p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddAdmin(true)}
            className="bg-[var(--color-gsp-text-inverse)] text-white px-4 py-2 rounded-[var(--radius-lg)] hover:bg-indigo-700 font-medium text-sm transition-colors"
          >
            + Add Admin
          </button>
        )}
      </div>

      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-xl)] shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Administrator</h2>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-gsp-text-primary)] mb-1">Name</label>
                <input aria-label="Input field" 
                  type="text" 
                  value={newAdmin.name} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full border border-[var(--color-gsp-border-default)] rounded-[var(--radius-lg)] p-2"
                  placeholder="Admin Name"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gsp-text-primary)] mb-1">Email</label>
                <input aria-label="Input field" 
                  type="email" 
                  value={newAdmin.email} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full border border-[var(--color-gsp-border-default)] rounded-[var(--radius-lg)] p-2"
                  placeholder="admin@example.com"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-gsp-text-primary)] mb-1">Password</label>
                <input aria-label="Input field" 
                  type="password" 
                  value={newAdmin.password} 
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full border border-[var(--color-gsp-border-default)] rounded-[var(--radius-lg)] p-2"
                  placeholder="Secure password"
                  required 
                  minLength={6}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddAdmin(false)}
                  className="px-4 py-2 text-[var(--color-gsp-text-secondary)] hover:text-[var(--color-gsp-text-primary)]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={addingAdmin}
                  className="bg-[var(--color-gsp-text-inverse)] text-white px-4 py-2 rounded-[var(--radius-lg)] hover:bg-indigo-700 disabled:opacity-50"
                >
                  {addingAdmin ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-[var(--color-gsp-surface-muted)] rounded-[var(--radius-lg)] shadow border border-[var(--color-gsp-border-muted)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--color-gsp-text-secondary)]">Loading users...</div>
        ) : users.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[var(--color-gsp-surface-raised)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-gsp-text-secondary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-gsp-surface-muted)] divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[var(--color-gsp-text-primary)]">{user.name}</div>
                      <div className="text-xs text-[var(--color-gsp-text-secondary)]">ID: {user.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-gsp-text-primary)]">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canEditRoles && session?.user?.id !== user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-sm border-[var(--color-gsp-border-default)] rounded-md"
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
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                            className={`px-3 py-1 rounded text-white ${user.is_blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                          >
                            {user.is_blocked ? 'Unblock' : 'Block'}
                          </button>
                          {((isSuperAdmin) || (isAdmin && user.role !== 'admin' && user.role !== 'super_admin')) && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.role)}
                              className="px-3 py-1 rounded text-white bg-gray-600 hover:bg-gray-700"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-[var(--color-gsp-text-secondary)]">No users found.</div>
        )}
      </div>
    </div>
  )
}

