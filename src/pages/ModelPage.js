import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, MessageCircle, PackageOpen } from "lucide-react";
import { mockBrands, mockProducts, WHATSAPP_NUMBER } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

export default function ModelPage() {
  const { slug, modelId } = useParams();
  const navigate = useNavigate();

  // Find brand and model
  const brand = useMemo(() => mockBrands.find((b) => b.slug === slug), [slug]);
  const model = useMemo(
    () => brand?.models.find((m) => m.id === modelId),
    [brand, modelId]
  );

  // Filter products by car_type matching any of the model's matchKeys
  const products = useMemo(() => {
    if (!model) return [];
    return mockProducts.filter((p) =>
      model.matchKeys.some((key) =>
        (p.car_type || "").toLowerCase().includes(key.toLowerCase())
      )
    );
  }, [model]);

  // Not found states
  if (!brand) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-heading text-xl font-bold text-gray-700 mb-4">العلامة التجارية غير موجودة</p>
          <button onClick={() => navigate("/brands")} className="font-body text-sm text-brand-primary hover:underline">
            العودة إلى العلامات التجارية
          </button>
        </div>
      </div>
    );
  }
  if (!model) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="font-heading text-xl font-bold text-gray-700 mb-4">الموديل غير موجود</p>
          <button onClick={() => navigate(`/brands/${slug}`)} className="font-body text-sm text-brand-primary hover:underline">
            العودة إلى {brand.nameAr}
          </button>
        </div>
      </div>
    );
  }

  const waMsg = encodeURIComponent(
    `السلام عليكم، أبحث عن قطع غيار لـ ${brand.nameAr} ${model.nameAr}. هل متوفر لديكم؟`
  );
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-10" data-testid="model-page">
      <Helmet>
        <title>{`${brand.nameAr} ${model.nameAr} | قطع الغيار | الأصيل`}</title>
        <meta
          name="description"
          content={`قطع الغيار المتوفرة لـ ${brand.nameAr} ${model.nameAr}: فلاتر، فرامل، بطاريات وأكثر. اطلب الآن عبر واتساب.`}
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-body text-gray-400 mb-8 flex-wrap" aria-label="breadcrumb">
          <Link to="/" className="hover:text-brand-primary transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link to="/brands" className="hover:text-brand-primary transition-colors">العلامات التجارية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <Link to={`/brands/${brand.slug}`} className="hover:text-brand-primary transition-colors">{brand.nameAr}</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-500 font-medium">{model.nameAr}</span>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-gray-800 font-bold">قطع الغيار</span>
        </nav>

        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="model-header-logo">
            <img
              src={brand.logo}
              alt={brand.nameAr}
              className="model-logo-img"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              {brand.nameAr} &ndash; {model.nameAr}
            </h1>
            <p className="font-body text-sm text-gray-500 mt-0.5">
              قطع الغيار المتوفرة لهذا الموديل
            </p>
          </div>
          {/* WhatsApp CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb85a] text-white font-body font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            طلب عبر واتساب
          </a>
        </div>

        {/* Products or empty state */}
        {products.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-gray-800">
                القطع المتوفرة
                <span className="font-body text-sm font-normal text-gray-500 mr-2">
                  ({products.length} قطعة)
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          // Empty state
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <PackageOpen className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <h2 className="font-heading text-xl font-bold text-gray-700 mb-2">
              غير متوفر حاليًا قطع غيار لهذا النوع
            </h2>
            <p className="font-body text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              لا تتردد في التواصل معنا مباشرة عبر واتساب وسنساعدك في إيجاد القطعة المطلوبة.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb85a] text-white font-body font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow"
            >
              <MessageCircle className="w-4 h-4" />
              تواصل معنا عبر واتساب
            </a>
          </div>
        )}
      </div>

      <style>{`
        .model-header-logo {
          width: 80px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .model-logo-img {
          max-width: 80px;
          max-height: 48px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
