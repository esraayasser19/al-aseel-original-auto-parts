import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import { getProducts, getReviews, getBanners, trackPageView } from "@/lib/supabaseApi";
import {
  ArrowLeft, Wrench, PhoneCall,
  ChevronLeft, ChevronRight,
  Droplets, Wind, CircleDot, Zap, BatteryCharging,
  Cog, Waves, Lightbulb, Eye, Package, ShieldCheck, Truck
} from "lucide-react";
import { mockCategories, mockBrands } from "@/data/mockData";

function HeroSlider({ banners }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const goTo = useCallback((idx) => {
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 700);
  }, []);

  const next = useCallback(() => goTo((current + 1) % banners.length), [current, banners.length, goTo]);
  const prev = (e) => { e.preventDefault(); e.stopPropagation(); goTo((current - 1 + banners.length) % banners.length); };
  const handleNext = (e) => { e.preventDefault(); e.stopPropagation(); next(); };

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => next(), 7000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (!banners.length) return null;
  const slide = banners[current];

  return (
    <>
      <section
        className="hero-slider-section relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #080f1a 0%, #0d1b2a 40%, #1b2d4a 100%)",
        }}
      >
        {/* ── Background images ── */}
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-all duration-[800ms] ease-in-out ${
              i === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{ zIndex: 1 }}
          >
            <img
              src={b.image}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center right",
                display: "block",
              }}
            />
            {/* Multi-layer overlay — heavier on the right (RTL text side) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
                  linear-gradient(to left,
                    rgba(8,15,26,0.35) 0%,
                    rgba(8,15,26,0.6) 30%,
                    rgba(8,15,26,0.82) 55%,
                    rgba(8,15,26,0.94) 80%,
                    rgba(8,15,26,0.98) 100%
                  )
                `,
              }}
            />
            {/* Top + Bottom edge fade */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
                  linear-gradient(to bottom,
                    rgba(8,15,26,0.5) 0%,
                    transparent 15%,
                    transparent 80%,
                    rgba(8,15,26,0.7) 100%
                  )
                `,
              }}
            />
          </div>
        ))}

        {/* ── Text content ── */}
        <div
          className="hero-slider-content relative flex items-center"
          style={{ zIndex: 20 }}
          dir="rtl"
        >
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-14 w-full hero-slider-inner">
            <div className="hero-text-block">
              {/* Accent badge */}
              <div
                className="hero-badge font-heading"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(230,57,70,0.15)",
                  border: "1px solid rgba(230,57,70,0.35)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  color: "#ff6b7a",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: "50px",
                  letterSpacing: "0.04em",
                  marginBottom: "20px",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e63946", display: "inline-block" }} />
                قطع غيار أصلية ١٠٠٪
              </div>

              {/* Main heading */}
              <h1
                className="hero-title font-heading"
                style={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#ffffff",
                  textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                  marginBottom: "16px",
                }}
              >
                {slide.title || "الأصيل لقطع غيار السيارات"}
              </h1>

              {/* Subtitle */}
              {slide.subtitle && (
                <p
                  className="hero-subtitle font-body"
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.85,
                    maxWidth: "540px",
                    marginBottom: "28px",
                    textShadow: "0 1px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {slide.subtitle}
                </p>
              )}

              {/* CTA Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
                <Link
                  to="/shop"
                  className="hero-btn-primary font-heading"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "linear-gradient(135deg, #e63946 0%, #c0392b 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    padding: "14px 32px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 24px rgba(230,57,70,0.35)",
                    transition: "all 0.25s ease",
                    border: "none",
                  }}
                >
                  {slide.button_text || "تسوق الآن"}
                  <ArrowLeft className="w-4 h-4" style={{ transform: "scaleX(-1)" }} />
                </Link>
                <a
                  href="https://wa.me/966500000000?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn-whatsapp font-heading"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "rgba(37,211,102,0.15)",
                    border: "1px solid rgba(37,211,102,0.4)",
                    color: "#25D366",
                    fontWeight: 700,
                    padding: "14px 32px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    backdropFilter: "blur(4px)",
                    transition: "all 0.25s ease",
                  }}
                >
                  <PhoneCall className="w-4 h-4" />
                  اطلب عبر واتساب
                </a>
              </div>

              {/* Trust badges */}
              <div
                className="hero-trust-badges font-body"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 20px",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.78rem",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck className="w-4 h-4" style={{ color: "#e63946" }} />
                  ضمان على التوافق
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Truck className="w-4 h-4" style={{ color: "#e63946" }} />
                  شحن لجميع المناطق
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Wrench className="w-4 h-4" style={{ color: "#e63946" }} />
                  استشارة فنية مجانية
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation arrows ── */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="hero-arrow hero-arrow-left"
              style={{ zIndex: 30 }}
              aria-label="السابق"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="hero-arrow hero-arrow-right"
              style={{ zIndex: 30 }}
              aria-label="التالي"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot indicators + progress */}
            <div className="hero-dots" style={{ zIndex: 30 }}>
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  className={`hero-dot ${i === current ? "hero-dot-active" : ""}`}
                  aria-label={`الشريحة ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Scoped Hero Styles ── */}
      <style>{`
        .hero-slider-section {
          min-height: 85vh;
          position: relative;
        }
        .hero-slider-content {
          min-height: 85vh;
          padding-top: 40px;
          padding-bottom: 60px;
        }
        .hero-text-block {
          max-width: 620px;
        }
        .hero-title {
          font-size: clamp(1.75rem, 5vw, 3.2rem);
        }
        .hero-subtitle {
          font-size: clamp(0.85rem, 1.8vw, 1.05rem);
        }

        /* CTA hover effects */
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(230,57,70,0.45) !important;
        }
        .hero-btn-whatsapp:hover {
          background: rgba(37,211,102,0.25) !important;
          border-color: rgba(37,211,102,0.6) !important;
          transform: translateY(-2px);
        }

        /* Arrows */
        .hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .hero-arrow:hover {
          background: rgba(255,255,255,0.18);
          border-color: rgba(255,255,255,0.25);
        }
        .hero-arrow-left { left: 20px; }
        .hero-arrow-right { right: 20px; }

        /* Dots */
        .hero-dots {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .hero-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        .hero-dot:hover {
          background: rgba(255,255,255,0.5);
        }
        .hero-dot-active {
          background: #e63946;
          width: 32px;
          border-radius: 6px;
          box-shadow: 0 0 12px rgba(230,57,70,0.5);
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .hero-slider-section { min-height: 75vh; }
          .hero-slider-content { min-height: 75vh; }
          .hero-arrow { width: 42px; height: 42px; }
          .hero-arrow-left { left: 12px; }
          .hero-arrow-right { right: 12px; }
        }
        @media (max-width: 768px) {
          .hero-slider-section { min-height: 70vh; }
          .hero-slider-content {
            min-height: 70vh;
            padding-top: 32px;
            padding-bottom: 50px;
          }
          .hero-text-block { max-width: 100%; }
          .hero-badge { font-size: 0.68rem !important; padding: 6px 14px !important; }
          .hero-btn-primary,
          .hero-btn-whatsapp {
            padding: 12px 22px !important;
            font-size: 0.85rem;
          }
          .hero-trust-badges { font-size: 0.7rem !important; gap: 4px 14px !important; }
          .hero-trust-badges span[style*="color: rgba(255"] { display: none; }
          .hero-arrow { width: 38px; height: 38px; }
          .hero-arrow-left { left: 8px; }
          .hero-arrow-right { right: 8px; }
          .hero-dots { bottom: 18px; }
        }
        @media (max-width: 480px) {
          .hero-slider-section { min-height: 65vh; }
          .hero-slider-content { min-height: 65vh; padding-top: 24px; padding-bottom: 44px; }
          .hero-btn-primary,
          .hero-btn-whatsapp {
            padding: 10px 18px !important;
            font-size: 0.8rem;
            border-radius: 10px !important;
          }
          .hero-arrow { width: 34px; height: 34px; }
        }
      `}</style>
    </>
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
        <title>الأصيل لقطع غيار السيارات | كتالوج قطع الغيار الأصلية في السعودية</title>
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
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">لماذا تختار الأصيل لقطع الغيار؟</h2>
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
