import { useState } from 'react'
import productsData from './data/products.json'
import ProductCard from './components/ProductCard'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCommunityOpen, setIsCommunityOpen] = useState(false)

  const [sortBy, setSortBy] = useState('A-Z')
  const [priceFilter, setPriceFilter] = useState('ALL')
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL')

  let processedProducts = productsData.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || 
                            product.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
                            (activeCategory === 'FRAGRANCES' && product.category.toLowerCase().includes('perfume')) ||
                            (activeCategory === 'BAGS' && product.category.toLowerCase().includes('bag')) ||
                            (activeCategory === 'BAGS' && product.category.toLowerCase().includes('tote'));
    const matchesAvailability = availabilityFilter === 'ALL' || (availabilityFilter === 'IN_STOCK' && product.inStock);
    const matchesPrice = priceFilter === 'ALL' || 
                         (priceFilter === 'UNDER_20' && product.price < 20) ||
                         (priceFilter === 'OVER_20' && product.price >= 20);
    return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
  })

  processedProducts.sort((a, b) => {
    if (sortBy === 'A-Z') return a.name.localeCompare(b.name);
    if (sortBy === 'Z-A') return b.name.localeCompare(a.name);
    if (sortBy === 'LOW-HIGH') return a.price - b.price;
    if (sortBy === 'HIGH-LOW') return b.price - a.price;
    return 0;
  });

  const addToCart = (product, color, size) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.color === color && item.size === size)
      if (existingItem) {
        return prevCart.map(item => item.id === product.id && item.color === color && item.size === size ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prevCart, { ...product, color, size, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId, color, size) => {
    setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.color === color && item.size === size)))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const phoneNumber = "233YOURNUMBERHERE"; 
    let message = "Hi HerCollective! 🤍 I would like to place an order:\n\n";
    cart.forEach((item) => {
      message += `▪️ ${item.quantity}x ${item.name}\n`;
      if (item.color || item.size) message += `   Details: ${item.color || ''} ${item.color && item.size ? '| ' : ''}${item.size || ''}\n`;
      message += `   Price: $${(item.price * item.quantity).toFixed(2)}\n\n`;
    });
    message += `*Grand Total: $${cartTotal.toFixed(2)}*\n\n`;
    message += "Please let me know how to proceed with payment! ✨";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  }

  const navLinks = ['BAGS', 'JEWELLERY', 'PHONE ACCESSORIES', 'HAIR ACCESSORIES'];

  return (
    <div className="min-h-screen pb-24 relative bg-oatmilk text-espresso font-sans">
      
      <header className="pt-6 pb-4 px-6 sticky top-0 bg-oatmilk/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <div className="w-1/3 flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:opacity-70 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            {isSearchOpen && (
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 bg-transparent border-b border-espresso/30 focus:border-espresso outline-none pb-1 text-sm transition-all"
              />
            )}
          </div>

          <div className="w-1/3 text-center">
            <h1 className="text-4xl font-serif tracking-tight cursor-pointer" onClick={() => setActiveCategory('ALL')}>
              HerCollective
            </h1>
          </div>

          <div className="w-1/3 flex justify-end items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsCommunityOpen(!isCommunityOpen)} 
                className="hover:opacity-70 transition-opacity flex items-center"
              >
                {/* NEW MINIMALIST ACCOUNT ICON */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>

              {isCommunityOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCommunityOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-72 bg-vanilla border border-espresso/10 shadow-2xl rounded-2xl p-6 z-50">
                    <h3 className="font-serif text-xl mb-2 text-espresso">The Girlies Circle 🤍</h3>
                    <p className="text-sm text-espresso/70 leading-relaxed mb-5">
                      Want to join the girlies circle and get early updates on restocks, secret sales, and promos?
                    </p>
                    <a 
                      href="https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 rounded-xl bg-espresso text-oatmilk font-medium text-sm tracking-wide hover:bg-espresso/90 hover:shadow-lg transition-all"
                    >
                      Join WhatsApp Group
                    </a>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className="hover:opacity-70 transition-opacity relative">
              {/* NEW MINIMALIST BAG ICON */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7V5a4 4 0 0 1 8 0v2"></path>
                <path d="M4 7l-1 14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2l-1-14H4z"></path>
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-espresso text-oatmilk text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto mt-8 hidden md:flex justify-center gap-10 text-xs font-bold tracking-[0.2em] uppercase">
          <button 
            onClick={() => setActiveCategory('ALL')}
            className={`hover:text-espresso transition-colors ${activeCategory === 'ALL' ? 'text-espresso border-b border-espresso pb-1' : 'text-espresso/40'}`}
          >
            ALL PRODUCTS
          </button>
          {navLinks.map(link => (
            <button 
              key={link}
              onClick={() => setActiveCategory(link)}
              className={`hover:text-espresso transition-colors ${activeCategory === link ? 'text-espresso border-b border-espresso pb-1' : 'text-espresso/40'}`}
            >
              {link}
            </button>
          ))}
        </nav>
      </header>

      <div className="w-full bg-vanilla/50 py-3 border-y border-espresso/5 flex justify-center items-center text-xs tracking-wide text-espresso/80 uppercase">
        <span className="mx-4 cursor-pointer">‹</span>
        Express delivery available on all orders at checkout
        <span className="mx-4 cursor-pointer">›</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 text-sm text-espresso/70 border-b border-espresso/10 pb-4">
          <div className="flex gap-6 items-center w-full sm:w-auto">
            <span className="font-medium text-espresso hidden sm:inline">Filter:</span>
            <div className="relative">
              <select 
                value={availabilityFilter} 
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="appearance-none bg-transparent hover:text-espresso cursor-pointer outline-none font-medium"
              >
                <option value="ALL">Availability ⌄</option>
                <option value="IN_STOCK">In Stock Only</option>
              </select>
            </div>
            <div className="relative">
              <select 
                value={priceFilter} 
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none bg-transparent hover:text-espresso cursor-pointer outline-none font-medium"
              >
                <option value="ALL">Price ⌄</option>
                <option value="UNDER_20">Under $20</option>
                <option value="OVER_20">$20 & Above</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between sm:justify-end gap-6 items-center w-full sm:w-auto">
            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-transparent hover:text-espresso cursor-pointer outline-none font-medium"
              >
                <option value="A-Z">Sort by: A-Z ⌄</option>
                <option value="Z-A">Sort by: Z-A</option>
                <option value="LOW-HIGH">Price: Low to High</option>
                <option value="HIGH-LOW">Price: High to Low</option>
              </select>
            </div>
            <span className="hidden sm:inline">{processedProducts.length} products</span>
          </div>
        </div>

        {/* --- THE FIX: Masonry Layout Grid --- */}
        {processedProducts.length === 0 ? (
          <p className="text-center text-espresso/60 mt-20 italic">No products found for this category or filter.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-8">
            {processedProducts.map((product) => (
              <div key={product.id} className="break-inside-avoid mb-16">
                <ProductCard product={product} addToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 bg-espresso/20 backdrop-blur-sm z-50 flex justify-end">
          <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
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
                    <img src={item.image || item.variants?.[0]?.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-vanilla" />
                    <div className="flex-grow text-espresso text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-espresso/60">{item.color && `${item.color} `}{item.color && item.size && '| '}{item.size && `${item.size}`}</p>
                      <p className="mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium mb-2">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeFromCart(item.id, item.color, item.size)} className="text-xs text-red-400 hover:text-red-600 underline">Remove</button>
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
              <button onClick={handleWhatsAppCheckout} disabled={cart.length === 0} className="w-full py-4 rounded-xl bg-espresso text-oatmilk font-medium hover:bg-espresso/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs">
                Checkout via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}