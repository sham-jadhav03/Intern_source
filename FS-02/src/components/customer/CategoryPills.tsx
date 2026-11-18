import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketStore } from '../../store/useMarketStore';
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Watch,
  HeartPulse,
  Grid,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-5 h-5" />,
  Shirt: <Shirt className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Dumbbell: <Dumbbell className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Watch: <Watch className="w-5 h-5" />,
  HeartPulse: <HeartPulse className="w-5 h-5" />,
};

export const CategoryPills: React.FC = () => {
  const { categories } = useMarketStore();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shop By Popular Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore 8 diverse departments powered by independent verified vendors
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-brand-accent hover:text-brand-accentHover flex items-center gap-1 group"
        >
          <span>View All</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const icon = iconMap[cat.icon] || <Grid className="w-5 h-5" />;

          return (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-accent hover:shadow-lg transition-all duration-200 text-center"
            >
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden mb-2.5 bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-inner">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-brand-primary/30 flex items-center justify-center text-white backdrop-blur-[1px]">
                  {icon}
                </div>
              </div>

              <span className="text-xs font-bold text-slate-800 group-hover:text-brand-accent line-clamp-1">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                {cat.itemCount} items
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
