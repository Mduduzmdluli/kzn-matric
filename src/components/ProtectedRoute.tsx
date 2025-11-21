'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('student' | 'instructor' | 'admin')[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Redirect to sign in if not authenticated
            router.push('/signin');
        } else if (
            !isLoading &&
            isAuthenticated &&
            allowedRoles &&
            user &&
            !allowedRoles.includes(user.role)
        ) {
            // Redirect to home if user doesn't have required role
            router.push('/');
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg
                        className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated or doesn't have required role
    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}

// Usage Example:
//
// import ProtectedRoute from '@/components/ProtectedRoute';
//
// export default function DashboardPage() {
//   return (
//     <ProtectedRoute>
//       <div>Your protected content here</div>
//     </ProtectedRoute>
//   );
// }
//
// Or with role-based protection:
//
// export default function InstructorPage() {
//   return (
//     <ProtectedRoute allowedRoles={['instructor', 'admin']}>
//       <div>Only instructors and admins can see this</div>
//     </ProtectedRoute>
//   );
// }