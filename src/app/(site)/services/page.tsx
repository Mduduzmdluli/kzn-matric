'use client';
import { BookOpen, Award, Users, Target, CheckCircle } from 'lucide-react';
import Breadcrumb from '@/components/Common/Breadcrumb';

const subjects = [
  {
    name: 'Mathematical Literacy',
    description: 'Develop essential mathematical skills for everyday life and work environments.',
    icon: '🔢',
  },
  {
    name: 'Mathematics',
    description: 'Master advanced mathematical concepts and problem-solving techniques.',
    icon: '📐',
  },
  {
    name: 'Economics',
    description: 'Understand economic principles, markets, and financial decision-making.',
    icon: '💰',
  },
  {
    name: 'Physical Science',
    description: 'Explore physics and chemistry through hands-on learning and experiments.',
    icon: '⚗️',
  },
  {
    name: 'Accounting',
    description: 'Learn financial accounting, bookkeeping, and business finance fundamentals.',
    icon: '📊',
  },
  {
    name: 'Life Science',
    description: 'Discover biology, human anatomy, and the natural world around us.',
    icon: '🧬',
  },
  {
    name: 'English',
    description: 'Enhance language skills, literature analysis, and communication abilities.',
    icon: '📚',
  },
  {
    name: 'Agriculture',
    description: 'Study farming practices, crop production, and agricultural management.',
    icon: '🌾',
  },
  {
    name: 'Geography',
    description: 'Explore physical and human geography, climate, and environmental studies.',
    icon: '🌍',
  },
  {
    name: 'Business Studies',
    description: 'Learn business management, entrepreneurship, and organizational skills.',
    icon: '💼',
  },
  {
    name: 'isiZulu',
    description: 'Develop proficiency in isiZulu language, literature, and cultural studies.',
    icon: '🗣️',
  },
  {
    name: 'Tourism',
    description: 'Understand tourism industry, hospitality, and travel management.',
    icon: '✈️',
  },
];

