import { useState, useEffect } from 'react'

export default function ProductCard({ product, addToCart }) {
  const hasVariants = product.variants && product.variants.length > 0;
  
  const [activeVariant, setActiveVariant] = useState(hasVariants ? product.variants[0] : null);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');

  // State to hold the selected phone model
  const [selectedModel, setSelectedModel] = useState(
    hasVariants && product.variants[0].models ? product.variants[0].models[0].model : ''
  );

  // If the customer clicks a different design, reset the phone model list
  useEffect(() => {
    if (activeVariant?.models && activeVariant.models.length > 0) {
      const modelExists = activeVariant.models.some(m => m.model === selectedModel);
      if (!modelExists) {
        setSelectedModel(activeVariant.models[0].model);
      }
    } else {
      setSelectedModel('');
    }
  }, [activeVariant]);

  const displayImage = hasVariants ? activeVariant.image : product.image;
  
  // Cleanly handle cases where there is no color name
  let displayColorName = '';
  if (hasVariants && activeVariant.color) {
    displayColorName = activeVariant.style ? `${activeVariant.color} (${activeVariant.style})` : activeVariant.color;
  }

  const handleAddToCart = () => {
    if (product.inStock) {
      // Pass the phone model or regular size to the cart
      const finalSize = selectedModel || selectedSize;
      addToCart(product, displayColorName, finalSize);
    }
  }

  return (
    <div className={`group flex flex-col h-full ${!product.inStock ? 'opacity-75' : ''}`}>
      {/* Main Large Image Container */}
      <div className="w-full overflow-hidden rounded-2xl bg-vanilla relative">
        <img
          src={displayImage}
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
            <p className="text-xs tracking-widest uppercase mt-1 text-espresso/50">
              {product.category}
            </p>
          </div>
          <p className="text-lg font-medium">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-auto pt-4 space-y-5">
          
          {/* THE THUMBNAIL IMAGE SELECTORS */}
          {hasVariants && product.variants.length > 1 && (
            <div className="flex flex-col gap-2">
              {displayColorName && (
                <p className="text-sm font-bold text-espresso">
                  Color: <span className="font-normal text-espresso/80">{displayColorName}</span>
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveVariant(variant)}
                    className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all p-0.5 ${
                      activeVariant === variant 
                        ? 'border-espresso' 
                        : 'border-transparent hover:border-espresso/30'
                    }`}
                    aria-label={`Select option`}
                  >
                    <img 
                      src={variant.image} 
                      alt="option" 
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Device Model TABS */}
          {activeVariant?.models && activeVariant.models.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-espresso/70 uppercase tracking-wider pl-1">Device Model</p>
              <div className="flex flex-wrap gap-2">
                {activeVariant.models.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedModel(m.model)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      selectedModel === m.model
                        ? 'border-espresso bg-espresso text-oatmilk shadow-sm'
                        : 'border-espresso/20 text-espresso hover:border-espresso/50 bg-transparent'
                    }`}
                  >
                    {m.model}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NEW: Regular Size TABS */}
          {product.sizes?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-espresso/70 uppercase tracking-wider pl-1">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      selectedSize === size
                        ? 'border-espresso bg-espresso text-oatmilk shadow-sm'
                        : 'border-espresso/20 text-espresso hover:border-espresso/50 bg-transparent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
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