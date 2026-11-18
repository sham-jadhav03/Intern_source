import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Zap, Award } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    tag: 'Next-Gen Electronics Drop',
    title: 'Experience Audio & Computing Mastery',
    description: 'Up to 25% off flagship noise-cancelling headphones, high-refresh OLED displays, and pro creator essentials.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
    link: '/products?category=Electronics',
    cta: 'Shop Electronics',
    bgColor: 'from-slate-900 via-navy-900 to-slate-950',
    badge: 'Limited Stock Deal',
  },
  {
    id: 2,
    tag: 'Autumn / Winter Modern Fashion',
    title: 'Tailored Luxury & Sustainable Streetwear',
    description: 'Handcrafted Italian wool coats, selvedge denim & minimalist mulberry silk designs from independent fashion houses.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    link: '/products?category=Fashion',
    cta: 'Explore Runway Collection',
    bgColor: 'from-slate-950 via-slate-900 to-brand-primary',
    badge: 'Curated Designers',
  },
  {
    id: 3,
    tag: 'Artisanal Home & Kitchen',
    title: 'Upgrade Your Modern Living Space',
    description: 'Espresso craftsmanship, enameled Dutch ovens, and Nordic solid oak furniture straight from artisan workshops.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    link: '/products?category=Home%20%26%20Kitchen',
    cta: 'Discover Homeware',
    bgColor: 'from-navy-950 via-slate-900 to-slate-900',
    badge: 'Artisan Verified',
  },
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);

  const slide = bannerSlides[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-slate-950 shadow-2xl">
      {/* Slide Container */}
      <div className={`relative min-h-[420px] md:min-h-[480px] bg-gradient-to-r ${slide.bgColor} flex items-center transition-all duration-700`}>
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay md:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 w-full">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Zap className="w-3.5 h-3.5 text-brand-accent fill-brand-accent" />
              <span>{slide.tag}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
              {slide.description}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to={slide.link}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-brand-accent hover:bg-brand-accentHover text-white shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 transition-all"
              >
                Browse All 30+ Items
              </Link>
            </div>

            {/* Micro Trust Pills */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Buyer Protection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Vetted Multi-Vendors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-brand-accent">WELCOME10</span>
                <span>applied at checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
          title="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-colors"
          title="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-brand-accent' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
