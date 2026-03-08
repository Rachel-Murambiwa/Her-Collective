import { useState } from 'react'

export default function ProductCard({ product, addToCart }) {
  // Check if this product uses the visual variants
  const hasVariants = product.variants && product.variants.length > 0;
  
  // State for the visual swatches and sizes
  const [activeVariant, setActiveVariant] = useState(hasVariants ? product.variants[0] : null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

  // If it has variants, show that specific image. Otherwise, use defaults.
  const displayImage = hasVariants ? activeVariant.image : product.image;
  const displayColorName = hasVariants ? activeVariant.color : '';

  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product, displayColorName, selectedSize);
    }
  }

  return (
    <div className={`group flex flex-col h-full ${!product.inStock ? 'opacity-75' : ''}`}>
      {/* Main Large Image Container */}
      <div className="w-full overflow-hidden rounded-2xl bg-vanilla relative">
        <img
          src={displayImage}
          alt={`${product.name} in ${displayColorName}`}
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
            <p className="text-xs tracking-widest uppercase mt-1 text-espresso/50">
              {product.category}
            </p>
          </div>
          <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-auto pt-4 space-y-5">
          
          {/* THE NEW THUMBNAIL IMAGE SELECTORS */}
          {hasVariants && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-espresso">
                Color: <span className="font-normal text-espresso/80">{activeVariant.color}</span>
              </p>
              
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setActiveVariant(variant)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all p-0.5 ${
                      activeVariant.color === variant.color 
                        ? 'border-espresso' 
                        : 'border-transparent hover:border-espresso/30'
                    }`}
                    aria-label={`Select ${variant.color}`}
                  >
                    <img 
                      src={variant.image} 
                      alt={variant.color} 
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Dropdown (Only shows if the product has sizes) */}
          {product.sizes?.length > 0 && (
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-3 rounded-xl bg-vanilla/50 text-sm border border-transparent hover:border-espresso/10 focus:border-blush focus:ring-2 focus:ring-blush/20 transition-all outline-none cursor-pointer"
            >
              {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          )}

          {/* Add to Cart Button */}
          {product.inStock ? (
            <button 
              onClick={handleAddToCart}
              className="w-full py-3.5 mt-2 rounded-xl bg-espresso text-oatmilk font-medium text-sm tracking-wide hover:bg-espresso/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95 uppercase"
            >
              Add to Cart
            </button>
          ) : (
            <button 
              disabled
              className="w-full py-3.5 mt-2 rounded-xl bg-espresso/20 text-espresso/60 font-medium text-sm tracking-wide cursor-not-allowed uppercase"
            >
              Currently Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  )
}