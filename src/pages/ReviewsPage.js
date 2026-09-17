import { useEffect, useState } from "react";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getReviews, submitReview } from "@/lib/supabaseApi";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_location: "",
    rating: 5,
    title: "",
    review_text: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer_name || !form.review_text) return;
    setSubmitting(true);
    try {
      await submitReview(form);
      toast.success("شكراً لك! تم إرسال تقييمك بنجاح.");
      setForm({ customer_name: "", customer_location: "", rating: 5, title: "", review_text: "" });
      setShowForm(false);
    } catch (err) {
      toast.error("حدث خطأ أثناء إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div data-testid="reviews-page" className="py-8 sm:py-12 bg-gray-50 dir-rtl min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-right">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-accent">ثقة ومصداقية</span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
            آراء وتقييمات عملاء قطع الغيار
          </h1>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-3">
              <StarRating rating={Math.round(Number(avgRating))} size="w-5 h-5" />
              <span className="font-body text-base text-gray-900 font-bold">
                {avgRating} من 5
              </span>
              <span className="font-body text-sm text-gray-500">
                (بناءً على {reviews.length} تقييم للعملاء)
              </span>
            </div>
          )}
        </div>

        {/* Toggle form button */}
        <div className="mb-8">
          <Button
            data-testid="write-review-toggle"
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-primary text-white rounded-lg px-6 py-3 font-body font-bold"
          >
            {showForm ? "إلغاء النموذج" : "أضف تقييمك وتجربتك"}
          </Button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="max-w-lg mb-10 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="font-heading text-lg font-bold text-gray-900 mb-4">شاركنـا رأيك وتجربتك</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="الاسم الكريم *"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right"
                required
              />
              <Input
                placeholder="المدينة (مثال: الرياض، جدة)"
                value={form.customer_location}
                onChange={(e) => setForm({ ...form, customer_location: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right"
              />
              <Input
                placeholder="عنوان التقييم"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right"
              />
              <Textarea
                placeholder="تفاصيل تجربتك مع سرعة التوصيل وجودة قطع الغيار *"
                value={form.review_text}
                onChange={(e) => setForm({ ...form, review_text: e.target.value })}
                className="rounded-lg border-gray-300 font-body text-right min-h-[90px]"
                required
              />
              <Button type="submit" disabled={submitting} className="bg-brand-primary text-white rounded-lg font-body font-bold">
                {submitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl border border-gray-200 space-y-3 shadow-sm"
              >
                <StarRating rating={review.rating} />
                {review.title && (
                  <h4 className="font-heading text-base font-bold text-gray-900">
                    {review.title}
                  </h4>
                )}
                <p className="font-body text-sm text-gray-600 leading-relaxed">
                  "{review.review_text}"
                </p>
                <div className="pt-2 border-t border-gray-100 text-xs">
                  <span className="font-bold text-gray-900 block">{review.customer_name}</span>
                  {review.customer_location && (
                    <span className="text-gray-400 block">{review.customer_location}</span>
                  )}
                  {review.product_name && (
                    <span className="text-brand-accent font-bold mt-1 block">
                      القطعة المطلوبة: {review.product_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
