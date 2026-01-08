'use client';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { useState } from 'react';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+27 123 456 789', '+27 987 654 321'],
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@knmatricexcellence.co.za', 'support@knmatricexcellence.co.za'],
    color: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    icon: MapPin,
    title: 'Location',
    details: ['KwaZulu-Natal', 'South Africa'],
    color: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
    color: 'bg-purple-50 dark:bg-purple-900/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Breadcrumb
        pageName="Contact Us"
        pageDescription="Get in touch with us - we're here to help you achieve matric excellence"
      />

      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className={`${info.color} p-6 rounded-lg text-center hover:shadow-lg transition-shadow`}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-dark-2 mb-4 shadow-sm">
                    <Icon className={info.iconColor} size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-dark dark:text-white mb-3">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-body-secondary text-sm mb-1">
                      {detail}
                    </p>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-dark-2 p-8 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-dark dark:text-white mb-2">
                  Send us a Message
                </h2>
                <p className="text-body-secondary">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-stroke dark:border-stroke-dark bg-transparent text-dark dark:text-white outline-none focus:border-primary transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-stroke dark:border-stroke-dark bg-transparent text-dark dark:text-white outline-none focus:border-primary transition"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-dark dark:text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-stroke dark:border-stroke-dark bg-transparent text-dark dark:text-white outline-none focus:border-primary transition"
                      placeholder="+27 123 456 789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-stroke dark:border-stroke-dark bg-transparent text-dark dark:text-white outline-none focus:border-primary transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="enrollment">Enrollment Inquiry</option>
                    <option value="subjects">Subject Information</option>
                    <option value="tutoring">Tutoring Services</option>
                    <option value="general">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-dark dark:text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-stroke dark:border-stroke-dark bg-transparent text-dark dark:text-white outline-none focus:border-primary transition resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-dark dark:text-white mb-6">
                  Get in Touch
                </h2>
                <p className="text-body-secondary text-lg leading-relaxed mb-6">
                  Have questions about our matric support programs? Want to know more about how we can
                  help you achieve your academic goals? We're here to help!
                </p>
                <p className="text-body-secondary leading-relaxed">
                  Our dedicated team is ready to answer your questions and guide you through the enrollment
                  process. Whether you're looking for information about specific subjects, tutoring schedules,
                  or our teaching methods, don't hesitate to reach out.
                </p>
              </div>

              {/* Why Contact Us */}
              <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4 mb-4">
                  <MessageCircle className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-2">
                      Why Contact Us?
                    </h3>
                    <ul className="space-y-2 text-body-secondary text-sm">
                      <li>• Get personalized course recommendations</li>
                      <li>• Learn about our enrollment process</li>
                      <li>• Schedule a consultation with our tutors</li>
                      <li>• Inquire about pricing and packages</li>
                      <li>• Ask about subject-specific support</li>
                      <li>• Request information about success rates</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Response Notice */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-2">
                  Quick Response Guarantee
                </h3>
                <p className="text-body-secondary text-sm">
                  We aim to respond to all inquiries within 24 hours during business days.
                  For urgent matters, please call us directly during working hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
