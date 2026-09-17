import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import { getProducts, getReviews, getBanners, trackPageView } from "@/lib/supabaseApi";
import {
  ArrowLeft, ShieldCheck, Wrench, Truck, CheckCircle2,
  ChevronLeft, ChevronRight, PhoneCall,
  Droplets, Wind, CircleDot, Zap, BatteryCharging,
  Cog, Waves, Lightbulb, Eye, Package
} from "lucide-react";
import { WHATSAPP_NUMBER, mockCategories, mockBrands } from "@/data/mockData";

function HeroSlider({ banners }) {
  const [current, setCurrent] = useState(0);
  const goTo = useCallback((idx) => setCurrent(idx), []);

  const next = useCallback(() => goTo((current + 1) % banners.length), [current, banners.length, goTo]);
  const prev = () => goTo((current - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => next(), 6000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (!banners.length) return null;
  const slide = banners[current];

  return (
    <section className="relative overflow-hidden bg-gray-900 text-white min-h-[70vh] flex items-center">
      {banners.map((b, i) => (
        <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}>
          <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent dir-rtl" />
        </div>
      ))}

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-16">
        <div className="max-w-2xl space-y-6 text-right">
          <span className="inline-block bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded">
            قطع غيار أصلية 100%
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="font-body text-base sm:text-lg text-gray-200 leading-relaxed max-w-xl">
              {slide.subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg px-8 py-6 text-base font-body font-bold shadow-lg">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("السلام عليكم، أود طلب قطعة غيار سيارات")}`} target="_blank" rel="noopener noreferrer">
                اطلب تسعيرتك الآن عبر واتساب
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 rounded-lg px-8 py-6 text-base font-body font-bold">
              <Link to="/shop">استعراض كتالوج القطع</Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-xs font-body text-gray-300">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-accent" /> ضمان شامل على التوافق</span>
            <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-brand-accent" /> شحن سريع لجميع مناطق المملكة</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand-accent" /> مطابقة للمواصفات السعودية</span>
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </section>
  );
}

export default function HomePage() {
  const [bestsellers, setBestsellers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView("/", "الرئيسية");
    const fetchData = async () => {
      try {
        const [prods, revs, bnrs] = await Promise.all([
          getProducts({ bestseller: true }),
          getReviews(),
          getBanners(),
        ]);
        setBestsellers(prods);
        setReviews(revs);
        setBanners(bnrs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Map each category name to its matching Lucide automotive icon
  const categoryIconMap = {
    "فلاتر زيت":        Droplets,
    "فلاتر هواء":       Wind,
    "تيل فرامل":        CircleDot,
    "بوجيهات":          Zap,
    "بطاريات سيارات":   BatteryCharging,
    "سيور محرك":        Cog,
    "طرمبة مياه":       Waves,
    "فوانيس":           Lightbulb,
    "مرايات جانبية":    Eye,
    "قطع غيار أصلية":   Package,
  };

  // Use active main categories for the home page section
  const categoriesList = mockCategories.filter(c => c.active && c.isMain);

  // Sort all active brands alphabetically by Arabic name
  const sortedBrands = [...mockBrands]
    .filter((b) => b.active)
    .sort((a, b) => a.nameAr.localeCompare(b.nameAr, "ar"));

  return (
    <div data-testid="home-page" className="bg-gray-50">
      <Helmet>
        <title>القمة لقطع غيار السيارات | كتالوج قطع الغيار الأصلية في السعودية</title>
        <meta name="description" content="كتالوج إلكتروني لقطع غيار السيارات الأصلية: فلاتر زيت، فلاتر هواء، تيل فرامل، بوجيهات، بطاريات وطرمبات مياه مع طلب مباشر عبر الواتساب." />
      </Helmet>

      {/* Hero Banner */}
      <HeroSlider banners={banners} />

      {/* ═══ الأقسام الرئيسية ═══ */}
      <section className="py-14 bg-white border-b border-gray-100" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

          {/* Section heading with More link */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "var(--brand-accent, #e63946)",
                  marginBottom: "6px",
                }}
                className="font-heading"
              >
                تصفح حسب القسم
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">الأقسام الرئيسية</h2>
              <p className="font-body text-sm text-gray-400 mt-1">اختر قسم قطع الغيار المناسب لسيارتك</p>
            </div>
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-heading font-bold text-brand-primary hover:text-brand-accent transition-colors self-start sm:self-auto"
            >
              <span>المزيد من الأقسام</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* ── Pill/Oval grid ── */}
          <div className="cat-pill-grid">
            {categoriesList.map((cat) => {
              const IconComponent = categoryIconMap[cat.name] || Package;
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="cat-pill-item"
                  aria-label={cat.name}
                >
                  {/* The pill/oval shape */}
                  <div className="cat-pill-oval">
                    <IconComponent
                      className="cat-pill-icon"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Arabic name below */}
                  <span className="cat-pill-label font-heading">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* More button below grid */}
          <div className="text-center mt-10">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-heading font-bold text-sm px-7 py-3 rounded-xl border border-gray-200 shadow-sm hover:shadow hover:border-gray-300 transition-all"
            >
              <span>المزيد</span>
              <ArrowLeft className="w-4 h-4 text-brand-accent" />
            </Link>
          </div>
        </div>

        {/* Scoped styles for this section only */}
        <style>{`
          /* Grid */
          .cat-pill-grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 24px 12px;
            justify-items: center;
          }

          /* Each pill item wrapper */
          .cat-pill-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            width: 100%;
            cursor: pointer;
          }

          /* The oval/pill itself */
          .cat-pill-oval {
            width: 100%;
            /* aspect-ratio creates the horizontal pill: wider than tall */
            aspect-ratio: 2.4 / 1;
            border-radius: 9999px;
            background: #ffffff;
            border: 1px solid #ebebeb;
            box-shadow: 0 2px 10px 0 rgba(0,0,0,0.055);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
            overflow: hidden;
          }

          /* Icon inside the pill */
          .cat-pill-icon {
            width: 28px;
            height: 28px;
            color: #374151;
            transition: color 0.22s ease, transform 0.3s ease;
            flex-shrink: 0;
          }

          /* Label below the pill */
          .cat-pill-label {
            font-size: 0.8rem;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            line-height: 1.35;
            white-space: nowrap;
          }

          /* Hover state */
          .cat-pill-item:hover .cat-pill-oval {
            box-shadow: 0 6px 22px 0 rgba(0,0,0,0.11);
            transform: translateY(-3px);
            border-color: #d1d5db;
          }
          .cat-pill-item:hover .cat-pill-icon {
            transform: scale(1.12);
            color: var(--brand-primary, #1a3a6e);
          }
          .cat-pill-item:hover .cat-pill-label {
            color: var(--brand-primary, #1a3a6e);
          }

          /* Tablet: 5 per row */
          @media (max-width: 1100px) {
            .cat-pill-grid {
              grid-template-columns: repeat(5, 1fr);
            }
          }
          /* Tablet small: 3 per row */
          @media (max-width: 768px) {
            .cat-pill-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 18px 10px;
            }
            .cat-pill-icon {
              width: 24px;
              height: 24px;
            }
          }
          /* Mobile: 2 per row */
          @media (max-width: 480px) {
            .cat-pill-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 14px 8px;
            }
            .cat-pill-icon {
              width: 22px;
              height: 22px;
            }
            .cat-pill-label {
              font-size: 0.72rem;
            }
          }
        `}</style>
      </section>

      {/* ═══ قسم العلامات التجارية ═══ */}
      <section className="py-14 bg-gray-50 border-b border-gray-200/80" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section heading */}
          <div className="text-center mb-10">
            <span
              style={{
                display: "inline-block",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--brand-accent, #e63946)",
                marginBottom: "6px",
              }}
              className="font-heading"
            >
              تصفح حسب الماركة
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
              العلامات التجارية
            </h2>
            <p className="font-body text-sm text-gray-400 mt-1">
              اختر علامتك التجارية واستعرض قطع الغيار المتوفرة لكل سيارة
            </p>
          </div>

          {/* Brands grid */}
          <div className="home-brands-grid">
            {sortedBrands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="home-brand-card"
                aria-label={brand.nameAr}
              >
                <div className="home-brand-logo-wrap">
                  <img
                    src={brand.logo}
                    alt={brand.nameAr}
                    className="home-brand-logo-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="home-brand-logo-fallback font-heading" style={{ display: "none" }}>
                    {brand.nameAr.charAt(0)}
                  </div>
                </div>
                <span className="home-brand-name font-heading">{brand.nameAr}</span>
              </Link>
            ))}
          </div>
        </div>

        <style>{`
          .home-brands-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .home-brand-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 24px 16px 20px;
            background: #ffffff;
            border: 1px solid #ebebeb;
            border-radius: 16px;
            box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
            text-decoration: none;
            cursor: pointer;
            transition: box-shadow 0.22s ease, transform 0.22s ease, border-color 0.22s ease;
            min-height: 130px;
          }
          .home-brand-card:hover {
            box-shadow: 0 8px 24px 0 rgba(0,0,0,0.08);
            transform: translateY(-3px);
            border-color: #d1d5db;
          }
          .home-brand-logo-wrap {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .home-brand-logo-img {
            max-width: 110px;
            max-height: 50px;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
            transition: transform 0.25s ease;
          }
          .home-brand-card:hover .home-brand-logo-img {
            transform: scale(1.06);
          }
          .home-brand-logo-fallback {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #1a3a6e;
            color: #fff;
            font-size: 1.4rem;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .home-brand-name {
            font-size: 0.95rem;
            font-weight: 700;
            color: #1f2937;
            text-align: center;
            line-height: 1.3;
          }
          @media (max-width: 1024px) {
            .home-brands-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }
          }
          @media (max-width: 640px) {
            .home-brands-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
            .home-brand-card {
              padding: 18px 10px 14px;
              min-height: 110px;
              gap: 8px;
            }
            .home-brand-logo-wrap {
              height: 46px;
            }
            .home-brand-logo-img {
              max-width: 85px;
              max-height: 40px;
            }
            .home-brand-name {
              font-size: 0.85rem;
            }
          }
        `}</style>
      </section>

      {/* Featured Products Grid */}
      <section data-testid="bestsellers-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">قطع مميزة بالمخزون</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-1">الأكثر طلباً ومبيعاً</h2>
            </div>
            <Link to="/shop" className="font-body text-sm font-bold text-brand-primary hover:text-brand-accent flex items-center gap-1 transition-colors">
              عرض كل الكتالوج <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-gray-200 rounded-xl shimmer" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bestsellers.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">لماذا تختار القمة لقطع الغيار؟</h2>
            <p className="font-body text-sm text-gray-500 mt-2">نقدم تجربة موثوقة وسريعة لشراء قطع غيار السيارات بكل سهولة</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "قطع أصلية ومضمونة", desc: "نضمن لك مطابقة القطع للمواصفات وجودة التصنيع العالية." },
              { icon: PhoneCall, title: "طلب مباشر عبر واتساب", desc: "لا حاجة لخطوات الشراء المعقدة، تواصل معنا مباشرة برقم القطعة." },
              { icon: Truck, title: "توصيل لكافة المناطق", desc: "شحن سريع لكافة مدن ومحافظات المملكة العربية السعودية." },
              { icon: Wrench, title: "استشارة فنية مجانية", desc: "فريقنا المتخصص يساعدك في اختيار القطعة المطابقة لرقم الهيكل." },
            ].map(item => (
              <div key={item.title} className="text-right p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-12 h-12 mb-4 rounded-lg bg-brand-primary text-white flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="font-body text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-xs font-bold text-brand-accent">ثقة عملائنا</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-1">آراء وتقييمات العملاء</h2>
            </div>
            <Link to="/reviews" className="font-body text-sm font-bold text-brand-primary hover:text-brand-accent flex items-center gap-1">
              جميع التقييمات <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(rev => (
              <div key={rev.id} className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
                <StarRating rating={rev.rating} />
                <h4 className="font-heading font-bold text-base text-gray-900">{rev.title}</h4>
                <p className="font-body text-xs text-gray-600 leading-relaxed">"{rev.review_text}"</p>
                <div className="pt-2 border-t border-gray-100 text-xs">
                  <span className="font-bold text-gray-900 block">{rev.customer_name}</span>
                  <span className="text-gray-400">{rev.customer_location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
