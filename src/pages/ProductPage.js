import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";
import { getProduct, getReviews, submitReview, trackPageView } from "@/lib/supabaseApi";
import { ArrowRight, ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/mockData";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ customer_name: "", rating: 5, title: "", review_text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prod, revs] = await Promise.all([
          getProduct(id),
          getReviews(id),
        ]);
        setProduct(prod);
        setReviews(revs);
        if (prod) {
          trackPageView(`/product/${id}`, prod.name, id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.customer_name || !reviewForm.review_text) return;
    setSubmitting(true);
    try {
      await submitReview({
        ...reviewForm,
        product_id: id,
        product_name: product?.name,
      });
      toast.success("تم إرسال تقييمك بنجاح!");
      setReviewForm({ customer_name: "", rating: 5, title: "", review_text: "" });
    } catch (err) {
      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-200 aspect-[4/3] rounded-xl shimmer" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 w-1/3 rounded shimmer" />
            <div className="h-10 bg-gray-200 w-2/3 rounded shimmer" />
            <div className="h-20 bg-gray-200 w-full rounded shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 text-center">
        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">قطعة الغيار غير متوفرة</h2>
        <Button asChild className="bg-brand-primary text-white rounded-lg">
          <Link to="/shop">العودة للكتالوج</Link>
        </Button>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const whatsappText = `السلام عليكم، أرغب في الاستفسار عن / طلب قطعة الغيار التالية:\n- الاسم: ${product.name}\n- التصنيف: ${product.category}\n- السعر: ${product.price} ر.س`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div data-testid="product-page" className="py-8 sm:py-12 bg-gray-50 dir-rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumb */}
        <Link to="/shop" data-testid="back-to-shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-primary font-body text-sm mb-6 transition-colors">
          <ArrowRight className="w-4 h-4" /> العودة لكتالوج قطع الغيار
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          {/* Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[4/3]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="product-image"
            />
          </div>

          {/* Details */}
          <div className="space-y-6 text-right">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-2.5 py-1 rounded">
                  {product.category}
                </span>
                {product.brand && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded">
                    الماركة: {product.brand}
                  </span>
                )}
              </div>
              <h1 data-testid="product-name" className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>
              {product.car_type && (
                <p className="font-body text-xs text-gray-500 mt-1">
                  مناسب لسيارات: <span className="font-bold text-gray-800">{product.car_type}</span>
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={Math.floor(product.rating || 5)} size="w-4 h-4" />
              <span className="font-body text-xs text-gray-500">
                ({product.review_count || 45} تقييم للعملاء)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4" data-testid="product-price">
              <span className="font-heading text-3xl font-extrabold text-brand-primary">
                {product.price.toLocaleString("ar-SA")} <span className="text-base font-body font-normal">ر.س</span>
              </span>
              {product.original_price && (
                <>
                  <span className="font-body text-lg text-gray-400 line-through">
                    {product.original_price.toLocaleString("ar-SA")} ر.س
                  </span>
                  <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded">
                    خصم {discount}%
                  </span>
                </>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-heading text-base font-bold text-gray-900 mb-2">تفاصيل وحالة القطعة</h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-xs font-body text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>الحالة: <strong className="text-emerald-700">{product.status || "متوفر بالمخزون ومطابق للمواصفات"}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-gray-700">
                <ShieldCheck className="w-4 h-4 text-brand-accent shrink-0" />
                <span>الضمان: <strong>ضمان الفحص والتجربة ومطابقة رقم الهيكل</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-gray-700">
                <Wrench className="w-4 h-4 text-brand-primary shrink-0" />
                <span>التركيب: <strong>مطابقة سهلة ومباشرة لظفيرة ومكان الوكالة</strong></span>
              </div>
            </div>

            {/* WhatsApp CTA Action Button */}
            <div className="pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="add-to-cart-btn"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-xl font-body font-bold text-base flex items-center justify-center gap-3 transition-all shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                اطلب هذه القطعة عبر واتساب الآن
              </a>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
          <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">آراء وتجارب العملاء</h2>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-100 p-4 rounded-xl bg-gray-50 space-y-2">
                  <StarRating rating={review.rating} />
                  <h4 className="font-heading text-sm font-bold text-gray-900">{review.title}</h4>
                  <p className="font-body text-xs text-gray-600">"{review.review_text}"</p>
                  <p className="font-body text-[11px] text-gray-400">&mdash; {review.customer_name} ({review.customer_location || "السعودية"})</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-body text-sm text-gray-500 mb-8">لا توجد تقييمات سابقة لهذه القطعة حتى الآن.</p>
          )}

          {/* Add Review */}
          <div className="max-w-lg">
            <h3 className="font-heading text-base font-bold text-gray-900 mb-4">أضف تقييمك</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <Input
                placeholder="الاسم الكريم *"
                value={reviewForm.customer_name}
                onChange={(e) => setReviewForm({ ...reviewForm, customer_name: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right"
                required
              />
              <Input
                placeholder="عنوان التقييم"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right"
              />
              <Textarea
                placeholder="اكتب تجربتك مع هذه القطعة *"
                value={reviewForm.review_text}
                onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right min-h-[90px]"
                required
              />
              <Button type="submit" disabled={submitting} className="bg-brand-primary text-white rounded-lg font-body">
                {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
