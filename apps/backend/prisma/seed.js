import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from './generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const SALT = 12;

function slugify(name, suffix = '') {
  const base = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'item'}${suffix ? `-${suffix}` : ''}`;
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required for seed');
  }

  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  const passwordHash = bcrypt.hashSync('Seller123!@', SALT);

  await prisma.productTag.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.sellerProfile.deleteMany({
    where: { user: { email: { startsWith: 'seed.' } } }
  });
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany({ where: { parentId: { not: null } } });
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({ where: { email: { startsWith: 'seed.' } } });

  const userAdmin = await prisma.user.create({
    data: {
      email: 'seed.admin@soko-africa.test',
      passwordHash,
      role: 'ADMIN',
      firstName: 'Amina',
      lastName: 'Admin'
    }
  });

  const userFarmer = await prisma.user.create({
    data: {
      email: 'seed.farmer@soko-africa.test',
      passwordHash,
      role: 'SELLER',
      firstName: 'Wanjiku',
      lastName: 'Mwangi'
    }
  });

  const userCraft = await prisma.user.create({
    data: {
      email: 'seed.craft@soko-africa.test',
      passwordHash,
      role: 'SELLER',
      firstName: 'Ole',
      lastName: 'Lemayian'
    }
  });

  async function mkCategory(data) {
    return prisma.category.create({ data });
  }

  const ag = await mkCategory({
    name: 'Fresh Produce & Grains',
    slug: 'agriculture',
    position: 0,
    iconKey: 'leaf'
  });
  const fa = await mkCategory({
    name: 'Fashion & Textiles',
    slug: 'fashion',
    position: 1,
    iconKey: 'shirt'
  });
  const hc = await mkCategory({
    name: 'Handcrafted Goods',
    slug: 'handcrafted',
    position: 2,
    iconKey: 'palette'
  });
  const ny = await mkCategory({
    name: 'Nyamazone Premium Meats',
    slug: 'nyamazone',
    position: 3,
    iconKey: 'beef'
  });
  const be = await mkCategory({
    name: 'Beauty & Wellness',
    slug: 'beauty',
    position: 4,
    iconKey: 'sparkles'
  });
  const ho = await mkCategory({
    name: 'Home Decor & Living',
    slug: 'home',
    position: 5,
    iconKey: 'home'
  });
  const sp = await mkCategory({
    name: 'Spices & Seasonings',
    slug: 'spices',
    position: 6,
    iconKey: 'flame'
  });
  const je = await mkCategory({
    name: 'Jewelry & Accessories',
    slug: 'jewelry',
    position: 7,
    iconKey: 'gem'
  });

  const sub = async (parent, name, slug, pos, seasonal = false) =>
    mkCategory({
      name,
      slug,
      parentId: parent.id,
      position: pos,
      isSeasonal: seasonal
    });

  await sub(ag, 'Avocados', 'avocados', 0, true);
  await sub(ag, 'Coffee', 'coffee', 1, true);
  await sub(ag, 'Tea', 'tea', 2, true);
  await sub(ag, 'Pears', 'pears', 3, true);
  await sub(ag, 'Plums', 'plums', 4, true);
  await sub(ag, 'Macadamia', 'macadamia', 5, true);
  await sub(ag, 'Beans & Grains', 'beans-grains', 6);
  await sub(ag, 'Organic Produce', 'organic-produce', 7);

  await sub(fa, 'Ankara Fabrics', 'ankara-fabrics', 0);
  await sub(fa, 'Ankara Bags', 'ankara-bags', 1);
  await sub(fa, 'Traditional Wear', 'traditional-wear', 2);
  await sub(fa, 'Fashion Accessories', 'fashion-accessories', 3);

  await sub(hc, 'Wall Art', 'wall-art', 0);
  await sub(hc, 'Ankara Hats', 'ankara-hats', 1);
  await sub(hc, 'Baskets', 'baskets', 2);
  await sub(hc, 'Pottery', 'pottery', 3);

  await sub(ny, 'Grass-Fed Beef', 'beef', 0);
  await sub(ny, 'Lamb', 'lamb', 1);
  await sub(ny, 'Fresh Fish', 'fish', 2);
  await sub(ny, 'Game Meat', 'game-meat', 3);

  await sub(be, 'Shea Butter', 'shea-butter', 0);
  await sub(be, 'Essential Oils', 'essential-oils', 1);
  await sub(be, 'Natural Soaps', 'natural-soaps', 2);
  await sub(be, 'Skincare', 'skincare', 3);

  await sub(ho, 'Wall Hangings', 'wall-hangings', 0);
  await sub(ho, 'Cushions & Throws', 'cushions-throws', 1);
  await sub(ho, 'Tableware', 'tableware', 2);
  await sub(ho, 'Decor Items', 'decor-items', 3);

  await sub(sp, 'Berbere Spice', 'berbere', 0);
  await sub(sp, 'Harissa', 'harissa', 1);
  await sub(sp, 'Ginger & Turmeric', 'ginger-turmeric', 2);
  await sub(sp, 'Spice Blends', 'spice-blends', 3);

  await sub(je, 'Bracelets', 'bracelets', 0);
  await sub(je, 'Earrings', 'earrings', 1);
  await sub(je, 'Necklaces', 'necklaces', 2);
  await sub(je, 'Traditional Jewelry', 'traditional-jewelry', 3);

  const tagNames = [
    ['Organic', 'organic'],
    ['Handmade', 'handmade'],
    ['Fair Trade', 'fair-trade'],
    ['Bestseller', 'bestseller'],
    ['New', 'new-arrival'],
    ['Premium', 'premium'],
    ['Seasonal', 'seasonal']
  ];
  for (const [name, slug] of tagNames) {
    await prisma.tag.create({ data: { name, slug } });
  }

  const sellerFarm = await prisma.sellerProfile.create({
    data: {
      userId: userFarmer.id,
      slug: 'highland-harvest-co',
      shopName: 'Highland Harvest Co.',
      bio: 'Family-run farm in the Kenyan highlands.',
      location: 'Nyeri, Kenya',
      phoneNumber: '+254700000001',
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
      featuredImageUrl:
        'https://images.unsplash.com/photo-1500937386664-c56f173683a9?w=1200&q=80'
    }
  });

  await prisma.farmerProfile.create({
    data: {
      sellerProfileId: sellerFarm.id,
      cooperativeName: 'Central Farmers Co-op',
      farmingNotes: 'Rain-fed, regenerative practices.'
    }
  });

  const sellerCraft = await prisma.sellerProfile.create({
    data: {
      userId: userCraft.id,
      slug: 'maasai-makers-studio',
      shopName: 'Maasai Makers Studio',
      bio: 'Artisan collective specializing in beadwork and textiles.',
      location: 'Kajiado, Kenya',
      phoneNumber: '+254700000002',
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
      featuredImageUrl:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80'
    }
  });

  // Product images are served by the backend as generated media endpoints.
  // The frontend proxies /api/* to the backend, so these paths resolve as-is.
  const productImg = (filename) => `/api/products/media/${filename}`;

  const catalog = [
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Kenyan AA Coffee Beans',
      slug: 'kenyan-aa-coffee-beans',
      categorySlug: 'coffee',
      price: 24.99,
      tags: ['organic', 'bestseller', 'seasonal'],
      images: [productImg('kenyan-aa-coffee-beans.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Highland Black Tea 250g',
      slug: 'highland-black-tea-250g',
      categorySlug: 'tea',
      price: 14.5,
      tags: ['organic', 'bestseller', 'seasonal'],
      images: [productImg('highland-black-tea-250g.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Sweet African Pears (1kg)',
      slug: 'african-pears-1kg',
      categorySlug: 'pears',
      price: 7.25,
      cold: true,
      tags: ['organic', 'seasonal'],
      images: [productImg('african-pears-1kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Highland Plums (1kg)',
      slug: 'highland-plums-1kg',
      categorySlug: 'plums',
      price: 6.5,
      cold: true,
      tags: ['organic', 'seasonal', 'new-arrival'],
      images: [productImg('highland-plums-1kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Roasted Macadamia Nuts 500g',
      slug: 'macadamia-nuts-500g',
      categorySlug: 'macadamia',
      price: 19.99,
      tags: ['organic', 'premium', 'seasonal'],
      images: [productImg('macadamia-nuts-500g.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Hass Avocados (1kg)',
      slug: 'hass-avocados-1kg',
      categorySlug: 'avocados',
      price: 8.5,
      cold: true,
      tags: ['seasonal', 'organic'],
      images: [productImg('hass-avocados-1kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Black Beans 2kg',
      slug: 'black-beans-2kg',
      categorySlug: 'beans-grains',
      price: 11.0,
      tags: ['organic'],
      images: [productImg('black-beans-2kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Ndengu (Green Grams) 1kg',
      slug: 'ndengu-1kg',
      categorySlug: 'beans-grains',
      price: 6.25,
      tags: ['organic'],
      images: [productImg('ndengu-1kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Organic Kale Bunch',
      slug: 'organic-kale-bunch',
      categorySlug: 'organic-produce',
      price: 3.99,
      tags: ['organic', 'seasonal'],
      images: [productImg('organic-kale-bunch.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Ankara Fabric Roll (6 yards)',
      slug: 'ankara-fabric-roll-6yd',
      categorySlug: 'ankara-fabrics',
      price: 45.0,
      tags: ['handmade', 'fair-trade'],
      images: [productImg('ankara-fabric-roll-6yd.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Ankara Tote Bag',
      slug: 'ankara-tote-bag',
      categorySlug: 'ankara-bags',
      price: 32.0,
      tags: ['handmade', 'new-arrival'],
      images: [productImg('ankara-tote-bag.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Kente Scarf',
      slug: 'kente-scarf',
      categorySlug: 'traditional-wear',
      price: 38.5,
      tags: ['handmade', 'premium'],
      images: [productImg('kente-scarf.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Beaded Leather Cuff',
      slug: 'beaded-leather-cuff',
      categorySlug: 'fashion-accessories',
      price: 22.0,
      tags: ['handmade'],
      images: [productImg('beaded-leather-cuff.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Maasai Wall Art Panel',
      slug: 'maasai-wall-art-panel',
      categorySlug: 'wall-art',
      price: 120.0,
      tags: ['handmade', 'premium'],
      images: [productImg('maasai-wall-art-panel.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Ankara Bucket Hat',
      slug: 'ankara-bucket-hat',
      categorySlug: 'ankara-hats',
      price: 26.0,
      tags: ['new-arrival'],
      images: [productImg('ankara-bucket-hat.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Woven Sisal Basket',
      slug: 'woven-sisal-basket',
      categorySlug: 'baskets',
      price: 42.0,
      tags: ['handmade', 'fair-trade'],
      images: [productImg('woven-sisal-basket.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Hand-thrown Clay Bowl',
      slug: 'hand-thrown-clay-bowl',
      categorySlug: 'pottery',
      price: 28.0,
      tags: ['handmade'],
      images: [productImg('hand-thrown-clay-bowl.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Nyama Choma Beef Cuts 1kg',
      slug: 'nyama-choma-beef-1kg',
      categorySlug: 'beef',
      price: 18.99,
      cold: true,
      tags: ['premium', 'organic'],
      images: [productImg('nyama-choma-beef-1kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Lamb Shoulder 1kg',
      slug: 'lamb-shoulder-1kg',
      categorySlug: 'lamb',
      price: 22.5,
      cold: true,
      tags: ['premium'],
      images: [productImg('lamb-shoulder-1kg.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Lake Victoria Tilapia Fillet',
      slug: 'tilapia-fillet-500g',
      categorySlug: 'fish',
      price: 14.0,
      cold: true,
      tags: ['seasonal'],
      images: [productImg('tilapia-fillet-500g.png')]
    },
    {
      sellerId: sellerFarm.id,
      ownerId: userFarmer.id,
      name: 'Ostrich Steak 500g',
      slug: 'ostrich-steak-500g',
      categorySlug: 'game-meat',
      price: 35.0,
      cold: true,
      tags: ['premium'],
      images: [productImg('ostrich-steak-500g.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Raw Shea Butter 250g',
      slug: 'raw-shea-butter-250g',
      categorySlug: 'shea-butter',
      price: 16.0,
      tags: ['organic', 'fair-trade'],
      images: [productImg('raw-shea-butter-250g.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Baobab Oil 100ml',
      slug: 'baobab-oil-100ml',
      categorySlug: 'essential-oils',
      price: 19.5,
      tags: ['organic', 'premium'],
      images: [productImg('baobab-oil-100ml.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Moringa Soap Bar',
      slug: 'moringa-soap-bar',
      categorySlug: 'natural-soaps',
      price: 7.5,
      tags: ['organic', 'handmade'],
      images: [productImg('moringa-soap-bar.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Marula Face Serum',
      slug: 'marula-face-serum',
      categorySlug: 'skincare',
      price: 29.99,
      tags: ['premium', 'organic'],
      images: [productImg('marula-face-serum.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Woven Wall Hanging',
      slug: 'woven-wall-hanging',
      categorySlug: 'wall-hangings',
      price: 55.0,
      tags: ['handmade'],
      images: [productImg('woven-wall-hanging.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Ankara Cushion Covers (pair)',
      slug: 'ankara-cushion-covers-pair',
      categorySlug: 'cushions-throws',
      price: 34.0,
      tags: ['handmade', 'new-arrival'],
      images: [productImg('ankara-cushion-covers-pair.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Soapstone Serving Board',
      slug: 'soapstone-serving-board',
      categorySlug: 'tableware',
      price: 48.0,
      tags: ['handmade', 'premium'],
      images: [productImg('soapstone-serving-board.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Berbere Spice Blend 200g',
      slug: 'berbere-spice-blend-200g',
      categorySlug: 'berbere',
      price: 12.0,
      tags: ['organic', 'bestseller'],
      images: [productImg('berbere-spice-blend-200g.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Harissa Paste Jar',
      slug: 'harissa-paste-jar',
      categorySlug: 'harissa',
      price: 9.5,
      tags: ['organic'],
      images: [productImg('harissa-paste-jar.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Brass Cuff Bracelet',
      slug: 'brass-cuff-bracelet',
      categorySlug: 'bracelets',
      price: 24.0,
      tags: ['handmade', 'fair-trade'],
      images: [productImg('brass-cuff-bracelet.png')]
    },
    {
      sellerId: sellerCraft.id,
      ownerId: userCraft.id,
      name: 'Beaded Drop Earrings',
      slug: 'beaded-drop-earrings',
      categorySlug: 'earrings',
      price: 18.0,
      tags: ['handmade', 'new-arrival'],
      images: [productImg('beaded-drop-earrings.png')]
    }
  ];

  for (const row of catalog) {
    const cat = await prisma.category.findUnique({
      where: { slug: row.categorySlug }
    });
    if (!cat) {
      throw new Error(`Missing category ${row.categorySlug}`);
    }

    const tags = await prisma.tag.findMany({
      where: { slug: { in: row.tags || [] } }
    });

    await prisma.product.create({
      data: {
        name: row.name,
        slug: row.slug,
        description: `${row.name} — authentic Soko Africa listing.`,
        price: row.price,
        currency: 'USD',
        category: cat.name,
        requiresColdChain: Boolean(row.cold),
        status: 'PUBLISHED',
        sellerId: row.sellerId,
        ownerId: row.ownerId,
        images: {
          create: (row.images || []).map((url, i) => ({
            url,
            alt: row.name,
            position: i
          }))
        },
        categories: {
          create: [{ categoryId: cat.id, isPrimary: true }]
        },
        tags: {
          create: tags.map((t) => ({ tagId: t.id }))
        },
        variants: {
          create: [{ sku: 'DEFAULT', stock: 999 }]
        }
      }
    });
  }

  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    create: {
      code: 'WELCOME10',
      scope: 'CART',
      percentOff: 10,
      maxRedemptions: 1000
    },
    update: {}
  });

  await prisma.coupon.upsert({
    where: { code: 'SOKO10' },
    create: {
      code: 'SOKO10',
      scope: 'CART',
      percentOff: 10,
      maxRedemptions: 5000
    },
    update: {}
  });

  await prisma.coupon.upsert({
    where: { code: 'WELCOME15' },
    create: {
      code: 'WELCOME15',
      scope: 'CART',
      percentOff: 15,
      maxRedemptions: 5000
    },
    update: {}
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    create: {
      code: 'FREESHIP',
      scope: 'CART',
      maxRedemptions: 10000
    },
    update: {}
  });

  await prisma.$disconnect();
  console.log('Seed completed: categories, tags, admin + 2 sellers, farmer extension,', catalog.length, 'products');
  console.log('Admin login: seed.admin@soko-africa.test / Seller123!@');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
