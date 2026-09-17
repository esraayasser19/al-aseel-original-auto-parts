import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/supabaseApi";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { mockCategories } from "@/data/mockData";

const CATEGORIES = [
  "الكل",
  ...mockCategories.map((c) => c.name)
];

const PRICE_RANGES = [
  { label: "جميع الأسعار", min: 0, max: Infinity },
  { label: "أقل من 100 ر.س", min: 0, max: 100 },
  { label: "100 ر.س – 300 ر.س", min: 100, max: 300 },
  { label: "300 ر.س – 500 ر.س", min: 300, max: 500 },
  { label: "أكثر من 500 ر.س", min: 500, max: Infinity },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        className="w-full flex items-center justify-between py-1 font-body text-xs font-bold uppercase text-gray-700 hover:text-brand-accent transition-colors"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && <div className="mt-3 space-y-1">{children}</div>}
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-right px-3 py-1.5 text-sm font-body rounded-lg transition-colors ${
        active
          ? "bg-brand-primary text-white font-bold"
          : "text-gray-600 hover:text-brand-primary hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("الكل");
  const [priceRange, setPriceRange] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get("category");
    const searchParam = urlParams.get("search");
    if (catParam) {
      setCategory(catParam);
    }
    if (searchParam) {
      setSearch(searchParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters = {};
        if (category !== "الكل") filters.category = category;
        if (search.trim()) filters.search = search.trim();
        const data = await getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [category, search]);

  const selectedRange = PRICE_RANGES[priceRange];
  const filteredProducts = products.filter(
    p => p.price >= selectedRange.min && p.price <= selectedRange.max
  );

  const hasActiveFilters = category !== "الكل" || priceRange !== 0 || search.trim();

  const clearAll = () => {
    setCategory("الكل");
    setPriceRange(0);
    setSearch("");
  };

  const FilterPanel = () => (
    <div>
      <FilterSection title="تصنيفات القطع">
        {CATEGORIES.map(c => (
          <FilterPill
            key={c}
            label={c}
            active={category === c}
            onClick={() => setCategory(c)}
          />
        ))}
      </FilterSection>

      <FilterSection title="نطاق السعر (ر.س)">
        {PRICE_RANGES.map((r, i) => (
          <FilterPill key={i} label={r.label} active={priceRange === i} onClick={() => setPriceRange(i)} />
        ))}
      </FilterSection>

      {hasActiveFilters && (
        <button onClick={clearAll} className="w-full mt-2 px-3 py-2 border border-red-200 text-red-600 text-xs font-body font-bold hover:bg-red-50 transition-colors rounded-lg flex items-center justify-center gap-1">
          <X className="w-4 h-4" /> إعادة ضبط الفلاتر
        </button>
      )}
    </div>
  );

  return (
    <div data-testid="shop-page" className="py-8 sm:py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">كتالوج قطع الغيار المتوفرة</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-1">تصفح القطع والأسعار</h1>
        </div>

        {/* Search & Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              data-testid="search-input"
              placeholder="ابحث باسم قطعة الغيار، مثل: فلتر، تيل، بوجيهات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pr-10 rounded-lg border-gray-300 font-body bg-white text-right"
            />
          </div>
          <button
            data-testid="filter-toggle"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg font-body text-sm font-bold transition-colors ${mobileFiltersOpen ? "border-brand-primary bg-brand-primary text-white" : "border-gray-300 bg-white text-gray-700"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            تصفية
          </button>
        </div>

        {mobileFiltersOpen && (
          <div className="lg:hidden mb-6 p-4 border border-gray-200 bg-white rounded-xl">
            <FilterPanel />
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 bg-white p-5 rounded-xl border border-gray-200">
              <h3 className="font-heading text-base font-bold text-gray-900 mb-4">خيارات التصفية</h3>
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-6">
              <p className="font-body text-sm text-gray-600 font-bold" data-testid="product-count">
                {loading ? "جاري التحميل..." : `تم العثور على ${filteredProducts.length} قطعة غيار`}
              </p>
              {hasActiveFilters && !loading && (
                <button onClick={clearAll} className="text-brand-accent hover:underline text-xs font-bold">إلغاء الفلاتر</button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-gray-200 rounded-xl shimmer" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200" data-testid="no-products">
                <p className="font-heading text-xl font-bold text-gray-800 mb-2">لم يتم العثور على قطع غيار مطابقة</p>
                <p className="font-body text-sm text-gray-500 mb-4">جرب البحث بكلمات أخرى أو اختر تصنيف مختلف.</p>
                <button onClick={clearAll} className="text-brand-primary font-bold text-sm hover:underline">إلغاء جميع الفلاتر</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
