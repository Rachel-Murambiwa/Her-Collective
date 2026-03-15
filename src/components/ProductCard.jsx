import { useState } from 'react';

export default function ProductCard({ product, addToCart }) {
  // 1. Setup states for selected options
  const [selectedColor, setSelectedColor] = useState(product.variants?.[0]?.color || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || product.models?.[0]?.model || '');

  // 2. Find the active variant based on the color the user clicked
  const activeVariant = product.variants?.find(v => v.color === selectedColor);

  // 3. Get the correct image to display
  const displayImage = activeVariant?.image || product.image;

  // 4. THE FIX: Check if THIS specific variant is in stock!
  // It checks for 'instock' or 'inStock' just in case of typos.
  let isAvailable = true;
  if (activeVariant && (activeVariant.instock !== undefined || activeVariant.inStock !== undefined)) {
    isAvailable = activeVariant.instock ?? activeVariant.inStock;
  } else {
    isAvailable = product.inStock ?? true;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Product Image with dynamic Sold Out overlay */}
      <div className="relative group overflow-hidden rounded-2xl bg-vanilla aspect-[4/5]">
        <img 
          src={displayImage} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${!isAvailable ? 'opacity-60 grayscale' : ''}`}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-espresso text-oatmilk text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-lg text-espresso">{product.name}</h3>
          <span className="text-sm font-medium text-espresso/80">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-xs text-espresso/50 uppercase tracking-wider mb-3">{product.category}</p>

        {/* Color Swatches */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <p className="text-[10px] font-bold tracking-wider uppercase text-espresso mb-2">
              Color: <span className="text-espresso/60 font-normal">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                 // Dim the swatch slightly if that specific color is sold out
                 const isVariantInStock = variant.instock ?? variant.inStock ?? true;
                 return (
                  <button 
                    key={variant.color}
                    onClick={() => setSelectedColor(variant.color)}
                    className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${selectedColor === variant.color ? 'border-espresso scale-110' : 'border-transparent'} ${!isVariantInStock ? 'opacity-40' : ''}`}
                    title={!isVariantInStock ? `${variant.color} (Sold Out)` : variant.color}
                  >
                    <img src={variant.image} alt={variant.color} className="w-full h-full object-cover" />
                  </button>
                 )
              })}
            </div>
          </div>
        )}

        {/* Size / Model Options */}
        {(product.sizes || product.models) && (
          <div className="mb-4">
            <p className="text-[10px] font-bold tracking-wider uppercase text-espresso mb-2">
              {product.sizeLabel || (product.models ? 'Model' : 'Size')}
            </p>
            <div className="relative">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full appearance-none bg-transparent border-b border-espresso/30 pb-2 text-sm text-espresso outline-none focus:border-espresso cursor-pointer"
              >
                {(product.sizes || product.models.map(m => m.model)).map((sizeOption) => (
                  <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Dynamic Add to Cart Button */}
        <button 
          onClick={() => addToCart(product, selectedColor, selectedSize)}
          disabled={!isAvailable}
          className="w-full py-3 mt-4 rounded-xl bg-espresso text-oatmilk font-medium text-xs tracking-widest uppercase hover:bg-espresso/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAvailable ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}