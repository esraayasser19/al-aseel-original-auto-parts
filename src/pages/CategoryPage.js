import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Search,
  ChevronLeft,
  ArrowLeft,
  PackageOpen,
  MessageCircle,
  SlidersHorizontal,
  Package
} from "lucide-react";
import { mockCategories, WHATSAPP_NUMBER } from "@/data/mockData";
import { getProducts } from "@/lib/supabaseApi";
import ProductCard from "@/components/ProductCard";
import { categoryIconMap } from "@/pages/CategoriesPage";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Find the matching category by slug or id
  const category = useMemo(() => {
    return mockCategories.find((c) => c.slug === slug || c.id === slug);
  }, [slug]);

  // Fetch products strictly belonging to this category
  useEffect(() => {
    if (!category) return;
    setLoading(true);
    getProducts({ category: category.name })
      .then((data) => {
        setProducts(data || []);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.car_type && p.car_type.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "bestseller") {
      list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }

    return list;
  }, [products, searchQuery, sortBy]);

  // If category not found
  if (!category) {
    return (
      <div dir="rtl" className="min-h-[60vh] flex items-center justify-center bg-gray-50 py-16 px-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
          <PackageOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            القسم غير موجود
          </h1>
          <p className="font-body text-sm text-gray-500 mb-6">
            عذراً، لم نتمكن من العثور على القسم المطلوب. قد يكون تم نقله أو تغييره.
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 bg-brand-primary text-white font-heading font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-brand-accent transition-colors"
          >
            <span>العودة إلى قائمة الأقسام</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = (categoryIconMap && categoryIconMap[category.name]) || Package;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `السلام عليكم، أود الاستفسار عن توفر قطع غيار في قسم: ${category.name}`
  )}`;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8 sm:py-10" data-testid="category-page">
      <Helmet>
        <title>{`${category.name} | القمة لقطع غيار السيارات`}</title>
        <meta
          name="description"
          content={category.description || `تصفح جميع قطع غيار ${category.name} المتوفرة بالمخزون بأفضل الأسعار وبضمان الجودة.`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-body text-gray-400 mb-6 flex-wrap" aria-label="breadcrumb">
          <Link to="/" className="hover:text-brand-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link to="/categories" className="hover:text-brand-primary transition-colors">الأقسام</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">{category.name}</span>
        </nav>

        {/* Category Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
                    {category.name}
                  </h1>
                  {!loading && (
                    <span className="text-xs font-heading font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-0.5 rounded-full">
                      {products.length} {products.length === 1 ? "قطعة" : "قطع"}
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="font-body text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
            </div>

            {/* Back to Categories link */}
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-gray-600 hover:text-brand-primary bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              <span>جميع الأقسام</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Search & Sorting Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-3 sm:p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
          {/* Live Search inside this category */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`ابحث داخل قطع ${category.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 rounded-lg border border-gray-200 font-body text-xs sm:text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="font-body text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="bestseller">الأكثر طلباً</option>
            </select>
          </div>
        </div>

        {/* Products Grid or Empty / Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200/70 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-xs text-gray-500">
                عرض {filteredProducts.length} من أصل {products.length} قطعة
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <PackageOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="font-heading text-xl font-bold text-gray-800 mb-2">
              {searchQuery.trim()
                ? `لا توجد نتائج مطابقة لـ "${searchQuery}"`
                : "غير متوفر حاليًا قطع غيار لهذا القسم"}
            </h2>
            <p className="font-body text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
              {searchQuery.trim()
                ? "يرجى تجربة كلمات بحث أخرى أو مسح حقل البحث لعرض كافة القطع."
                : `نعمل باستمرار على تحديث المخزون. يمكنك طلب وتوفير أي قطعة غيار تابعة لـ (${category.name}) برقم الهيكل مباشرة عبر واتساب.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {searchQuery.trim() && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-heading font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors"
                >
                  مسح البحث
                </button>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>اطلب عبر واتساب الآن</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
