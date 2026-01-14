'use client';
import Image from 'next/image';
import { Icon } from "@iconify/react/dist/iconify.js";
import { getImagePrefix } from '@/utils/util';
import Slider from "react-slick";

const slides = [
    {
        title: "Transform Your Matric Results",
        subtitle: "Expert tutoring and personalized support for KwaZulu Natal matric learners",
        badge: "Get started today",
        image: "/images/banner/slide1.jpeg",
        features: ["Expert Tutors", "Proven Methods", "Success Focused"],
        gradient: "from-blue-900/70 to-purple-900/70"
    },
    {
        title: "Excel in Your Matric Exams",
        subtitle: "Comprehensive support across all major matric subjects",
        badge: "12+ Subjects Available",
        image: "/images/banner/slide2.jpeg",
        features: ["All Subjects", "Flexible Learning", "Personal Attention"],
        gradient: "from-purple-900/70 to-pink-900/70"
    },
    {
        title: "Unlock Your Full Potential",
        subtitle: "Bridge the gap between your current performance and your aspirations",
        badge: "Join Us Today",
        image: "/images/banner/slide3.jpeg",
        features: ["Tailored Programs", "Expert Educators", "Proven Results"],
        gradient: "from-green-900/70 to-blue-900/70"
    }
];

const Hero = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        arrows: true,
    };

    return (
        <section id="home-section" className='overflow-hidden'>
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="relative min-h-[600px]">
                        {/* Background Image */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 py-20 pb-10">
                            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                            <div className='flex items-center min-h-[500px]'>
                                <div className='max-w-2xl flex flex-col gap-8'>
                                    <div className='flex gap-2'>
                                        <Icon
                                            icon="solar:verified-check-bold"
                                            className="text-white text-xl inline-block me-2"
                                        />
                                        <p className='text-white text-sm font-semibold'>
                                            {slide.badge}
                                        </p>
                                    </div>
                                    <h1 className='text-white text-4xl sm:text-5xl lg:text-6xl font-bold'>
                                        {slide.title}
                                    </h1>
                                    <h3 className='text-white/90 text-lg sm:text-xl'>
                                        {slide.subtitle}
                                    </h3>
                                    <div className='flex items-center flex-wrap gap-6 pt-4'>
                                        {slide.features.map((feature, idx) => (
                                            <div key={idx} className='flex gap-2 items-center'>
                                                <Image
                                                    src={`${getImagePrefix()}images/banner/check-circle.svg`}
                                                    alt="check-image"
                                                    width={24}
                                                    height={24}
                                                    className='smallImage'
                                                />
                                                <p className='text-base sm:text-lg font-medium text-white'>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default Hero;
