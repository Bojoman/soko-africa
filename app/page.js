import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <main className="max-w-[1500px] mx-auto px-4 py-8">
      {/* HERO SECTION */}
      <section className="relative h-[500px] rounded-lg overflow-hidden shadow-lg">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
          <Image
            src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1080&auto=format&fit=crop"
            alt="Farm produce"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1582582424095-8c5b6a1c4f10?q=80&w=1080&auto=format&fit=crop"
            alt="Handcrafted goods"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1520975698519-59f9a9e2c26e?q=80&w=1080&auto=format&fit=crop"
            alt="African textiles"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
          <Image
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1080&auto=format&fit=crop"
            alt="Nyamazone meats"
            width={500}
            height={500}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold">
            Africa’s Finest Goods. Delivered Globally
          </h1>
          <p className="text-white text-lg mt-3 max-w-2xl">
            Trusted sourcing. Certified quality. Direct from Africa.
          </p>
          <div className="mt-6 flex w-full max-w-lg">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-r-lg font-semibold">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Farm Produce", img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1080&auto=format&fit=crop" },
            { name: "Handcrafted Goods", img: "https://images.unsplash.com/photo-1582582424095-8c5b6a1c4f10?q=80&w=1080&auto=format&fit=crop" },
            { name: "Textiles", img: "https://images.unsplash.com/photo-1520975698519-59f9a9e2c26e?q=80&w=1080&auto=format&fit=crop" },
            { name: "Nyamazone Meats", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1080&auto=format&fit=crop" },
          ].map(cat => (
            <div key={cat.name} className="group cursor-pointer">
              <img src={cat.img} alt={cat.name} className="w-full h-48 object-cover rounded-lg group-hover:opacity-80 transition" />
              <h3 className="mt-2 text-lg font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Beaded Necklace", price: 2500, img: "https://images.unsplash.com/photo-1582582424095-8c5b6a1c4f10?q=80&w=1080&auto=format&fit=crop" },
            { name: "Ankara Dress", price: 5500, img: "https://images.unsplash.com/photo-1520975698519-59f9a9e2c26e?q=80&w=1080&auto=format&fit=crop" },
            { name: "Safari Bag", price: 7200, img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1080&auto=format&fit=crop" },
            { name: "Organic Coffee", price: 1800, img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1080&auto=format&fit=crop" },
          ].map(prod => (
            <div key={prod.name} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
              <img src={prod.img} alt={prod.name} className="w-full h-48 object-cover rounded-lg" />
              <h3 className="mt-2 font-semibold">{prod.name}</h3>
              <p className="text-gray-700">KES {prod.price.toLocaleString()}</p>
              <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {[
          { title: "Free Delivery Worldwide", icon: "🚚" },
          { title: "Secure Payments", icon: "🔒" },
          { title: "Direct from Africa", icon: "🌍" },
        ].map(badge => (
          <div key={badge.title} className="bg-gray-100 p-6 rounded-lg shadow-sm">
            <div className="text-4xl">{badge.icon}</div>
            <h4 className="mt-3 font-semibold">{badge.title}</h4>
          </div>
        ))}
      </section>
    </main>
  )
}
