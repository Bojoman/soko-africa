import Image from "next/image"

const products = [
  { id: 1, name: "Handmade Maasai Beaded Necklace", price: 2500, image: "/images/necklace.jpg" },
  { id: 2, name: "African Print Ankara Dress", price: 5500, image: "/images/ankara-dress.jpg" },
  { id: 3, name: "Leather Safari Bag", price: 7200, image: "/images/safari-bag.jpg" },
]

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Shop Our Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full h-64"
            />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-gray-700 mb-3">KES {product.price.toLocaleString()}</p>
              <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
