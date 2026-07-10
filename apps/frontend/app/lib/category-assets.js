/**
 * Local category holder images (served from /public/categories).
 * Product-specific images still come from the backend API.
 */
export const DEFAULT_CATEGORY_IMAGE = '/categories/beauty.png';

/** @type {Record<string, string>} */
const CATEGORY_IMAGES = {
  // Fresh Produce & Grains
  agriculture: '/hero/avocado.png',
  avocados: '/products/avocados%20in%20the%20farm.png',
  coffee: '/categories/coffee.png',
  tea: '/categories/tea.png',
  pears: '/categories/pears.png',
  plums: '/categories/plums.png',
  macadamia: '/categories/macadamia.png',
  'coffee-tea': '/categories/coffee-tea.png',
  'beans-grains': '/hero/Black%20beans.png',
  'organic-produce': '/products/mangoes%20in%20a%20farm.png',

  // Fashion & Textiles
  fashion: '/hero/Ankara%20fabric.png',
  'ankara-fabrics': '/hero/Ankara%20fabric.png',
  'ankara-bags': '/hero/Ankara%20bags.png',
  'traditional-wear': '/categories/traditional-wear.png',
  'fashion-accessories': '/products/ankara%20earings.png',

  // Handcrafted
  handcrafted: '/hero/massai%20wall%20art.png',
  'wall-art': '/hero/massai%20wall%20art.png',
  'ankara-hats': '/hero/ankara%20bucket%20hats.png',
  baskets: '/categories/baskets.png',
  pottery: '/categories/pottery.png',

  // Nyamazone Meats
  nyamazone: '/categories/beef.png',
  beef: '/categories/beef.png',
  lamb: '/categories/lamb.png',
  fish: '/categories/fish.png',
  'game-meat': '/categories/game-meat.png',

  // Beauty & Wellness
  beauty: '/categories/beauty.png',
  'shea-butter': '/categories/shea-butter.png',
  'essential-oils': '/categories/essential-oils.png',
  'natural-soaps': '/categories/natural-soaps.png',
  skincare: '/categories/skincare.png',

  // Home Decor & Living
  home: '/categories/wall-hangings.png',
  'wall-hangings': '/categories/wall-hangings.png',
  'cushions-throws': '/categories/cushions-throws.png',
  tableware: '/categories/tableware.png',
  'decor-items': '/categories/decor-items.png',

  // Spices & Seasonings
  spices: '/categories/spices.png',
  berbere: '/categories/berbere.png',
  harissa: '/categories/harissa.png',
  'ginger-turmeric': '/categories/ginger-turmeric.png',
  'spice-blends': '/categories/spice-blends.png',

  // Jewelry & Accessories
  jewelry: '/categories/traditional-jewelry.png',
  bracelets: '/products/African%20bracelets.png',
  earrings: '/products/ankara%20earings.png',
  necklaces: '/categories/necklaces.png',
  'traditional-jewelry': '/categories/traditional-jewelry.png',
};

/**
 * @param {string | undefined | null} slug
 * @returns {string}
 */
export function getCategoryImage(slug) {
  if (!slug) return DEFAULT_CATEGORY_IMAGE;
  return CATEGORY_IMAGES[slug] ?? DEFAULT_CATEGORY_IMAGE;
}
