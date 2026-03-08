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

  // NEW: States for Sorting and Filtering
  const [sortBy, setSortBy] = useState('A-Z')
  const [priceFilter, setPriceFilter] = useState('ALL')
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL')

  // Filter products by Search, Category, Availability, and Price
  let processedProducts = productsData.filter((product) => {
    // 1. Search Filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 2. Category Filter
    const matchesCategory = activeCategory === 'ALL' || 
                            product.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
                            (activeCategory === 'FRAGRANCES' && product.category.toLowerCase().includes('perfume')) ||
                            (activeCategory === 'BAGS' && product.category.toLowerCase().includes('bag')) ||
                            (activeCategory === 'BAGS' && product.category.toLowerCase().includes('tote'));
    
    // 3. Availability Filter
    const matchesAvailability = availabilityFilter === 'ALL' || (availabilityFilter === 'IN_STOCK' && product.inStock);

    // 4. Price Filter
    const matchesPrice = priceFilter === 'ALL' || 
                         (priceFilter === 'UNDER_20' && product.price < 20) ||
                         (priceFilter === 'OVER_20' && product.price >= 20);
    
    return matchesSearch && matchesCategory && matchesAvailability && matchesPrice;
  })

  // Sort the filtered products
  processedProducts.sort((a, b) => {
    if (sortBy === 'A-Z') return a.name.localeCompare(b.name);
    if (sortBy === 'Z-A') return b.name.localeCompare(a.name);
    if (sortBy === 'LOW-HIGH') return a.price - b.price;
    if (sortBy === 'HIGH-LOW') return b.price - a.price;
    return 0;
  });

  // Cart Logic
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
    const phoneNumber = "233YOURNUMBERHERE"; // REMEMBER TO ADD YOUR NUMBER HERE
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

  // Navigation Links
  const navLinks = ['BAGS', 'FRAGRANCES', 'JEWELLERY', 'ACCESSORIES'];

  return (
    <div className="min-h-screen pb-24 relative bg-oatmilk text-espresso font-sans">
      
      {/* --- TIER 1: Main Header (Icons & Logo) --- */}
      <header className="pt-6 pb-4 px-6 sticky top-0 bg-oatmilk/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Left: Search */}
          <div className="w-1/3 flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="hover:opacity-70 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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

          {/* Center: Logo */}
          <div className="w-1/3 text-center">
            <h1 className="text-4xl font-serif tracking-tight cursor-pointer" onClick={() => setActiveCategory('ALL')}>
              HerCollective
            </h1>
          </div>

          {/* Right: Account & Cart Icons */}
          <div className="w-1/3 flex justify-end items-center gap-6">
            
            {/* The Girlies Circle Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsCommunityOpen(!isCommunityOpen)} 
                className="hover:opacity-70 transition-opacity flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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

            {/* Cart Toggle Button */}
            <button onClick={() => setIsCartOpen(true)} className="hover:opacity-70 transition-opacity relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-espresso text-oatmilk text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* --- TIER 2: Category Navigation --- */}
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

      {/* --- TIER 3: Announcement Bar --- */}
      <div className="w-full bg-vanilla/50 py-3 border-y border-espresso/5 flex justify-center items-center text-xs tracking-wide text-espresso/80 uppercase">
        <span className="mx-4 cursor-pointer">‹</span>
        Express delivery available on all orders at checkout
        <span className="mx-4 cursor-pointer">›</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* --- TIER 4: FUNCTIONAL Filter & Sort Bar --- */}
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

        {/* Product Grid */}
        {processedProducts.length === 0 ? (
          <p className="text-center text-espresso/60 mt-20 italic">No products found for this category or filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
            {processedProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Sliding Cart Overlay */}
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