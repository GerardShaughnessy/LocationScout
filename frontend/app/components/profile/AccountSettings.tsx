'use client';

import { useState } from 'react';
import Image from 'next/image';
import ActivityHistory from './ActivityHistory';
import { signOut } from 'next-auth/react';

interface AccountSettingsProps {
  userId: string;
  currentAvatar?: string;
}

export default function AccountSettings({ userId, currentAvatar }: AccountSettingsProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentAvatar || null);
  const [avatarError, setAvatarError] = useState('');
  const [avatarSuccess, setAvatarSuccess] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setPasswordSuccess('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        setPasswordError(data.error || 'Failed to update password');
      }
    } catch (error) {
      setPasswordError('An error occurred while updating password');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image size should be less than 5MB');
      return;
    }

    setAvatarFile(file);
    setAvatarError('');
    setAvatarSuccess('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setAvatarSuccess('Avatar updated successfully');
        setAvatarError('');
      } else {
        const data = await response.json();
        setAvatarError(data.error || 'Failed to update avatar');
      }
    } catch (error) {
      setAvatarError('An error occurred while uploading avatar');
    }
  };

  const handleAccountDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');

    try {
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (response.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        const data = await response.json();
        setDeleteError(data.error || 'Failed to delete account');
      }
    } catch (error) {
      setDeleteError('An error occurred while deleting account');
    }
  };

  return (
    <div className="space-y-8">
      {/* Avatar Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <form onSubmit={handleAvatarUpload} className="mt-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Change Picture
              </label>
              {avatarFile && (
                <button
                  type="submit"
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Upload
                </button>
              )}
            </form>
            {avatarError && (
              <p className="mt-2 text-sm text-red-600">{avatarError}</p>
            )}
            {avatarSuccess && (
              <p className="mt-2 text-sm text-green-600">{avatarSuccess}</p>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-green-600">{passwordSuccess}</p>
          )}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Activity History Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Activity History</h2>
        <ActivityHistory />
      </div>

      {/* Account Deletion Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          ) : (
            <form onSubmit={handleAccountDelete} className="space-y-4">
              <div>
                <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="deletePassword"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              {deleteError && (
                <p className="text-sm text-red-600">{deleteError}</p>
              )}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 