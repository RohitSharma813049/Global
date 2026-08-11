'use client'

import React, { useState, useEffect } from 'react'
import { getUsersPaginated, blockUser, updateUserRole, createUserAccount, deleteUser, updateUserDetails } from '@/app/actions/users'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { MoreVertical, Ban, Unlock, Trash2, Edit, Search, UserPlus } from 'lucide-react'
import Pagination from '@/components/shared/pagination'

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' })
  const [addingUser, setAddingUser] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Edit User State
  const [showEditUser, setShowEditUser] = useState(false)
  const [editingUser, setEditingUser] = useState<{ id: string, name: string, email: string } | null>(null)
  const [savingUser, setSavingUser] = useState(false)

  // Search State with Debounce
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  // Debounce search input by 300ms to optimize network calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.user-action-menu')) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await getUsersPaginated(currentPage, itemsPerPage, debouncedSearch)
      setUsers(data.users)
      setTotalItems(data.total)
      setTotalPages(data.totalPages)
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, debouncedSearch])

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

  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please provide name, email, and password')
      return
    }
    setAddingUser(true)
    try {
      await createUserAccount({
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
        role: newUser.role
      })
      toast.success(`${newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)} account created successfully!`)
      setShowAddUserModal(false)
      setNewUser({ name: '', email: '', password: '', role: 'user' })
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message || 'Failed to create user')
    } finally {
      setAddingUser(false)
    }
  }

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setSavingUser(true)
    try {
      await updateUserDetails(editingUser.id, editingUser.name, editingUser.email)
      toast.success('User updated successfully')
      setShowEditUser(false)
      setEditingUser(null)
      fetchUsers()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSavingUser(false)
    }
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-(--color-gsp-text-secondary) text-sm mt-1">Manage user access, block accounts, and assign roles.</p>
        </div>
        {canEditRoles && (
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-(--color-gsp-text-inverse) text-white px-4 py-2 rounded-(--radius-lg) hover:bg-indigo-700 font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add User / Scholar
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-(--color-gsp-surface-raised) p-4 rounded-(--radius-lg) border border-(--color-gsp-border-muted)">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-(--color-gsp-text-secondary)" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-(--color-gsp-border-default) rounded-md leading-5 bg-(--color-gsp-surface-muted) placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-(--color-gsp-text-primary)">Add New User / Scholar</h2>
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name} 
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2 text-sm bg-white"
                  placeholder="Enter full name"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email} 
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2 text-sm bg-white"
                  placeholder="user@example.com"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Password</label>
                <input 
                  type="password" 
                  value={newUser.password} 
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2 text-sm bg-white"
                  placeholder="Secure password (min 6 characters)"
                  required 
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Account Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2 text-sm bg-white"
                >
                  <option value="user">User (Reader / General User)</option>
                  <option value="scholar">Scholar (Verified Scholar Profile)</option>
                  {isSuperAdmin && (
                    <option value="admin">Administrator</option>
                  )}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary) cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={addingUser}
                  className="bg-(--color-gsp-text-inverse) text-white px-4 py-2 rounded-(--radius-lg) hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {addingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditUser && editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-xl) shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-(--color-gsp-text-primary)">Edit User Details</h2>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editingUser.name} 
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2 text-sm bg-white"
                  placeholder="User Name"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-(--color-gsp-text-primary) mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={editingUser.email} 
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full border border-(--color-gsp-border-default) rounded-(--radius-lg) p-2 text-sm bg-white"
                  placeholder="user@example.com"
                  required 
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEditUser(false)}
                  className="px-4 py-2 text-sm font-medium text-(--color-gsp-text-secondary) hover:text-(--color-gsp-text-primary) cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={savingUser}
                  className="bg-(--color-gsp-text-inverse) text-white px-4 py-2 rounded-(--radius-lg) hover:bg-indigo-700 text-sm font-medium disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {savingUser ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-(--color-gsp-surface-muted) rounded-(--radius-lg) shadow border border-(--color-gsp-border-muted) overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-(--color-gsp-text-secondary)">Loading users...</div>
        ) : users.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-(--color-gsp-surface-raised)">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-(--color-gsp-text-secondary) uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-(--color-gsp-surface-muted) divide-y divide-gray-200">
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-(--color-gsp-text-secondary)">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-(--color-gsp-text-primary)">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-(--color-gsp-text-primary)">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canEditRoles && session?.user?.id !== user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-sm border-(--color-gsp-border-default) rounded-md p-1 bg-white"
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
                        <div className="relative inline-block text-left user-action-menu">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === user.id ? null : user.id);
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>

                          {openMenuId === user.id && (
                            <div 
                              className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1"
                            >
                              <button
                                onClick={() => { setOpenMenuId(null); handleToggleBlock(user.id, user.is_blocked); }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer ${user.is_blocked ? 'text-green-700 hover:bg-green-50' : 'text-amber-700 hover:bg-amber-50'}`}
                              >
                                {user.is_blocked ? <><Unlock className="w-4 h-4" /> Unblock</> : <><Ban className="w-4 h-4" /> Block</>}
                              </button>
                              
                              <button
                                onClick={() => { setOpenMenuId(null); setEditingUser({ id: user.id, name: user.name, email: user.email }); setShowEditUser(true); }}
                                className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              
                              {((isSuperAdmin) || (isAdmin && user.role !== 'admin' && user.role !== 'super_admin')) && (
                                <>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() => { setOpenMenuId(null); handleDeleteUser(user.id, user.role); }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </>
                              )}
                            </div>
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
          <div className="p-8 text-center text-(--color-gsp-text-secondary)">No users found matching your criteria.</div>
        )}
        
        {totalItems > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

