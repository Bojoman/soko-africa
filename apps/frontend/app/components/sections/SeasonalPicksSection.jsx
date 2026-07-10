"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryImage } from '../../lib/category-assets';

const SeasonalPicksSection = ({
  title = 'Seasonal Picks & Featured Categories',
  className = 'text-soko-bright-cyan'
}) => {
  const [seasonalCategories, setSeasonalCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/categories?seasonal=1');
        const data = await res.json();
        const flat = data?.categories || [];
        if (cancelled) return;
        const cards = flat.map((c) => ({
          id: c.slug,
          slug: c.slug,
          name: c.name,
          badge: 'Seasonal',
          description: `Curated picks in ${c.name}.`,
          image: getCategoryImage(c.slug),
          subcategories: [c.name]
        }));
        setSeasonalCategories(cards);
      } catch {
        if (!cancelled) setSeasonalCategories([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!seasonalCategories.length) {
    return (
      <section className={`py-16 bg-soko-cream/30 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          Loading seasonal picks…
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 bg-soko-cream/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-soko-bright-cyan mb-4">{title}</h2>
          <p className="text-xl text-gray-600">
            Discover the best of Africa&apos;s seasonal harvest and trending products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {seasonalCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-soko-orange transition-colors group"
            >
              <Link href={`/categories/${category.slug}`}>
                <div className="relative overflow-hidden">
                  <div className="relative h-64 sm:h-80">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      quality={85}
                      unoptimized
                    />

                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />

                    <span className="absolute top-4 left-4 bg-soko-orange text-white text-xs px-3 py-2 rounded-full font-bold">
                      {category.badge}
                    </span>

                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <h3 className="font-bold text-white text-2xl mb-2 group-hover:text-soko-orange transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-4 line-clamp-2">{category.description}</p>

                      <div className="flex items-center gap-1 text-white font-semibold text-sm group-hover:text-soko-orange transition-colors">
                        <span>Explore Category</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm">Shop this aisle</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.slice(0, 4).map((sub) => (
                      <span
                        key={sub}
                        className="px-3 py-1 bg-white text-gray-600 text-xs rounded-full border hover:border-soko-orange hover:text-soko-orange transition-colors"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>

              <div className="h-1 bg-soko-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories">
            <button className="bg-soko-orange hover:bg-soko-dark-red text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-sm">
              Browse All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SeasonalPicksSection;
