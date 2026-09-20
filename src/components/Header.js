import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Menu, X, Wrench } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/supabaseApi";

// Navigation links from right-to-left as requested
const navLinks = [
  { label: "الرئيسية", to: "/" },
  { label: "أحدث العروض", to: "/shop?bestseller=true" },
  { label: "الأقسام", to: "/categories" },
  { label: "العلامات التجارية", to: "/brands" },
  { label: "كل المنتجات", to: "/shop" },
];

export default function Header() {
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await getProducts({ search: searchQuery.trim() });
        setSearchResults(results.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header data-testid="site-header" className="sticky top-0 z-50 bg-white border-b border-gray-200 dir-rtl text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16 sm:h-20">
        
        {/* Right side: Brand Logo */}
        <Link to="/" data-testid="logo-link" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold group-hover:bg-brand-accent transition-colors">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading text-xl sm:text-2xl font-bold text-gray-900 tracking-tight block">
              الأصيل لقطع الغيار
            </span>
            <span className="text-[10px] text-gray-500 font-body block -mt-1">
              قطع غيار سيارات أصلية ومضمونة
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links (RTL sequence) */}
        <nav className="hidden lg:flex items-center gap-7" data-testid="desktop-nav">
          {navLinks.map((link, idx) => {
            const isActive = location.pathname + location.search === link.to || (link.to === "/shop" && location.pathname === "/shop" && !location.search);
            return (
              <Link
                key={idx}
                to={link.to}
                className={`font-body text-base tracking-wide transition-colors py-1 ${
                  isActive
                    ? "text-brand-accent font-bold border-b-2 border-brand-accent"
                    : "text-gray-700 hover:text-brand-primary font-medium"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Left side: Header Action Icons (Search & Cart) */}
        <div className="flex items-center gap-3">
          {/* Search Icon & Modal Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-gray-700 hover:text-brand-primary hover:bg-gray-100 rounded-full"
            aria-label="البحث"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Cart Icon with Item-Count Badge */}
          <Link
            to="/cart"
            data-testid="cart-link"
            className="relative text-gray-700 hover:text-brand-primary transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="سلة الشراء"
          >
            <ShoppingCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span
                data-testid="cart-count-badge"
                className="absolute -top-1 -right-1 bg-brand-accent text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-in zoom-in-50"
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger" className="hover:bg-gray-100">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white w-72 dir-rtl text-right">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="font-heading text-brand-primary text-right font-bold text-lg">الأصيل لقطع الغيار</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="font-body text-base font-bold text-gray-800 hover:text-brand-accent transition-colors py-1.5 border-b border-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search Bar / Modal Drawer */}
      {searchOpen && (
        <div className="border-t border-gray-200 bg-gray-50 py-4 px-4 sm:px-6 lg:px-12 animate-fade-in">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  autoFocus
                  placeholder="ابحث عن قطعة غيار، اسم المنتج، الماركة، أو الكود..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-4 pl-10 py-5 rounded-lg border-gray-300 font-body text-right bg-white text-base shadow-sm"
                />
                <button type="button" onClick={() => setSearchQuery("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Button type="submit" className="bg-brand-primary text-white font-body font-bold rounded-lg px-6">
                بحث
              </Button>
            </form>

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden text-right">
                {searchLoading ? (
                  <p className="p-4 text-xs font-body text-gray-500">جاري البحث...</p>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-sm font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="font-body text-xs text-gray-500">{item.category} &middot; {item.brand || "أصلي"}</p>
                        </div>
                        <span className="font-heading text-sm font-extrabold text-brand-primary">
                          {item.price} ر.س
                        </span>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center p-3 text-xs font-body font-bold text-brand-accent hover:bg-gray-50 block"
                    >
                      عرض جميع نتائج البحث لـ "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <p className="p-4 text-xs font-body text-gray-500">لم يتم العثور على قطع غيار مطابقة لـ "{searchQuery}".</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
