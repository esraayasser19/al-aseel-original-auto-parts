import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Search, ChevronLeft, Tag } from "lucide-react";
import { mockBrands } from "@/data/mockData";

export default function BrandsPage() {
  const [query, setQuery] = useState("");

  // Sort alphabetically by Arabic name, then filter by search query
  const sortedBrands = useMemo(() => {
    const active = mockBrands.filter((b) => b.active);
    const sorted = [...active].sort((a, b) =>
      a.nameAr.localeCompare(b.nameAr, "ar")
    );
    if (!query.trim()) return sorted;
    const q = query.trim().toLowerCase();
    return sorted.filter(
      (b) =>
        b.nameAr.toLowerCase().includes(q) ||
        b.nameEn.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10" data-testid="brands-page">
      <Helmet>
        <title>العلامات التجارية | الأصيل لقطع غيار السيارات</title>
        <meta
          name="description"
          content="تصفح جميع العلامات التجارية المتوفرة: تويوتا، نيسان، هوندا، هيونداي، كيا، فورد وغيرها. اختر علامتك التجارية واستعرض قطع الغيار المتوفرة."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-body text-gray-400 mb-8" aria-label="breadcrumb">
          <Link to="/" className="hover:text-brand-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-bold">العلامات التجارية</span>
        </nav>

        {/* Page heading */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-accent mb-2">
            <Tag className="w-3.5 h-3.5" />
            تصفح حسب العلامة
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">العلامات التجارية</h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            اختر العلامة التجارية لسيارتك واستعرض قطع الغيار المتوفرة
          </p>
        </div>

        {/* Search box */}
        <div className="relative max-w-sm mb-10">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث عن علامة تجارية..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
          />
        </div>

        {/* Brands grid */}
        {sortedBrands.length > 0 ? (
          <div className="brands-grid">
            {sortedBrands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="brand-card"
                aria-label={brand.nameAr}
              >
                {/* Logo container */}
                <div className="brand-logo-wrap">
                  <img
                    src={brand.logo}
                    alt={brand.nameAr}
                    className="brand-logo-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback if logo fails */}
                  <div
                    className="brand-logo-fallback font-heading"
                    style={{ display: "none" }}
                  >
                    {brand.nameAr.charAt(0)}
                  </div>
                </div>

                {/* Arabic brand name directly below logo */}
                <span className="brand-name font-heading">{brand.nameAr}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-body text-base">لا توجد علامات تجارية مطابقة لـ "{query}"</p>
          </div>
        )}
      </div>

      <style>{`
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .brand-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 28px 16px 20px;
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 18px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,0.055);
          text-decoration: none;
          cursor: pointer;
          transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
        }
        .brand-card:hover {
          box-shadow: 0 8px 28px 0 rgba(0,0,0,0.11);
          transform: translateY(-4px);
          border-color: #d1d5db;
        }

        .brand-logo-wrap {
          width: 100%;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo-img {
          max-width: 120px;
          max-height: 60px;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
          transition: transform 0.3s ease;
        }
        .brand-card:hover .brand-logo-img {
          transform: scale(1.06);
        }
        .brand-logo-fallback {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #1a3a6e;
          color: #fff;
          font-size: 1.6rem;
          font-weight: 900;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
        }
        .brand-badge {
          font-size: 0.7rem;
          font-weight: 600;
          color: #6b7280;
          background: #f3f4f6;
          border-radius: 99px;
          padding: 2px 10px;
        }

        @media (max-width: 1024px) {
          .brands-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .brands-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .brand-card { padding: 20px 12px 16px; }
          .brand-logo-wrap { height: 56px; }
          .brand-logo-img { max-width: 90px; max-height: 46px; }
          .brand-name { font-size: 0.88rem; }
        }
      `}</style>
    </div>
  );
}
