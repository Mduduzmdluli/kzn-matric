'use client';
import { Play } from 'lucide-react';
import { useState } from 'react';

const Welcome = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="welcome" className="py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-dark">
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Section - Left Side */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-primary/5 aspect-video">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary/60">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group relative"
                    aria-label="Play video"
                  >
                    <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                    <div className="relative bg-white rounded-full p-6 group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="text-primary" size={48} fill="currentColor" />
                    </div>
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-sm font-medium">
                      Watch our story
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
                  title="KwaZulu Natal Matric Excellence Introduction"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
          </div>

          {/* Content Section - Right Side */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-dark dark:text-white mb-6">
              Welcome to <span className="text-primary">KwaZulu Natal Matric Excellence</span>
            </h2>

            <div className="space-y-4 text-body-secondary leading-relaxed">
              <p className="text-lg">
                KwaZulu Natal Matric Excellence is a dynamic and purpose-driven educational company
                founded in <strong className="text-dark dark:text-white">2024</strong> by two visionary women:
                <strong className="text-dark dark:text-white"> Buhle Langa</strong> and
                <strong className="text-dark dark:text-white"> Londiwe Buthelezi</strong>.
              </p>

              <p>
                The company was born out of a shared passion for education and a deep understanding
                of the challenges faced by matric learners who struggle to achieve the results they
                need to access tertiary education and secure better career opportunities.
              </p>

              <p>
                With a focus on <strong className="text-dark dark:text-white">empowerment</strong> and
                <strong className="text-dark dark:text-white"> academic excellence</strong>, KwaZulu Natal
                Matric Excellence is committed to transforming the lives of learners across the province.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href="/services"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition shadow-lg hover:shadow-xl"
              >
                Explore Our Services
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-dark-2 text-dark dark:text-white border border-stroke dark:border-stroke-dark rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark transition"
              >
                Learn More About Us
              </a>
            </div>

            {/* Stats or Highlights */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-primary mb-1">2024</h3>
                <p className="text-sm text-body-secondary">Founded</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-primary mb-1">12+</h3>
                <p className="text-sm text-body-secondary">Subjects</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-primary mb-1">100%</h3>
                <p className="text-sm text-body-secondary">Committed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
