'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import AdminFooter from '@/components/admin/AdminFooter';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if admin is authenticated
        const checkAuth = () => {
            const token = localStorage.getItem('admin-token');
            if (!token) {
                router.push('/auth/admin/signin');
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [router]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-dark">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminTopBar />
                <main className="flex-1 p-8">
                    {children}
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}