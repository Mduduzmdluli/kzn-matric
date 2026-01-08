'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { getImagePrefix } from '@/utils/util';
import toast from 'react-hot-toast';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/students', label: 'Students', icon: GraduationCap },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // Clear local storage
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-user');

      toast.success('Logged out successfully');
      router.push('/auth/admin/signin');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="w-64 bg-gray-900 dark:bg-dark text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800 dark:border-stroke-dark">
        <Link href="/admin/dashboard">
          <Image
            src={`${getImagePrefix()}/images/logo/logo.svg`}
            alt="logo"
            width={140}
            height={45}
            style={{ width: "auto", height: "auto" }}
            quality={100}
            className="brightness-0 invert"
          />
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800 dark:hover:bg-dark-2'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-800 dark:border-stroke-dark">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-800 dark:hover:bg-dark-2 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}