const features = [
  {
    icon: Users,
    title: 'Personalized Attention',
    description: 'Small class sizes ensuring each learner receives individual focus and support.',
  },
  {
    icon: Target,
    title: 'Targeted Strategies',
    description: 'Customized improvement plans designed to address specific learning needs.',
  },
  {
    icon: Award,
    title: 'Expert Tutors',
    description: 'Qualified and experienced educators dedicated to student success.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Materials',
    description: 'Access to quality learning resources and study materials for all subjects.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Breadcrumb
        pageName="Our Services"
        pageDescription="Specialized tutoring and support programs for KwaZulu Natal Matric Excellence"
      />

      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          {/* Introduction */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-5xl mb-6">
              Comprehensive Academic Support
            </h2>
            <p className="text-body-secondary max-w-4xl mx-auto text-lg leading-relaxed">
              Our programs are designed to cater to the unique needs of each learner, ensuring
              personalized attention and targeted improvement strategies. KwaZulu Natal Matric
              Excellence offers specialized tutoring and support in the following subjects:
            </p>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark hover:shadow-xl transition-shadow text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-dark dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body-secondary text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Subjects Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">
                Our Subject Offerings
              </h2>
              <p className="text-body-secondary max-w-2xl mx-auto">
                We provide expert tutoring across all major matric subjects to help you achieve excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark hover:shadow-xl hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {subject.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-dark dark:text-white mb-2 group-hover:text-primary transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-body-secondary text-sm leading-relaxed">
                        {subject.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-dark dark:text-white mb-6">
                  Why Choose KwaZulu Natal Matric Excellence?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                    <p className="text-body-secondary">
                      <strong className="text-dark dark:text-white">Proven Track Record:</strong> Years of success in helping students achieve their matric goals.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                    <p className="text-body-secondary">
                      <strong className="text-dark dark:text-white">Flexible Scheduling:</strong> Classes designed to fit around your existing commitments.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                    <p className="text-body-secondary">
                      <strong className="text-dark dark:text-white">Comprehensive Support:</strong> Beyond tutoring - exam preparation, study skills, and motivation.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                    <p className="text-body-secondary">
                      <strong className="text-dark dark:text-white">Affordable Programs:</strong> Quality education accessible to all learners.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                    <p className="text-body-secondary">
                      <strong className="text-dark dark:text-white">Modern Learning Tools:</strong> Blend of traditional teaching and innovative technology.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-dark-2 p-8 rounded-xl shadow-lg border border-stroke dark:border-stroke-dark">
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">
                  Ready to Excel?
                </h3>
                <p className="text-body-secondary mb-6">
                  Join thousands of students who have achieved matric success with our guidance and support.
                </p>
                <div className="space-y-3">
                  <a
                    href="/signup"
                    className="block w-full text-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                  >
                    Enroll Now
                  </a>
                  <a
                    href="/#courses"
                    className="block w-full text-center px-6 py-3 bg-white dark:bg-dark text-dark dark:text-white border border-stroke dark:border-stroke-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-2 transition"
                  >
                    View All Courses
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* School Fees Section */}
          <div className="mt-16 bg-white dark:bg-dark-2 rounded-2xl shadow-xl border border-stroke dark:border-stroke-dark overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-6 md:p-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                School Fees & Payment Information
              </h2>
              <p className="text-white/90">
                Transparent pricing with flexible payment options
              </p>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fees Breakdown */}
                <div>
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">
                    Entry Requirements & Fees
                  </h3>

                  <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 mb-6 border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-dark dark:text-white">Grand Total</span>
                      <span className="text-2xl font-bold text-primary">R9,000</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-dark rounded-lg p-4 border border-stroke dark:border-stroke-dark">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-dark dark:text-white">Registration Fee</span>
                        <span className="font-bold text-primary">R3,000</span>
                      </div>
                      <p className="text-sm text-body-secondary mt-1">Payable upon registration</p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold text-dark dark:text-white mb-3">Monthly Installments (R1,000 each):</h4>

                      {[
                        { month: '1st Installment', date: '28th February' },
                        { month: '2nd Installment', date: '30th March' },
                        { month: '3rd Installment', date: '30th April' },
                        { month: '4th Installment', date: '31st May' },
                        { month: '5th Installment', date: '30th June' },
                        { month: '6th Installment', date: '31st July' },
                      ].map((installment, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-4 bg-white dark:bg-dark-2 rounded border border-stroke dark:border-stroke-dark">
                          <div>
                            <span className="text-dark dark:text-white font-medium">{installment.month}</span>
                            <span className="text-sm text-body-secondary ml-2">({installment.date})</span>
                          </div>
                          <span className="font-semibold text-dark dark:text-white">R1,000</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banking Details */}
                <div>
                  <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">
                    Banking Details
                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-dark dark:to-dark-2 rounded-lg p-6 border-2 border-primary/30 mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-body-secondary mb-1">Account Name</p>
                        <p className="text-lg font-bold text-dark dark:text-white">KWAZULU NATAL MATRIC EXCELLENCE</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-body-secondary mb-1">Bank</p>
                          <p className="font-semibold text-dark dark:text-white">STANDARD BANK</p>
                        </div>
                        <div>
                          <p className="text-sm text-body-secondary mb-1">Account Type</p>
                          <p className="font-semibold text-dark dark:text-white">CHEQUE</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-dark rounded-lg p-4 border border-primary/20">
                        <p className="text-sm text-body-secondary mb-1">Account Number</p>
                        <p className="text-2xl font-bold text-primary tracking-wider">10251031053</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-dark dark:text-white mb-2 flex items-center gap-2">
                      <span className="text-amber-600">⚠️</span>
                      Payment Methods
                    </h4>
                    <ul className="space-y-2 text-sm text-body-secondary">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                        <span>Direct cash payment at counter during registration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="text-primary flex-shrink-0 mt-0.5" size={16} />
                        <span>Bank deposit to the account above</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark rounded-lg p-6 border border-stroke dark:border-stroke-dark">
                    <h4 className="font-semibold text-dark dark:text-white mb-3">Contact Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-body-secondary">Phone:</span>
                        <a href="tel:0726953911" className="text-primary hover:underline font-medium">072 695 3911</a>
                        <span className="text-body-secondary">/</span>
                        <a href="tel:0843259834" className="text-primary hover:underline font-medium">084 325 9834</a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-body-secondary">Email:</span>
                        <a href="mailto:admin@matricexcellence.co.za" className="text-primary hover:underline font-medium">
                          admin@matricexcellence.co.za
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">
              Have Questions About Our Services?
            </h3>
            <p className="text-body-secondary mb-6 max-w-2xl mx-auto">
              Our team is here to help you choose the right program for your academic goals.
            </p>
            <a
              href="/#testimonial"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary/10 text-primary border border-primary rounded-lg font-medium hover:bg-primary hover:text-white transition"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
