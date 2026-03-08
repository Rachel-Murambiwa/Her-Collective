import { useState } from 'react'
import productsData from './data/products.json'
import ProductCard from './components/ProductCard'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Filter products for the search bar
  const filteredProducts = productsData.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Add item to cart logic
  const addToCart = (product, color, size) => {
    setCart(prevCart => {
      // Check if this exact item/color/size is already in the cart
      const existingItem = prevCart.find(
        item => item.id === product.id && item.color === color && item.size === size
      )
      
      if (existingItem) {
        // If it is, just increase the quantity
        return prevCart.map(item =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // If it's new, add it to the cart array
      return [...prevCart, { ...product, color, size, quantity: 1 }]
    })
    setIsCartOpen(true) // Automatically slide the cart open when they add an item!
  }

  // Remove item from cart logic
  const removeFromCart = (productId, color, size) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === productId && item.color === color && item.size === size)
    ))
  }

  // Calculate the total price
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // --- NEW: WhatsApp Checkout Function ---
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    // 1. Your WhatsApp Number
    // Important: Use your full country code without the '+' or any spaces. 
    // Example: For Ghana, start it with 233.
    const phoneNumber = "263719096252"; 

    // 2. Build the aesthetic receipt
    let message = "Hi HerCollective! 🤍 I would like to place an order:\n\n";
    
    cart.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name}\n`;
      
      if (item.color || item.size) {
        message += `   Details: ${item.color || ''} ${item.color && item.size ? '| ' : ''}${item.size || ''}\n`;
      }
      message += `   Price: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Grand Total: $${cartTotal.toFixed(2)}*\n\n`;
    message += "Please let me know how to proceed with payment! ✨";

    // 3. Encode the text for a URL and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  }

  return (
    <div className="min-h-screen pb-24 relative">
      {/* Header & Search Section */}
      <header className="py-8 px-4 text-center sticky top-0 bg-oatmilk/90 backdrop-blur-md z-40 border-b border-espresso/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-left hidden md:block w-1/3"></div> {/* Spacer */}
          
          <div className="w-full md:w-1/3">
            <h1 className="text-4xl font-serif text-espresso mb-1">HerCollective</h1>
            <p className="text-xs text-espresso/70 tracking-wide mb-4 md:mb-0">everyday essentials for the girlies</p>
          </div>

          <div className="w-full md:w-1/3 flex flex-col sm:flex-row items-center justify-end gap-4">
             <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 rounded-full bg-vanilla text-sm border border-espresso/20 text-espresso focus:outline-none"
            />
            {/* Cart Toggle Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-2 rounded-full bg-espresso text-oatmilk text-sm font-medium whitespace-nowrap"
            >
              Cart ({cart.length})
            </button>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-espresso/60 mt-10">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Sliding Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-espresso/20 backdrop-blur-sm z-50 flex justify-end">
          {/* Click background to close */}
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
          
          {/* Cart Drawer */}
          <div className="w-full max-w-md bg-oatmilk h-full shadow-2xl relative flex flex-col animate-slide-in">
            <div className="p-6 border-b border-espresso/10 flex justify-between items-center">
              <h2 className="text-2xl font-serif text-espresso">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-espresso/60 hover:text-espresso text-xl">✕</button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <p className="text-center text-espresso/50 mt-10 italic">Your cart is empty, gorgeous.</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-vanilla" />
                    <div className="flex-grow text-espresso text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-espresso/60">
                        {item.color && `${item.color} `}{item.color && item.size && '| '}{item.size && `${item.size}`}
                      </p>
                      <p className="mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                      <button 
                        onClick={() => removeFromCart(item.id, item.color, item.size)}
                        className="text-xs text-red-400 hover:text-red-600 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-espresso/10 bg-vanilla/50">
              <div className="flex justify-between items-center mb-6 text-espresso text-lg font-medium">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              
              {/* UPDATED BUTTON HERE */}
              <button 
                onClick={handleWhatsAppCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 rounded-xl bg-espresso text-oatmilk font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}