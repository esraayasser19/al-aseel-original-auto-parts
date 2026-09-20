import { useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, Search, Car } from "lucide-react";
import { mockBrands, mockProducts } from "@/data/mockData";

export default function BrandPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [modelQuery, setModelQuery] = useState("");

  // Find the brand from the slug — always called (no conditional hooks)
  const brand = useMemo(
    () => mockBrands.find((b) => b.slug === slug),
    [slug]
  );

  // For each model, count matching products — always called, guard inside
  const modelsWithCount = useMemo(() => {
    if (!brand) return [];
    return brand.models.map((model) => {
      const count = mockProducts.filter((p) =>
        model.matchKeys.some((key) =>
          (p.car_type || "").toLowerCase().includes(key.toLowerCase())
        )
      ).length;
      return { ...model, productCount: count };
    });
  }, [brand]);

  // Filter by search — always called
  const filteredModels = useMemo(() => {
    if (!modelQuery.trim()) return modelsWithCount;
    const q = modelQuery.trim().toLowerCase();
    return modelsWithCount.filter((m) => m.nameAr.toLowerCase().includes(q));
  }, [modelsWithCount, modelQuery]);

  // Early return AFTER all hooks
  if (!brand) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-heading text-xl font-bold text-gray-700 mb-4">العلامة التجارية غير موجودة</p>
          <button
            onClick={() => navigate("/brands")}
            className="font-body text-sm text-brand-primary hover:underline"
          >
            العودة إلى العلامات التجارية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10" data-testid="brand-page">
      <Helmet>
        <title>{`${brand.nameAr} | العلامات التجارية | الأصيل لقطع الغيار`}</title>
        <meta
          name="description"
          content={`استعرض جميع موديلات ${brand.nameAr} وقطع الغيار المتوفرة لكل موديل في متجر الأصيل.`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-body text-gray-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-brand-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link to="/brands" className="hover:text-brand-primary transition-colors">العلامات التجارية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-bold">{brand.nameAr}</span>
        </nav>

        {/* Brand header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Brand logo */}
          <div className="brand-detail-logo-wrap">
            <img
              src={brand.logo}
              alt={brand.nameAr}
              className="brand-detail-logo-img"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="brand-detail-logo-fallback font-heading"
              style={{ display: "none" }}
            >
              {brand.nameAr.charAt(0)}
            </div>
          </div>
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              {brand.nameAr}
            </h1>
            <p className="font-body text-sm text-gray-500">
              {brand.models.length} موديل متوفر &middot; اختر الموديل لاستعراض قطع الغيار
            </p>
          </div>
        </div>

        {/* Models section */}
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-heading text-xl font-bold text-gray-800">الموديلات المتوفرة</h2>

          {/* Search models */}
          {brand.models.length > 4 && (
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="ابحث عن موديل..."
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                className="pr-9 pl-4 py-2 rounded-xl border border-gray-200 bg-white font-body text-sm text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition w-48"
              />
            </div>
          )}
        </div>

        {filteredModels.length > 0 ? (
          <div className="models-grid">
            {filteredModels.map((model) => (
              <Link
                key={model.id}
                to={`/brands/${brand.slug}/${model.id}`}
                className="model-card"
                aria-label={model.nameAr}
              >
                {/* Car icon */}
                <div className="model-icon-wrap">
                  <Car className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />
                </div>

                {/* Model name */}
                <div className="flex-1">
                  <span className="font-heading text-base font-bold text-gray-900 block">
                    {model.nameAr}
                  </span>
                  {model.productCount > 0 ? (
                    <span className="font-body text-xs text-gray-500">
                      {model.productCount} قطعة متوفرة
                    </span>
                  ) : (
                    <span className="font-body text-xs text-gray-400">استعرض القطع المتوفرة</span>
                  )}
                </div>

                <ChevronLeft className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-body">لا يوجد موديل مطابق لـ "{modelQuery}"</p>
          </div>
        )}
      </div>

      <style>{`
        .brand-detail-logo-wrap {
          width: 120px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-detail-logo-img {
          max-width: 120px;
          max-height: 72px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        .brand-detail-logo-fallback {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #1a3a6e;
          color: #fff;
          font-size: 2rem;
          font-weight: 900;
          align-items: center;
          justify-content: center;
        }

        .models-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .model-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 14px;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.045);
          text-decoration: none;
          cursor: pointer;
          transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }
        .model-card:hover {
          box-shadow: 0 6px 20px 0 rgba(0,0,0,0.1);
          transform: translateY(-2px);
          border-color: #c9d3e0;
        }
        .model-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #f0f4ff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .models-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .models-grid { grid-template-columns: 1fr; gap: 10px; }
        }
      `}</style>
    </div>
  );
}
