import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  gender?: string;
  nationality?: string;
  user_type?: string;
  role_id: number;
  is_active: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('admin-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('admin-user');
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Clear local storage
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');

      setUser(null);
      toast.success('Logged out successfully');
      router.push('/auth/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const isAdmin = () => {
    return user && (user.role_id === 1 || user.role_id === 2);
  };

  return {
    user,
    loading,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };
};