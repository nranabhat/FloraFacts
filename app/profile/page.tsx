'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Lobster } from 'next/font/google'
import { FirebaseError } from 'firebase/app'
import toast from 'react-hot-toast'

const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function Profile() {
  const { user, deleteAccount, updateUserEmail, updateDisplayName } = useAuth()
  const router = useRouter()
  
  // State for account deletion
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // State for email update
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // State for notifications
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Add state for display name
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '')
  const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false)

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      await deleteAccount(password)
      toast.success('Account deleted successfully')
      setTimeout(() => router.push('/'), 2000)
    } catch (error) {
      console.error('Error deleting account:', error)
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            setError('Please log in again before deleting your account')
            break
          case 'auth/wrong-password':
            setError('Incorrect password')
            break
          default:
            setError('Failed to delete account. Please try again.')
        }
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsUpdating(true)
      setError(null)
      await updateUserEmail(newEmail, password)
      toast.success('Email updated successfully')
      setIsEditingEmail(false)
      setNewEmail('')
      setPassword('')
    } catch (error) {
      console.error('Error updating email:', error)
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/requires-recent-login':
            setError('Please log in again before updating your email')
            break
          case 'auth/wrong-password':
            setError('Incorrect password')
            break
          case 'auth/invalid-email':
            setError('Invalid email address')
            break
          default:
            setError('Failed to update email. Please try again.')
        }
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  // Add handler for display name update
  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsUpdatingDisplayName(true)
      setError(null)
      await updateDisplayName(newDisplayName)
      toast.success('Display name updated successfully')
      setIsEditingDisplayName(false)
    } catch (error) {
      console.error('Error updating display name:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update display name')
    } finally {
      setIsUpdatingDisplayName(false)
    }
  }

  if (!user) {
    router.push('/')
    return null
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className={`${lobster.className} text-4xl text-green-800 dark:text-green-500 mb-8 text-center`}>
        Profile Settings
      </h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-600 
          dark:text-green-400 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-600 
          dark:text-red-400 rounded">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h2>
          
          {/* Display Name Section */}
          <div className="mb-6">
            {isEditingDisplayName ? (
              <form onSubmit={handleUpdateDisplayName} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                      dark:bg-gray-700 dark:text-white shadow-sm p-2"
                    required
                    minLength={2}
                    maxLength={50}
                    pattern="[a-zA-Z0-9\s._-]+"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    2-50 characters, letters, numbers, spaces, dots, underscores, and hyphens only
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isUpdatingDisplayName}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg 
                      hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdatingDisplayName ? 'Updating...' : 'Update Name'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingDisplayName(false)
                      setNewDisplayName(user?.displayName || '')
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 
                      hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Display Name: </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {user?.displayName || 'Not set'}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingDisplayName(true)}
                  className="text-green-600 hover:text-green-700 text-sm"
                >
                  {user?.displayName ? 'Change Name' : 'Add Name'}
                </button>
              </div>
            )}
          </div>

          {isEditingEmail ? (
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                    dark:bg-gray-700 dark:text-white shadow-sm p-2"
                  required
                />
              </div>
              
              {user.providerData[0].providerId !== 'google.com' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                      dark:bg-gray-700 dark:text-white shadow-sm p-2"
                    required
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg 
                    hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Email'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingEmail(false)
                    setNewEmail('')
                    setPassword('')
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 
                    hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Email: {user.email}
              </p>
              <button
                onClick={() => setIsEditingEmail(true)}
                className="text-green-600 hover:text-green-700 text-sm"
              >
                Change Email
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-500 mb-4">
            Danger Zone
          </h2>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg 
              hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Delete Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will:
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Delete all your identified plants</li>
                <li>Remove your account information</li>
                <li>Log you out permanently</li>
              </ul>
            </p>

            {user.providerData[0].providerId !== 'google.com' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm your password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                    dark:bg-gray-700 dark:text-white shadow-sm p-2"
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setPassword('')
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 
                  hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || (!password && user.providerData[0].providerId !== 'google.com')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg 
                  hover:bg-red-700 transition-colors disabled:opacity-50
                  disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent 
                      rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 