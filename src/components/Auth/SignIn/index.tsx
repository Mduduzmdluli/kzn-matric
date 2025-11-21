"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
    const router = useRouter();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!loginData.email || !loginData.password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const result = await signIn("credentials", {
                ...loginData,
                redirect: false,
                callbackUrl: "/admin/dashboard",
            });

            if (result?.error) {
                toast.error(result.error);
                console.error("Login error:", result.error);
                setLoading(false);
                return;
            }

            if (result?.ok && !result?.error) {
                toast.success("Admin login successful");
                setLoading(false);

                // Redirect to admin dashboard
                router.push("/admin/dashboard");
                router.refresh();
            }
        } catch (err: any) {
            setLoading(false);
            console.error("Login exception:", err);
            toast.error(err?.message || "An error occurred during login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full">
                            <Shield className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Admin Portal
                        </h1>
                        <p className="text-gray-600">
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <div className="max-w-[140px]">
                            <Logo />
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={loginUser} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, email: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, password: e.target.value })
                                    }
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={loginData.rememberMe}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, rememberMe: e.target.checked })
                                    }
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700 cursor-pointer"
                                >
                                    Remember me
                                </label>
                            </div>

                            <Link
                                href="/auth/admin/forgot-password"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-base hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader />
                                    <span className="ml-2">Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5 mr-2" />
                                    Sign In to Admin Portal
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start">
                            <Shield className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-yellow-800">
                                <strong>Admin Access Only:</strong> This area is restricted to
                                authorized administrators. All login attempts are monitored and
                                logged.
                            </p>
                        </div>
                    </div>

                    {/* Back to Site Link */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-gray-600 hover:text-indigo-600 transition"
                        >
                            ← Back to main site
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Protected by industry-standard encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;