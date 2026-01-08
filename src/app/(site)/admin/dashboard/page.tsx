'use client';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '@/components/Common/Loader';

const stats = [
  { label: 'Total Users', value: '2,345', icon: Users, color: 'bg-blue-500' },
  { label: 'Active Courses', value: '48', icon: BookOpen, color: 'bg-green-500' },
  { label: 'Students Enrolled', value: '1,234', icon: GraduationCap, color: 'bg-purple-500' },
  { label: 'Revenue', value: '$45,678', icon: TrendingUp, color: 'bg-yellow-500' },
];

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push('/auth/admin/login');
    }
    // Redirect if not admin
    if (!loading && user && !isAdmin()) {
      router.push('/unauthorized');
    }
  }, [user, loading, isAdmin, router]);

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user || !isAdmin()) {
    return null;
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark dark:text-white">Dashboard</h1>
        <p className="text-body-secondary mt-2">
          Welcome back, {user.first_name} {user.last_name}! Here's what's happening today.
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow border border-stroke dark:border-stroke-dark hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-secondary text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1 text-dark dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow border border-stroke dark:border-stroke-dark">
          <h2 className="text-xl font-bold mb-4 text-dark dark:text-white">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {[
              { action: 'New user registered', time: '2 minutes ago', type: 'user' },
              { action: 'Course "React Advanced" published', time: '15 minutes ago', type: 'course' },
              { action: '5 new enrollments', time: '1 hour ago', type: 'enrollment' },
              { action: 'Payment received: $299', time: '2 hours ago', type: 'payment' },
            ].map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-3 border-b border-stroke dark:border-stroke-dark last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-body-secondary mt-1">
                    {activity.time}
                  </p>
                </div>
                <span className={`
                  px-2 py-1 text-xs rounded-full
                  ${activity.type === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                  ${activity.type === 'course' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${activity.type === 'enrollment' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                  ${activity.type === 'payment' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                `}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Popular Courses */}
        <div className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow border border-stroke dark:border-stroke-dark">
          <h2 className="text-xl font-bold mb-4 text-dark dark:text-white">
            Popular Courses
          </h2>
          <div className="space-y-4">
            {[
              { name: 'Complete Web Development Bootcamp', students: 456, rating: 4.8 },
              { name: 'Advanced React & Next.js', students: 342, rating: 4.9 },
              { name: 'Python for Data Science', students: 289, rating: 4.7 },
              { name: 'UI/UX Design Masterclass', students: 234, rating: 4.6 },
            ].map((course, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-3 border-b border-stroke dark:border-stroke-dark last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark dark:text-white">
                    {course.name}
                  </p>
                  <p className="text-xs text-body-secondary mt-1">
                    {course.students} students enrolled
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {course.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Info Footer */}
      <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-body-secondary">Logged in as</p>
            <p className="font-medium text-dark dark:text-white">
              {user.username} (Role ID: {user.role_id})
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-body-secondary">Account Status</p>
            <p className={`font-medium ${user.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}