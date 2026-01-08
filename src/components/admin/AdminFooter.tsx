'use client';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-dark-2 border-t border-stroke dark:border-stroke-dark mt-auto">
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">
              About Admin Panel
            </h3>
            <p className="text-xs text-body-secondary leading-relaxed">
              Manage your e-learning platform efficiently with our comprehensive
              admin dashboard. Monitor users, courses, and analytics in real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-xs text-body-secondary hover:text-primary transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/users"
                  className="text-xs text-body-secondary hover:text-primary transition"
                >
                  User Management
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/courses"
                  className="text-xs text-body-secondary hover:text-primary transition"
                >
                  Course Management
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/settings"
                  className="text-xs text-body-secondary hover:text-primary transition"
                >
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-dark dark:text-white mb-3">
              Support
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-body-secondary">
                <Mail size={14} className="text-primary" />
                <a
                  href="mailto:admin@elearning.com"
                  className="hover:text-primary transition"
                >
                  admin@elearning.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs text-body-secondary">
                <Phone size={14} className="text-primary" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-2 text-xs text-body-secondary">
                <MapPin size={14} className="text-primary" />
                <span>Admin Support Center</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-stroke dark:border-stroke-dark">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-body-secondary text-center md:text-left">
              © {currentYear} E-Learning Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-body-secondary">
              <span>Made with</span>
              <Heart size={12} className="text-red-500 fill-red-500" />
              <span>by Admin Team</span>
            </div>
            <div className="flex gap-4">
              <Link
                href="/admin/privacy"
                className="text-xs text-body-secondary hover:text-primary transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/admin/terms"
                className="text-xs text-body-secondary hover:text-primary transition"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
