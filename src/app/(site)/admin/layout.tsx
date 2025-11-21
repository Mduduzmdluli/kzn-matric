'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if admin is authenticated
        // Replace this with your actual auth check
        const checkAuth = () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/auth/admin/login');
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 bg-gray-50 p-8">
                {children}
            </main>
        </div>
    );
}