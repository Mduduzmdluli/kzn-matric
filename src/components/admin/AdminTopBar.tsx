'use client';
import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminTopBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-dark-2 border-b border-stroke dark:border-stroke-dark px-8 py-4 flex justify-end items-center">
      {/* Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark transition"
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <User className="text-white" size={20} />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-dark dark:text-white">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-body-secondary">
              {user?.role_id === 1 ? 'Super Admin' : 'Admin'}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`text-body-secondary transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-2 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark py-2 z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-stroke dark:border-stroke-dark">
              <p className="text-sm font-medium text-dark dark:text-white">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-body-secondary mt-1">
                @{user?.username}
              </p>
              {user?.gender && (
                <p className="text-xs text-body-secondary mt-1">
                  Gender: {user.gender}
                </p>
              )}
              {user?.nationality && (
                <p className="text-xs text-body-secondary mt-1">
                  Nationality: {user.nationality}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user?.is_active
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                  Role ID: {user?.role_id}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={() => {
                  router.push('/admin/profile');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark transition text-dark dark:text-white"
              >
                <UserCircle size={18} />
                <span className="text-sm">My Profile</span>
              </button>
              <button
                onClick={() => {
                  router.push('/admin/settings');
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-dark transition text-dark dark:text-white"
              >
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-stroke dark:border-stroke-dark pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-red-600 dark:text-red-400"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
