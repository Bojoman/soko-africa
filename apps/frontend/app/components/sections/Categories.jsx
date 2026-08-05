"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryImage } from '../../lib/category-assets';

const BG_ROTATION = [
  'bg-soko-dark-teal/10',
  'bg-soko-orange/10',
  'bg-soko-bright-cyan/10',
  'bg-soko-dark-red/10',
  'bg-soko-dark-teal/10',
  'bg-soko-cream/30',
  'bg-soko-orange/10',
  'bg-soko-bright-cyan/10'
];

function mapCategories(roots) {
  return (roots || []).map((root, i) => ({
    title: root.name,
    slug: root.slug,
    link: root.slug === 'nyamazone' ? '/nyamazone' : `/categories/${root.slug}`,
    bgColor: BG_ROTATION[i % BG_ROTATION.length],
    subcategories: (root.children || []).slice(0, 4).map((ch) => ({
      name: ch.name,
      slug: ch.slug,
      image: getCategoryImage(ch.slug),
      link:
        root.slug === 'nyamazone'
          ? `/nyamazone?sub=${ch.slug}`
          : `/categories/${ch.slug}`
    }))
  }));
}

const Categories = ({ initialCategories = [] }) => {
  const [categoryGroups, setCategoryGroups] = useState(() =>
    mapCategories(initialCategories)
  );

  useEffect(() => {
    if (initialCategories?.length) {
      setCategoryGroups(mapCategories(initialCategories));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (!cancelled) setCategoryGroups(mapCategories(data?.categories || []));
      } catch {
        if (!cancelled) setCategoryGroups([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialCategories]);

  if (!categoryGroups.length) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          No categories available yet.
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {categoryGroups.map((group, groupIndex) => (
            <div
              key={group.slug || groupIndex}
              className={`${group.bgColor} rounded-lg overflow-hidden border border-transparent hover:border-soko-orange transition-colors`}
            >
              <div className="p-4 sm:p-5 pb-3">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2 min-h-12">
                  {group.title}
                </h2>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {group.subcategories.map((subcat, subIdx) => (
                    <Link key={subcat.slug} href={subcat.link} className="group">
                      <div className="aspect-square relative bg-white rounded-md overflow-hidden mb-1.5 sm:mb-2 shadow-sm">
                        <Image
                          src={subcat.image}
                          alt={subcat.name}
                          fill
                          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                          sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
                          loading={groupIndex === 0 && subIdx < 2 ? 'eager' : 'lazy'}
                          unoptimized
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-700 group-hover:text-soko-orange transition-colors line-clamp-1 font-medium">
                        {subcat.name}
                      </p>
                    </Link>
                  ))}
                </div>

                <Link
                  href={group.link}
                  className="text-xs sm:text-sm text-soko-bright-cyan hover:text-soko-orange hover:underline transition-colors inline-block mt-1 sm:mt-2 font-semibold"
                >
                  See more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
