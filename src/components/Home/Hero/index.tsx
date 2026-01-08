'use client';
import Image from 'next/image';
import { Icon } from "@iconify/react/dist/iconify.js";
import { getImagePrefix } from '@/utils/util';
import Slider from "react-slick";
// @ts-ignore
import "slick-carousel/slick/slick.css";
// @ts-ignore
import "slick-carousel/slick/slick-theme.css";

const slides = [
    {
        title: "Transform Your Matric Results",
        subtitle: "Expert tutoring and personalized support for KwaZulu Natal matric learners",
        badge: "Get started today",
        image: "/images/banner/mahila.png",
        features: ["Expert Tutors", "Proven Methods", "Success Focused"]
    },
    {
        title: "Excel in Your Matric Exams",
        subtitle: "Comprehensive support across all major matric subjects",
        badge: "12+ Subjects Available",
        image: "/images/banner/mahila.png",
        features: ["All Subjects", "Flexible Learning", "Personal Attention"]
    },
    {
        title: "Unlock Your Full Potential",
        subtitle: "Bridge the gap between your current performance and your aspirations",
        badge: "Join Us Today",
        image: "/images/banner/mahila.png",
        features: ["Tailored Programs", "Expert Educators", "Proven Results"]
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
        <section id="home-section" className='bg-slateGray overflow-hidden'>
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 pt-20 pb-10">
                            <div className='grid grid-cols-1 lg:grid-cols-12 space-x-1 items-center gap-8'>
                                <div className='col-span-6 flex flex-col gap-8'>
                                    <div className='flex gap-2 mx-auto lg:mx-0'>
                                        <Icon
                                            icon="solar:verified-check-bold"
                                            className="text-success text-xl inline-block me-2"
                                        />
                                        <p className='text-success text-sm font-semibold text-center lg:text-start'>
                                            {slide.badge}
                                        </p>
                                    </div>
                                    <h1 className='text-midnight_text text-4xl sm:text-5xl font-semibold pt-5 lg:pt-0'>
                                        {slide.title}
                                    </h1>
                                    <h3 className='text-black/70 text-lg pt-5 lg:pt-0'>
                                        {slide.subtitle}
                                    </h3>
                                    <div className='flex items-center justify-between pt-10 lg:pt-4 flex-wrap gap-4'>
                                        {slide.features.map((feature, idx) => (
                                            <div key={idx} className='flex gap-2'>
                                                <Image
                                                    src={`${getImagePrefix()}images/banner/check-circle.svg`}
                                                    alt="check-image"
                                                    width={30}
                                                    height={30}
                                                    className='smallImage'
                                                />
                                                <p className='text-sm sm:text-lg font-normal text-black'>{feature}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className='col-span-6 flex justify-center'>
                                    <Image
                                        src={`${getImagePrefix()}${slide.image}`}
                                        alt={slide.title}
                                        width={1000}
                                        height={805}
                                        priority={index === 0}
                                    />
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
