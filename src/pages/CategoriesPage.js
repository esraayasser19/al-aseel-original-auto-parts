import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Droplets,
  Wind,
  Fuel,
  CircleDot,
  Disc,
  Zap,
  BatteryCharging,
  Cog,
  Repeat,
  Waves,
  Gauge,
  Lightbulb,
  Sun,
  Eye,
  Sparkles,
  ShieldCheck,
  Package,
  Cpu,
  Wrench,
  CircleAlert,
  Layers,
  Search,
  ChevronLeft,
  ArrowLeft,
  LayoutGrid
} from "lucide-react";
import { mockCategories } from "@/data/mockData";

export const categoryIconMap = {
  "فلاتر زيت": Droplets,
  "فلاتر هواء": Wind,
  "فلاتر بنزين": Fuel,
  "تيل فرامل": CircleDot,
  "طنابير فرامل": Disc,
  "بوجيهات": Zap,
  "بطاريات سيارات": BatteryCharging,
  "سيور محرك": Cog,
  "سير كاتينة": Repeat,
  "طرمبة مياه": Waves,
  "طرمبة بنزين": Gauge,
  "فوانيس": Lightbulb,
  "لمبات سيارات": Sun,
  "مرايات جانبية": Eye,
  "مساحات زجاج": Sparkles,
  "إكسسوارات سيارات": ShieldCheck,
  "قطع غيار أصلية": Package,
  "قطع غيار كهرباء": Cpu,
  "قطع غيار محرك": Wrench,
  "قطع غيار فرامل": CircleAlert,
  "قطع غيار عفشة": Layers,
};

export default function CategoriesPage() {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    let list = mockCategories.filter((c) => c.active);
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10" data-testid="categories-page">
      <Helmet>
        <title>{"الأقسام | الأصيل لقطع غيار السيارات"}</title>
        <meta
          name="description"
          content="تصفح جميع أقسام قطع غيار السيارات: فلاتر زيت، فلاتر هواء، تيل فرامل، بوجيهات، بطاريات، سيور محرك، فوانيس، مرايات جانبية وقطع غيار أصلية."
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-body text-gray-400 mb-8" aria-label="breadcrumb">
          <Link to="/" className="hover:text-brand-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-bold">الأقسام</span>
        </nav>

        {/* Page heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-accent mb-2">
              <LayoutGrid className="w-3.5 h-3.5" />
              كتالوج الأقسام
            </span>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
                أقسام قطع غيار السيارات
              </h1>
              <span className="bg-brand-primary/10 text-brand-primary text-xs font-heading font-bold px-3 py-1 rounded-full">
                {mockCategories.length} قسم
              </span>
            </div>
            <p className="font-body text-sm text-gray-500 mt-1">
              اختر القسم المطلوب لاستعراض وشراء جميع قطع الغيار المتوفرة له
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث في الأقسام..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2.5 rounded-xl border border-gray-200 bg-white font-body text-sm text-right shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="categories-full-grid">
            {filteredCategories.map((cat) => {
              const IconComp = categoryIconMap[cat.name] || Package;
              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="category-card group"
                  aria-label={`تصفح قطع ${cat.name}`}
                >
                  <div className="category-icon-box">
                    <IconComp className="category-icon" strokeWidth={1.75} />
                  </div>

                  <div className="flex-1 flex flex-col items-center text-center w-full">
                    <h3 className="category-title font-heading">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="category-desc font-body">
                        {cat.description}
                      </p>
                    )}
                    <span className="category-action font-body mt-auto pt-3">
                      <span>استعراض القطع</span>
                      <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-body text-base text-gray-600 mb-1">
              لا توجد أقسام مطابقة لـ &quot;{query}&quot;
            </p>
            <p className="font-body text-xs text-gray-400">
              جرب البحث بكلمات أخرى أو اختر من الأقسام المتاحة
            </p>
          </div>
        )}
      </div>

      <style>{`
        .categories-full-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .category-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 18px 20px;
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 18px;
          box-shadow: 0 2px 10px 0 rgba(0,0,0,0.04);
          text-decoration: none;
          cursor: pointer;
          transition: all 0.22s ease;
          min-height: 200px;
        }
        .category-card:hover {
          box-shadow: 0 8px 24px 0 rgba(0,0,0,0.08);
          transform: translateY(-4px);
          border-color: #cbd5e1;
        }

        .category-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: all 0.25s ease;
        }
        .category-card:hover .category-icon-box {
          background: var(--brand-primary, #1a3a6e);
          border-color: var(--brand-primary, #1a3a6e);
        }

        .category-icon {
          width: 28px;
          height: 28px;
          color: var(--brand-primary, #1a3a6e);
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .category-card:hover .category-icon {
          color: #ffffff;
          transform: scale(1.1);
        }

        .category-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 6px;
          transition: color 0.2s ease;
        }
        .category-card:hover .category-title {
          color: var(--brand-primary, #1a3a6e);
        }

        .category-desc {
          font-size: 0.78rem;
          color: #6b7280;
          line-height: 1.5;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--brand-accent, #e63946);
        }

        @media (max-width: 1100px) {
          .categories-full-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 768px) {
          .categories-full-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .category-card {
            padding: 18px 12px 16px;
            min-height: 170px;
          }
          .category-icon-box {
            width: 50px;
            height: 50px;
            margin-bottom: 12px;
          }
          .category-icon {
            width: 24px;
            height: 24px;
          }
          .category-title {
            font-size: 0.92rem;
          }
          .category-desc {
            font-size: 0.72rem;
          }
        }
      `}</style>
    </div>
  );
}
