"use client";
import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full">
          <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-dark dark:text-white mb-4">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-body-secondary mb-8">
          You don't have permission to access this page. This area is restricted
          to authorized administrators only.
        </p>

        {/* Error Code */}
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono">
            Error Code: 403 - Forbidden
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-dark-2 text-dark dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-dark-3 transition border border-stroke dark:border-stroke-dark"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-100 dark:bg-dark-2 rounded-lg border border-stroke dark:border-stroke-dark">
          <p className="text-sm text-body-secondary">
            If you believe this is an error, please contact your system
            administrator or{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}