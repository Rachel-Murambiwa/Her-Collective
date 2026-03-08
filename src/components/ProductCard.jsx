import { useState } from 'react'

// Notice we added 'addToCart' as a prop here!
export default function ProductCard({ product, addToCart }) {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '')
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')

  const handleAddToCart = () => {
    // Send the item to the main App
    addToCart(product, selectedColor, selectedSize)
  }

  return (
    <div className="group flex flex-col">
      <div className="w-full overflow-hidden rounded-xl bg-vanilla relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-80 w-full object-cover object-center transition-opacity duration-300 group-hover:opacity-90"
        />
      </div>
      
      <div className="mt-4 flex-grow flex flex-col text-espresso">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-medium">{product.name}</h3>
            <p className="text-sm text-espresso/60">{product.category}</p>
          </div>
          <p className="text-base font-medium">${product.price.toFixed(2)}</p>
        </div>

        <div className="mt-auto pt-4 space-y-3">
          {product.colors?.length > 0 && (
            <select 
              value={selectedColor} 
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full p-2 rounded-lg bg-vanilla text-sm border border-espresso/20 focus:outline-none"
            >
              {product.colors.map(color => <option key={color} value={color}>{color}</option>)}
            </select>
          )}

          {product.sizes?.length > 0 && (
            <select 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 rounded-lg bg-vanilla text-sm border border-espresso/20 focus:outline-none"
            >
              {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          )}

          <button 
            onClick={handleAddToCart}
            className="w-full py-3 rounded-xl bg-espresso text-oatmilk font-medium text-sm hover:bg-espresso/90 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}