'use client';
import { GraduationCap, Globe, Home, BookOpen } from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Expert Educators',
    description: 'Educators our team consists of highly qualified and experienced tutors who are passionate about teaching and committed to learner\'s success.',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: Globe,
    title: 'Proven Results',
    description: 'By focusing on core concepts, exam techniques, and confidence-building, we help learners achieve significant improvement in their results.',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: Home,
    title: 'Empowering Futures',
    description: 'Beyond academics, we equip learners with the skills and mindset needed to pursue higher education and career opportunities.',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Tailored Programs',
    description: 'We understand that every learner is unique, and we customize our teaching methods to suit individual\'s needs.',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-orange-500',
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-dark">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`${feature.color} rounded-2xl p-8 text-center hover:shadow-xl transition-shadow duration-300`}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="inline-block">
                    <Icon className={`${feature.iconColor}`} size={64} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-primary dark:text-primary mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-body-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
