"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Categories = () => {
  // Define category groups with subcategories
  const categoryGroups = [
    {
      title: "Fresh Produce & Grains",
      link: "/categories/agriculture",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      subcategories: [
        {
          name: "Avocados",
          image: "/hero/avocado.png",
          link: "/categories/agriculture?sub=avocados"
        },
        {
          name: "Coffee & Tea",
          image: "/products/mangoes.png",
          link: "/categories/agriculture?sub=coffee"
        },
        {
          name: "Beans & Grains",
          image: "/hero/Black beans.png",
          link: "/categories/agriculture?sub=grains"
        },
        {
          name: "Organic Produce",
          image: "/hero/ndengu.png",
          link: "/categories/agriculture?sub=organic"
        }
      ]
    },
    {
      title: "Fashion & Textiles",
      link: "/categories/fashion",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
      subcategories: [
        {
          name: "Ankara Fabrics",
          image: "/hero/Ankara fabric.png",
          link: "/categories/fashion?sub=fabrics"
        },
        {
          name: "Ankara Bags",
          image: "/hero/Ankara bags.png",
          link: "/categories/fashion?sub=bags"
        },
        {
          name: "Traditional Wear",
          image: "/products/ankara earings.png",
          link: "/categories/fashion?sub=traditional"
        },
        {
          name: "Accessories",
          image: "/products/African bracelets.png",
          link: "/categories/fashion?sub=accessories"
        }
      ]
    },
    {
      title: "Handcrafted Goods",
      link: "/categories/handcrafted",
      bgColor: "bg-gradient-to-br from-cyan-50 to-teal-50",
      subcategories: [
        {
          name: "Wall Art",
          image: "/hero/massai wall art.png",
          link: "/categories/handcrafted?sub=art"
        },
        {
          name: "Ankara Hats",
          image: "/hero/ankara bucket hats.png",
          link: "/categories/handcrafted?sub=hats"
        },
        {
          name: "Baskets & Bags",
          image: "/hero/Ankara bags.png",
          link: "/categories/handcrafted?sub=baskets"
        },
        {
          name: "Pottery",
          image: "/hero/massai wall art.png",
          link: "/categories/handcrafted?sub=pottery"
        }
      ]
    },
    {
      title: "Nyamazone Premium Meats",
      link: "/nyamazone",
      bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
      subcategories: [
        {
          name: "Grass-Fed Beef",
          image: "/products/goats.png",
          link: "/nyamazone?sub=beef"
        },
        {
          name: "Lamb",
          image: "/products/goats.png",
          link: "/nyamazone?sub=lamb"
        },
        {
          name: "Fresh Fish",
          image: "/products/mangoes in a farm.png",
          link: "/nyamazone?sub=fish"
        },
        {
          name: "Game Meat",
          image: "/products/avocados in the farm.png",
          link: "/nyamazone?sub=game"
        }
      ]
    },
    {
      title: "Beauty & Wellness",
      link: "/categories/beauty",
      bgColor: "bg-gradient-to-br from-pink-50 to-purple-50",
      subcategories: [
        {
          name: "Shea Butter",
          image: "/products/African bracelets.png",
          link: "/categories/beauty?sub=shea"
        },
        {
          name: "Essential Oils",
          image: "/hero/avocado.png",
          link: "/categories/beauty?sub=oils"
        },
        {
          name: "Natural Soaps",
          image: "/products/mangoes.png",
          link: "/categories/beauty?sub=soaps"
        },
        {
          name: "Skincare",
          image: "/hero/Ankara fabric.png",
          link: "/categories/beauty?sub=skincare"
        }
      ]
    },
    {
      title: "Home Decor & Living",
      link: "/categories/home",
      bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
      subcategories: [
        {
          name: "Wall Hangings",
          image: "/hero/massai wall art.png",
          link: "/categories/home?sub=wall"
        },
        {
          name: "Cushions & Throws",
          image: "/hero/Ankara fabric.png",
          link: "/categories/home?sub=cushions"
        },
        {
          name: "Tableware",
          image: "/hero/ankara bucket hats.png",
          link: "/categories/home?sub=tableware"
        },
        {
          name: "Decor Items",
          image: "/products/African bracelets.png",
          link: "/categories/home?sub=decor"
        }
      ]
    },
    {
      title: "Spices & Seasonings",
      link: "/categories/spices",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
      subcategories: [
        {
          name: "Berbere Spice",
          image: "/hero/Black beans.png",
          link: "/categories/spices?sub=berbere"
        },
        {
          name: "Harissa Paste",
          image: "/hero/ndengu.png",
          link: "/categories/spices?sub=harissa"
        },
        {
          name: "Ginger & Turmeric",
          image: "/hero/avocado.png",
          link: "/categories/spices?sub=roots"
        },
        {
          name: "Spice Blends",
          image: "/products/mangoes.png",
          link: "/categories/spices?sub=blends"
        }
      ]
    },
    {
      title: "Jewelry & Accessories",
      link: "/categories/jewelry",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50",
      subcategories: [
        {
          name: "African Bracelets",
          image: "/products/African bracelets.png",
          link: "/categories/jewelry?sub=bracelets"
        },
        {
          name: "Ankara Earrings",
          image: "/products/ankara earings.png",
          link: "/categories/jewelry?sub=earrings"
        },
        {
          name: "Beaded Necklaces",
          image: "/hero/Ankara bags.png",
          link: "/categories/jewelry?sub=necklaces"
        },
        {
          name: "Traditional Pieces",
          image: "/hero/massai wall art.png",
          link: "/categories/jewelry?sub=traditional"
        }
      ]
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid of Category Cards - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
          {categoryGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex} 
              className={`${group.bgColor} rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
            >
              {/* Card Title */}
              <div className="p-4 sm:p-5 pb-3">
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2 min-h-[3rem]">
                  {group.title}
                </h2>
                
                {/* 2x2 Grid of Subcategories */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {group.subcategories.map((subcat, subIndex) => (
                    <Link 
                      key={subIndex}
                      href={subcat.link}
                      className="group"
                    >
                      <div className="aspect-square relative bg-white rounded-md overflow-hidden mb-1.5 sm:mb-2 shadow-sm">
                        <Image
                          src={subcat.image}
                          alt={subcat.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 15vw"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-700 group-hover:text-soko-orange transition-colors line-clamp-1 font-medium">
                        {subcat.name}
                      </p>
                    </Link>
                  ))}
                </div>
                
                {/* See More Link */}
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

