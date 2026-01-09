'use client';
import { Users, Target, Eye, BookOpen, TrendingUp } from 'lucide-react';
import Breadcrumb from '@/components/Common/Breadcrumb';
import Image from 'next/image';
import { getImagePrefix } from '@/utils/util';

const stats = [
  { label: 'Founded', value: '2024', icon: TrendingUp },
  { label: 'Subjects Offered', value: '12+', icon: BookOpen },
  { label: 'Expert Tutors', value: 'Qualified', icon: Users },
  { label: 'Success Focus', value: '100%', icon: Target },
];

const team = [
  {
    name: 'Buhle Langa',
    role: 'Co-Founder',
    description: 'Visionary educator passionate about transforming matric learners\' academic journeys.',
    image: '/images/team/buhle.png',
  },
  {
    name: 'Londiwe Buthelezi',
    role: 'Co-Founder',
    description: 'Dedicated to empowering learners and ensuring academic excellence across KwaZulu-Natal.',
    image: '/images/team/londiwe.png',
  },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        pageName="About Us"
        pageDescription="Transforming the lives of matric learners across KwaZulu-Natal"
      />

      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
          {/* Welcome Section with Image */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image on Left */}
              <div className="relative">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/banner/slide1.jpeg"
                    alt="KwaZulu Natal Matric Excellence"
                    fill
                    className="object-cover"
                    quality={100}
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
              </div>

              {/* Content on Right */}
              <div>
                <h2 className="text-3xl font-bold text-dark dark:text-white sm:text-4xl lg:text-5xl mb-6">
                  Welcome to <span className="text-primary">KwaZulu Natal Matric Excellence</span>
                </h2>
                <div className="space-y-4 text-body-secondary text-lg leading-relaxed text-justify">
                  <p>
                    KwaZulu Natal Matric Excellence is a dynamic and purpose-driven educational company
                    founded in <strong className="text-dark dark:text-white">2024</strong> by two visionary women:
                    <strong className="text-dark dark:text-white"> Buhle Langa</strong> and
                    <strong className="text-dark dark:text-white"> Londiwe Buthelezi</strong>.
                  </p>
                  <p>
                    The company was born out of a shared passion for education and a deep understanding
                    of the challenges faced by matric learners who struggle to achieve the results they
                    need to access tertiary education and secure better career opportunities. With a focus
                    on <strong className="text-dark dark:text-white">empowerment</strong> and
                    <strong className="text-dark dark:text-white"> academic excellence</strong>, KwaZulu Natal
                    Matric Excellence is committed to transforming the lives of learners across the province.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-dark-2 p-6 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark text-center hover:shadow-xl transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-dark dark:text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-body-secondary">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {/* Mission */}
            <div className="bg-white dark:bg-dark-2 p-8 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white mb-4">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-body-secondary leading-relaxed">
                Our mission is to provide high-quality, accessible, and tailored academic support to
                matric learners, enabling them to improve their results and unlock their full potential.
                We aim to bridge the gap between learners' current performance and their aspirations,
                fostering a culture of resilience, determination, and success.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-dark-2 p-8 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white mb-4">
                <Eye size={28} />
              </div>
              <h3 className="text-2xl font-bold text-dark dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-body-secondary leading-relaxed">
                To be the leading provider of matric improvement programs in KwaZulu-Natal, recognized
                for our innovative teaching methods, exceptional results, and unwavering commitment to
                learner's success.
              </p>
            </div>
          </div>

          {/* Founders Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">
                Meet Our Founders
              </h2>
              <p className="text-body-secondary max-w-2xl mx-auto">
                Two visionary women dedicated to transforming education in KwaZulu-Natal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="bg-white dark:bg-dark-2 rounded-lg shadow-lg border border-stroke dark:border-stroke-dark overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
                    <Image
                      src={`${getImagePrefix()}${member.image}`}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      quality={100}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-body-secondary text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center bg-primary/5 dark:bg-primary/10 rounded-lg p-12 border border-primary/20">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">
              Ready to Excel in Your Matric?
            </h2>
            <p className="text-body-secondary mb-8 max-w-2xl mx-auto">
              Join us and unlock your full potential. Let us help you achieve the results you need
              for tertiary education and better career opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
              >
                Get Started Today
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-dark-2 text-dark dark:text-white border border-stroke dark:border-stroke-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark transition"
              >
                View Our Services
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
