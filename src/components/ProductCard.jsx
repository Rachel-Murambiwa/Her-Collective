import { useState } from 'react'

export default function ProductCard({ product, addToCart }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product, selectedColor, selectedSize)
    }
  }

  return (
    <div className={`group flex flex-col h-full ${!product.inStock ? 'opacity-75' : ''}`}>
      {/* Image Container with Sold Out Badge */}
      <div className="w-full overflow-hidden rounded-2xl bg-vanilla relative">
        <img
          src={product.image}
          alt={product.name}
          className={`h-[22rem] w-full object-cover object-center transition-transform duration-700 ease-in-out ${product.inStock ? 'group-hover:scale-105' : 'grayscale-[50%]'}`}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-oatmilk/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-espresso text-oatmilk px-6 py-2 rounded-full font-serif tracking-widest text-sm uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-5 flex-grow flex flex-col text-espresso">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium tracking-wide">{product.name}</h3>
            <p className="text-xs tracking-widest uppercase mt-1 text-espresso/50">{product.category}</p>
          </div>
          <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
        </div>

        {/* Hide dropdowns and change button if sold out */}
        <div className="mt-auto pt-6 space-y-3">
          {product.inStock ? (
            <>
              {product.colors?.length > 0 && (
                <select 
                  value={selectedColor} 
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full p-3 rounded-xl bg-vanilla/50 text-sm border border-transparent hover:border-espresso/10 focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all outline-none cursor-pointer"
                >
                  {product.colors.map(color => <option key={color} value={color}>{color}</option>)}
                </select>
              )}

              {product.sizes?.length > 0 && (
                <select 
                  value={selectedSize} 
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-3 rounded-xl bg-vanilla/50 text-sm border border-transparent hover:border-espresso/10 focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all outline-none cursor-pointer"
                >
                  {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              )}

              <button 
                onClick={handleAddToCart}
                className="w-full py-3.5 mt-2 rounded-xl bg-espresso text-oatmilk font-medium text-sm tracking-wide hover:bg-espresso/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                Add to Cart
              </button>
            </>
          ) : (
            <button 
              disabled
              className="w-full py-3.5 mt-2 rounded-xl bg-espresso/20 text-espresso/60 font-medium text-sm tracking-wide cursor-not-allowed"
            >
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  )
}