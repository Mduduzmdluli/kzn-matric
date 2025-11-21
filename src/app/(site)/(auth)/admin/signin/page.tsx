"use client";
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
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!loginData.username || !loginData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Call your custom login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses
        toast.error(data.message || "Login failed");
        setLoading(false);
        return;
      }

      if (data.success) {
        // Store token in localStorage if remember me is checked
        if (loginData.rememberMe && data.token) {
          localStorage.setItem("admin-token", data.token);
        }

        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem("admin-user", JSON.stringify(data.user));
        }

        toast.success("Login successful! Redirecting...");

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin/dashboard");
          router.refresh();
        }, 500);
      } else {
        toast.error(data.message || "Login failed");
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Login exception:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white dark:bg-dark-2 rounded-2xl shadow-lg p-8 border border-stroke dark:border-stroke-dark">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="max-w-[140px]">
                <Logo />
              </div>
            </div>
            <p className="text-body-secondary">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={loginUser} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-dark dark:text-white mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-grey" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-black/20 border-solid bg-transparent text-base text-dark dark:text-white outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none"
                  required
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-dark dark:text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-grey" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-12 py-3 rounded-md border border-black/20 border-solid bg-transparent text-base text-dark dark:text-white outline-none transition placeholder:text-grey focus:border-primary focus-visible:shadow-none"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-grey hover:text-primary transition" />
                  ) : (
                    <Eye className="h-5 w-5 text-grey hover:text-primary transition" />
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
                  className="h-4 w-4 text-primary focus:ring-primary border-stroke rounded cursor-pointer"
                  disabled={loading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-dark dark:text-white cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="/auth/admin/forgot-password"
                className="text-sm font-medium text-primary hover:underline transition"
                tabIndex={loading ? -1 : 0}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary w-full py-3 rounded-lg text-18 font-medium border border-primary hover:text-primary hover:bg-transparent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          {/* <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-body-secondary">
                <strong className="text-dark dark:text-white">Admin Access Only:</strong> This area is restricted to
                authorized administrators. All login attempts are monitored and
                logged.
              </p>
            </div>
          </div> */}

          {/* Back to Site Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-body-secondary hover:text-primary transition"
            >
              ← Back to main site
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-body-secondary">
            Protected by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;